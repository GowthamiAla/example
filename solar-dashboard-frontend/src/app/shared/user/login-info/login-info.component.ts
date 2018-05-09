import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { LayoutService } from "../../layout/layout.service";

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {
  user = new UserInfo('', '', null);
  constructor(
    private userService: UserService,
    private layoutService: LayoutService) {
  }

  ngOnInit() {
    // this.userService.getLoginInfo().subscribe(user => {
    //   this.user.username = localStorage.getItem('currentUser');
    //   this.user.picture = user.picture;
    //   this.user.activity = user.activity;
    // })

    let user = {
      "username": "John Doe",
      "picture": "assets/img/avatars/sunny.png",
      "activity": 12
    }
    this.user.username = localStorage.getItem('UserName');
    this.user.picture = user.picture;
    this.user.activity = user.activity;
  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}
export class UserInfo {
  constructor(
    public username: string,
    public picture: string,
    public activity: number
  ) { }
}
