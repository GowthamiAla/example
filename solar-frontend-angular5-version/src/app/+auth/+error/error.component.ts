import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Global } from '../../shared/global';
import { LayoutService } from '../../shared/layout/layout.service';
/**
 * This component adds the new user details
 */

@Component({
  selector: 'app-error-session',
  templateUrl: './error.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ErrorComponent implements OnInit {
  constructor(private layoutService: LayoutService) {
    //set default theme
    this.layoutService.setCustomTheme();

    //disconnecting websocket
    if (Global.stompClient) {
      Global.stompClient.disconnect();
    }

    //clearing the loalfield variables
    localStorage.setItem('Authentication', '')
    localStorage.setItem('currentUser', '');
    localStorage.setItem('userData', '');
    localStorage.setItem('userRole', '');
  }
  ngOnInit() { }
}
