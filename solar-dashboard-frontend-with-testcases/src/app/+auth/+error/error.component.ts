import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Global } from '../../shared/global';
/**
 * This component adds the new user details
 */

@Component({
  selector: 'app-error-session',
  templateUrl: './error.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ErrorComponent implements OnInit {
  constructor() {
    if (Global.stompClient) {
      Global.stompClient.disconnect();
    }
    localStorage.setItem('Authentication', '')
    localStorage.setItem('currentUser', '');
    localStorage.setItem('userData', '');
    localStorage.setItem('userRole', '');
  }
  ngOnInit() { }
}
