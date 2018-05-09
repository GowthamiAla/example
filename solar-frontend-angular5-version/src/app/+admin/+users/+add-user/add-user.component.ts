import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';

import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { endponitConfig } from '../../../../environments/endpoints';
import { Global } from '../../../shared/global';
import * as _ from 'lodash';




declare var SockJS;
declare var Stomp;

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
  submitted = false;
  public userTypeRoles;
  userError;
  public serviceErrorResponse;
  public serviceErrorData;
  public addUserResponse;
  datauserRoles: any;
  userRoles = new Array<{ name: string }>();
  userDetails = new UserModel('', '', '', '', this.userRoles);

  stompClient;


  constructor(private userService: UserService,
    private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) {
    this.datauserRoles = '';
    this.complexForm = fb.group({
      username: [null, Validators.compose([Validators.required,
      Validators.minLength(3), Validators.maxLength(32), Validators.pattern('[a-zA-Z*" "]+')])],
      email: [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      phone: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,16}$')], )],
      roles: [null, Validators.compose([Validators.required])]

    })
    this.username = this.complexForm.controls['username'];
    this.email = this.complexForm.controls['email'];
    this.phone = this.complexForm.controls['phone'];
    this.roles = this.complexForm.controls['roles'];
    this.userError = '';
  }

  ngOnInit() {
    this.getUserTypeRoles();
  }


  getUserTypeRoles() {
    this.userService.getAllUserRoleTypes().subscribe(
      data => {
        this.userTypeRoles = data;
      },
      error => {
        console.log('Unable to get user roles types' + error.error.message)
      });
  }


  addUser() {

    // Global.stompClient.send("/app/" + localStorage.getItem('userData') + "/updateUser", {}, "User Update Successfully")

    const data = {
      'name': this.datauserRoles
    }
    this.userDetails.roles[0] = data
    this.userService.addUser(this.userDetails).subscribe(
      jsondata => {
        this.addUserResponse = jsondata;
        if (jsondata.data) {
          this.userError = '';
          this.router.navigate(['/admin/users', { data: 'ASuccess' }])
          // this.notificationExample7(this.userSuccess)
        } else if (jsondata.error) {
          this.userError = jsondata.error.message;
          setTimeout(() => {
            this.userError = '';
          }, 5000);

        }
      },
      error => {
        console.log('Error')
        this.serviceErrorResponse = error.exception;
        this.serviceErrorData = true;
        this.userError = 'Failed to Create User';
        if (error.status === 401) {
          localStorage.setItem('status', error.status)
          this.router.navigate(['/error']);
        }
      });
  }

  // cancel user button
  cancelUser() {
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

