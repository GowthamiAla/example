import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AlertNotificationService } from "../../utils/notification.service";
import { Global } from '../../global';
declare var $: any;

@Component({
  selector: 'sa-logout',
  template: `
  <div id="logout" (click)="showPopup()" >
        <span> <a routerlink="/login" title="Sign Out" data-action="userLogout"
                  data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i
          class="fa fa-lg fa-fw fa-sign-out"></i> <span class="menu-item-parent">{{'Logout'}}</span> </a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
    private alertNotificationService: AlertNotificationService) { }

  showPopup() {
    this.alertNotificationService.smartMessageBox({
      title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
      content: "You can improve your security further after logging out by closing this opened browser",
      buttons: '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        this.logout()
      }
    });
  }

  logout() {
    Global.stompClient.disconnect();
    this.logoutClearStorage() ;
  }

  logoutClearStorage() {
    // this.router.navigate(['/auth/login'])
    localStorage.setItem('currentUser', '')
    localStorage.setItem('Authentication', '')
    localStorage.setItem('userData', '')
    localStorage.setItem('userRole', '')
    localStorage.removeItem('driverData');
    localStorage.removeItem('loadAcceptedNumber');
    localStorage.removeItem('loadDetails');
    this.router.navigate(['/login'])
  }

  ngOnInit() {

  }



}
