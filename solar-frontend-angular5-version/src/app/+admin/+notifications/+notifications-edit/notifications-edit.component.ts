import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { NotificationService } from '../notifications.service'

import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';



import { endponitConfig } from '../../../environments/endpoints';
import { Global } from '../../../shared/global';
import { ActivitiesComponent } from '../../../shared/layout/header/activities/activities.component';
declare var SockJS;
declare var Stomp;
declare var $;


@Component({
  selector: 'notifications-edit',
  templateUrl: './notifications-edit.component.html',
  providers: [ActivitiesComponent, Global]

})
export class NotificationEditComponent implements OnInit {

  public stompClient;
  public jsonData;
  editNotificationError;

  public editNotificationData;

  moduleNames = [];
  grouped;

  // public notifications = new NotificationModel(true, false, false);

  constructor(private activitiesComponent: ActivitiesComponent,
    private notificationService: NotificationService, private route: ActivatedRoute,
    private router: Router, private cdr: ChangeDetectorRef) { }

  notificationOnChange(notificationData: any) {
    const editNotificationuserId = new userObjectModel(Number(localStorage.getItem('userData')))
    this.editNotificationData = new NotificationModel(
      notificationData.id,
      editNotificationuserId,
      notificationData.serviceevent,
      notificationData.email,
      notificationData.sms,
      notificationData.notificationCenter,
      notificationData.emailTemplate,
      notificationData.notificationTemplate,
      notificationData.phoneTemplate);

    this.notificationService.updateChannel(this.editNotificationData).subscribe(data => {
      if (data.data) {
        // this.websocketConnection(notificationData)
      }
      if (data.error != null) {
        this.editNotificationError = data.error.message;
        setTimeout(() => {
          this.editNotificationError = '';
        }, 5000);
      }

    }, error => {
      this.editNotificationError = error.message;
      setTimeout(() => {
        this.editNotificationError = '';
      }, 5000);
    })
  }

  websocketConnection(notificationData) {
    if (notificationData.notificationCenter) {
    //  this.activitiesComponent.getAllEventsCodes();


    } else {
      Global.stompClient.unsubscribe(
        '/topic/' + localStorage.getItem('userData') + '/' + notificationData.serviceevent.code, (response) => {
        });
    }
  }
  notificationCenterOnOff(data, eventCode) {
    if (data) {
   //   this.activitiesComponent.subscribeEventsOnSelection(eventCode.code);
    }else {
      Global.stompClient.unsubscribe('/topic/' + localStorage.getItem('userData') + '/' + eventCode.code, (response) => {
      });
    }
  }

  ngOnInit() {
    const last = null;
    this.notificationService.getChannels().subscribe(data => {
      this.jsonData = data.data;
      this.grouped = _.groupBy(this.jsonData, (item: any) => {
        this.moduleNames.push(item.serviceevent.module);
        return item.serviceevent.module;
      });
      this.moduleNames = this.uniq(this.moduleNames)
      //  this.router.navigate(['notifications/notificationssettings'])
    }, error => {
      console.log(error)

    })


  }

  public uniq(a) {
    return a.sort().filter((item, pos, ary) => {
      return !pos || item != ary[pos - 1];
    })
  }





}




export class NotificationModel {
  constructor(
    public id: number,
    public user: userObjectModel,
    public serviceevent: ServiceeventModel,
    public email: boolean,
    public sms: boolean,
    public notificationCenter: boolean,
    public emailTemplate: string,
    public notificationTemplate: string,
    public phoneTemplate: string
  ) { }

}
export class ServiceeventModel {
  constructor(
    public code: string,
    public event: string,
    public module: string,
  ) { }
}
export class userObjectModel {
  constructor(
    public id: number,

  ) { }
}


@Pipe({
  name: 'ticketsGrouping',
  pure: false
})

export class TicketsGrouping implements PipeTransform {

  transform(items: any, conditions: { [field: string]: any }): Array<any> {
    if (items !== undefined) {
      return items.filter(item => {
        for (const field in conditions) {
          if (item.serviceevent[field] !== conditions[field]) {
            return false;
          }
        }
        return true;
      });


    }
  }
}
