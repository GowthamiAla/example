import { Component, OnInit } from '@angular/core';
import { LoginInfoComponent } from "../../user/login-info/login-info.component";
import { AuthGuard } from '../../../+auth/guards/index';
import { LayoutService } from "../layout.service";
@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  public userRole;
  public widgetNames;
  constructor(private AuthGuard: AuthGuard, private layoutService: LayoutService) {
    this.userRole = localStorage.getItem('userRole');

    if (localStorage.getItem('widget') != null) {
      this.widgetNames = localStorage.getItem('widget').split(",");
    }
  }

  ngOnInit() {

  }
  onToggle() {
    if (this.layoutService.store.mobileViewActivated) {
      this.layoutService.onCollapseMenu()
    }

  }
}
