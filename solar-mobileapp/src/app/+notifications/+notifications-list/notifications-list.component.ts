import { Component, OnInit, Input, } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NotificationService } from '../notifications.service'
import { endponitConfig } from '../../../environments/endpoints';

import { ActivitiesService } from '../../shared/layout/header/activities/activities.service';

//import { EventsService } from '../../+calendar/shared/events.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment'


declare var $: any;

@Component({
  selector: 'notifications-list',
  templateUrl: './notifications-list.component.html',
  styles: [`
   .widgetBody{
        padding-top:20px !important;
    }`]
})
export class NotificationListComponent implements OnInit {
  public notifications = new NotificationModel(true, false, false);
  activities: any;
  currentActivity: any;
  grouped: any;
  count: any;
  eventListData: any;
  eventsListResponse: any;
  currentView: any;
  currentCalendarActivity: any;
  calendarGrouped: any;

  constructor(private route: ActivatedRoute,private notificationService: NotificationService, private router: Router, private activitiesService: ActivitiesService) {
    this.activities = [];
    this.currentActivity = [];
    this.grouped = [];
    this.currentCalendarActivity = [];
    this.calendarGrouped = [];
  }
  ngOnInit() {
    // this.notificationsList();
    // this.calendarEventsList();
    this.notificationsCalendarList();
  }

  public notificationsList() {
    this.notificationService.getNotifications().subscribe(data => {
      this.activities = data.data;
      if (data.data) {
        this.count = this.activities.length;
        this.currentActivity = this.activities.sort((a, b) => {
          return a.lastUpdateTime < b.lastUpdateTime ? 1 : -1;
        });
        this.grouped = _.groupBy(this.activities, (item: any) => {
          return moment(item.lastUpdateTime).format("dddd, MMMM Do YYYY");
        });
        this.grouped = _.values(this.grouped)
        //  this.router.navigate(['notifications/notificationssettings'])
        console.log("Success")
      }
    }, error => {
      console.log("Error")
      console.log(error)
    })
  }


  // public calendarEventsList() {
  //   this.eventsService.getFilterDateEvents('2017-07-01T00:00:00+05:30', '2017-09-01T00:00:00+05:30').then(response => {
  //     this.eventsListResponse = response;
  //     //this.calendarDataCount = this.eventsListResponse.data.length;
  //     // this.eventListData = this.eventsListResponse.data.sort((a, b) => {
  //     //   return a.lastUpdateTime < b.lastUpdateTime ? 1 : -1;
  //     // });



  //     this.currentCalendarActivity = this.eventsListResponse.data.sort((a, b) => {
  //       return a.lastUpdateTime < b.lastUpdateTime ? 1 : -1;
  //     });
  //     this.calendarGrouped = _.groupBy(this.eventsListResponse.data, (item: any) => {

  //       return moment(item.lastUpdateTime).format("dddd, MMMM Do YYYY");
  //     });
  //     this.calendarGrouped = _.values(this.calendarGrouped)
  //   })
  // }

  public notificationsCalendarList() {

    this.route.params.subscribe(params => {
      let data:any = params;
      console.log(data.data)
      if (data.data == 'calendarsList') {
        this.currentView = 'calendarsList'
       // this.calendarEventsList()

      } else {
        this.currentView = 'notificationsList'

        this.notificationsList();

      }
    })
  }



}




export class NotificationModel {
  constructor(
    public email: boolean,
    public phone: boolean,
    public websocket: boolean
  ) { }
}
