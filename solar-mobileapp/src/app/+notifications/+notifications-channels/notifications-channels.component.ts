import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { NotificationService } from '../notifications.service'


import { endponitConfig } from '../../../environments/endpoints';

declare var SockJS;
declare var Stomp;

@FadeInTop()
@Component({
  selector: 'notifications-edit',
  templateUrl: './notifications-channels.component.html',

})
export class NotificationChannelsComponent implements OnInit {

  public channelLoginError;
  public stompClient;

  public serviceEvent = new ServiceeventModel('', '', '');
  public notificationChannel = new NotificationModel(null, this.serviceEvent, true, false, true,'','');

  constructor(private notificationService: NotificationService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() { }


  channelCreation() {

  }
  notificationChannelUpdate(channelsData: any) {

    console.log(JSON.stringify(channelsData))
    if (channelsData.serviceevent.code != '' && channelsData.serviceevent.module != '' && channelsData.serviceevent.event != '') {
      this.channelLoginError = '';
      this.notificationService.updateChannel(channelsData).subscribe(data => {
        console.log(data)
        this.router.navigate(['notifications/notificationssettings'])
        console.log("Success")
      }, error => {
        console.log("Error")
        console.log(error)
        this.channelLoginError = error.message;
      })

    } else
      this.channelLoginError = 'Add Module Code,Module Name and Event';

  }

  public webSocketConnection() {
    // var socket = new WebSocket(process.env.WEBSOCKET_ENDPOINT);
    var socket = new SockJS(endponitConfig.WEBSOCKET_ENDPOINT,
      null,
      {
        transports: ['xhr-streaming'],
        headers: { 'Authorization':localStorage.getItem('Authentication') }
      });
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame) => {
      // this.channels.forEach(channel => {
      this.stompClient.subscribe('/topic/' + localStorage.getItem('userData') + '/updateUser', (response) => {
        console.log(response)

        // this.activitiesComponent.notificationCount();

      });
      //})*/
    });


  }


}




export class NotificationModel {

  constructor(

    public user: number,
    public serviceevent: ServiceeventModel,
    public email: boolean,
    public sms: boolean,
    public notificationCenter: boolean,
    public emailTemplate:string,
    public phoneTemplate:string
  ) { }


}

export class ServiceeventModel {
  constructor(
    public code: string,
    public event: string,
    public module: string,
  ) { }
}




