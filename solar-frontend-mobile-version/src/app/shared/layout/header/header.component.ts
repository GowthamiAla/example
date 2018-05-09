import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HealthJsonApiService } from './health.service';
import { AuthService } from '../../../+auth/auth.service';

import { AlertNotificationService } from "../../utils/notification.service";

import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
  styles: [`.headerLogo { padding-top: 10px;
    padding-right: 2px;}`]
})
export class HeaderComponent implements OnInit {

  public state: any
  public netWorkInfo;

  public onTime;
  public offTime;

  constructor(private alertNotificationService: AlertNotificationService, private router: Router, private healthJsonApiService: HealthJsonApiService, private authService: AuthService) {
  }

  ngOnInit() {
    this.netWorkInfo = true;

    document.addEventListener("offline", () => {
      console.log('Using Cordova plugins with Angular 2. Cordova version: offline ');
      // this._networkinfo.globalVarNetwork = false;
      // console.log(this._networkinfo.globalVarNetwork);
      // this.pagetop.networkValuechnageFunc(this._networkinfo.globalVarNetwork);


      window.localStorage.setItem("netWotkInfo", "offline");
      // this.toastr.info('Network connection lost');
      console.log('offline')
      this.offTime = moment().format();
      this.netWorkInfo = false;

      alert('Network Connection lost...');

    }, false)

    document.addEventListener("online", () => {
      // this._networkinfo.globalVarNetwork = true;
      // console.log(this._networkinfo.globalVarNetwork);
      // this.pagetop.networkValuechnageFunc(this._networkinfo.globalVarNetwork);
      window.localStorage.setItem("netWotkInfo", "online");
      // this.toastr.info('Network connection establlished');    
      console.log('online')
      this.onTime = moment().format();
      this.netWorkInfo = true;

      alert('Network Re-connected');
      // this.offlineMessages();
    }, false)
  }

  duration: any;
  networkStateInfo;
  networkStateInfoMessage;
  lastSeenTime() {
    this.networkStateInfo = true;
    if (!this.netWorkInfo) {
      this.onTime = moment().format();
      this.duration = moment.duration(moment(this.onTime).diff(moment(this.offTime)));
      var hours = parseInt(this.duration.asHours());
      var minutes = parseInt(this.duration.asMinutes());
      var seconds = parseInt(this.duration.asSeconds());

      if (seconds > 59) {
        if (minutes > 59) {
          if (hours > 23) { } else {
            let body = 'hours ' + hours + ' minutes ' + minutes;
            // this.notificationAlert(body);
            this.networkStateInfoMessage = body;
          }
        } else {
          let minutesBody = minutes + ' minutes'
          //this.notificationAlert(minutesBody);
          this.networkStateInfoMessage = minutesBody;
        }
      } else {
        let secondsBody = seconds + ' second(s)';
        // this.notificationAlert(secondsBody);
        this.networkStateInfoMessage = secondsBody;
      }
      // alert(hours + ' hour and ' + (minutes - hours * 60) + ' minutes' + (seconds - minutes * 60) + 'seconds')
    }

  }

  notificationAlert(body) {
    this.alertNotificationService.smallBox({
      title: "Network Info..",
      content: 'you have lost network connectivity since ' + body + ' ago',
      color: "#296191",
      timeout: 2000
    });
  }

  searchMobileActive = false;

  toggleSearchMobile() {
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  homeView() {
    this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }
}
