import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FadeInTop } from "../../../shared/animations/fade-in-top.decorator";

import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
//import { ActivitiesComponent } from '../../shared/layout/header/activities/activities.component';
//import { ActivitiesService } from '../../shared/layout/header/activities/activities.service';
import { endponitConfig } from '../../../../environments/endpoints';
import { Global } from '../../../shared/global';
import * as _ from 'lodash';

import { AlertNotificationService } from "../../../shared/utils/notification.service";


declare var SockJS;
declare var Stomp;
@FadeInTop()
@Component({
  selector: 'datatables-users-add',
  templateUrl: './add-user.component.html',
  providers: []

})
export class AddUserComponent implements OnInit {
  public complexForm: FormGroup;
  public username: AbstractControl;
  public email: AbstractControl;
  public phone: AbstractControl;
  public roles: AbstractControl;
  submitted: boolean = false;
  userError;

  datauserRoles: any;
  userRoles = new Array<{ name: string }>();
  userDetails = new UserModel('', '', '', '', this.userRoles);

  stompClient;


  constructor(private alertNotificationService: AlertNotificationService, private userService: UserService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) {
    this.complexForm = fb.group({
      username: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      phone: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,10}$')], )],
      roles: [null, Validators.compose([Validators.required])]

    })
    this.username = this.complexForm.controls['username'];
    this.email = this.complexForm.controls['email'];
    this.phone = this.complexForm.controls['phone'];
    this.roles = this.complexForm.controls['roles'];
    this.userError = '';
  }

  ngOnInit() {

  }


  addUser() {

    // Global.stompClient.send("/app/" + localStorage.getItem('userData') + "/updateUser", {}, "User Update Successfully")

    let data = {
      "name": this.datauserRoles
    }
    this.userDetails.roles[0] = data
 //   console.log(JSON.stringify(this.userDetails))
    this.userService.addUser(this.userDetails).subscribe(
      data => {
        if (data.data) {
          this.userError = ''; 
          this.router.navigate(['/admin/users', { data: "ASuccess" }])
          console.log("Success")
          //this.notificationExample7(this.userSuccess)
        } else if(data.error){
          this.userError = data.error.message;
  setTimeout(() =>{
            this.userError='';
         }, 5000);

        }
      },
      error => {
        console.log("Error")
        this.userError ='Failed to Create User';
        if (error.status == 401) {
          localStorage.setItem('status', error.status)
          this.router.navigate(['/error']);
        }
      });
  }

  //cancel user button
  cancelUser(){
    this.userError = '';
    this.router.navigate(['/admin/users'])
  }

  // notificationExample7(a) {
  //   this.alertNotificationService.smallBox({
  //     // title: "James Simmons liked your comment",
  //     content: a,
  //     color: "#296191",
  //     //iconSmall: "",
  //     timeout: 4000
  //   });
  // }

}


export class UserModel {
  constructor(
    public name: string,
    public email: string,
    public phone: string,
    public active: string,
    public roles: UserRolesModel[]) { }
}
export class UserRolesModel {
  constructor(
    public name: string
  ) {
  }
}

