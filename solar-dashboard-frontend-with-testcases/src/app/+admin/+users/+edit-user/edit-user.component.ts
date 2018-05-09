import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';

import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';

import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';



import { AlertNotificationService } from '../../../shared/utils/notification.service';


import { endponitConfig } from '../../../../environments/endpoints';
import { Global } from '../../../shared/global';
import { ActivitiesComponent } from '../../../shared/layout/header/activities/activities.component';
declare var SockJS;
declare var Stomp;
declare var $;


@FadeInTop()
@Component({
  selector: 'datatables-users-edit',
  templateUrl: './edit-user.component.html',
  providers: [ActivitiesComponent, Global]

})
export class EditUserComponent implements OnInit {
  public complexForm: FormGroup;
  public username: AbstractControl;
  public email: AbstractControl;
  public phone: AbstractControl;
  public roles: AbstractControl;
  submitted = false;
  userRoles: string;
  userDetails: any = {};
  userEditMessage;
  public serviceErrorResponse;
  public serviceErrorData;

  stompClient;


  constructor(private activitiesComponent: ActivitiesComponent, private alertNotificationService: AlertNotificationService,
    private userService: UserService, private route: ActivatedRoute, private fb: FormBuilder,
    private router: Router, private cdr: ChangeDetectorRef) {
    this.userRoles = '';
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

  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      params.forEach((params: Params) => {
        if (params['userId'] !== undefined) {
          const userId: string = +params['userId'] + '';
          //  this.navigated = true;
          this.userService.getUserDetailsByID(userId).then(user => {
            this.userDetails = user;
            if (this.userDetails.roles) {
              for (const uRoles of this.userDetails.roles) {
                this.userRoles = uRoles.name;
              }
              if (this.userRoles === undefined) {
                this.userRoles = 'USER';
              }
            }
            this.cdr.detectChanges();
          }).catch(this.handleError);
        } else {
          // this.navigated = false;

        }
      })
    });

  }

  private handleError(error: any) {
    if (error.status == 500 || error.status == 404) {
      error = error.json();
      this.serviceErrorResponse = error.exception;
      this.serviceErrorData = true;
      return Observable.throw(error._body);
    } else {
      localStorage.setItem('status', '401')
      // 401 unauthorized response so log user out of client
      window.location.href = '/#/error';
      return Observable.throw(error._body);
    }
  }
  updateUser() {



    if (this.userDetails.roles.length !== 0) {
      this.userDetails.roles[0].name = this.userRoles;
    } else {
      const userRolesrDetails = {
        'name': this.userRoles
      }
      //  this.userDetails.roles=this.userDetails;
      this.userDetails.roles.push(userRolesrDetails)
    }

    this.userService.updateUser(this.userDetails).subscribe(
      data => {
        if (data.error === null) {
          this.userEditMessage = '';
          if (this.userDetails.id === Number(localStorage.getItem('userData'))) {
            // localStorage.setItem('userRole', this.userRoles);
            // this.router.navigate(['/admin/users', { data: 'USuccess' }])
            this.showPopup();
          } else {
            this.router.navigate(['/admin/users', { data: 'USuccess' }])
          }
        } else {
          this.userEditMessage = data.error.message;
          setTimeout(() => {
            this.userEditMessage = '';
          }, 5000);
        }
        // this.notificationExample7();
      },
      error => {
        this.serviceErrorResponse = error.exception;
        this.serviceErrorData = true;
        this.userEditMessage = 'Failed to Update User';
        localStorage.setItem('status', '401')
        this.router.navigate(['/error']);
      });



  }

  showPopup() {
    this.alertNotificationService.smartMessageBox({
      title: '<i class="fa fa-sign-out txt-color-orangeDark"></i> User details updated successfully' +
        ' <span class="txt-color-orangeDark"><strong>' + $('#show-shortcut').text() + '</strong></span> ?',
      content: 'To view updated changes you need to re-login',
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed === 'Yes') {
        localStorage.setItem('currentUser', '');
        localStorage.setItem('Authentication', '');
        localStorage.setItem('userData', '');
        localStorage.setItem('userRole', '');
        this.router.navigate(['/login']);
      }
    });
  }
  // cancel user edit button
  cancelEditUser() {
    this.userEditMessage = '';
    this.router.navigate(['/admin/users']);
  }
  // notificationExample7() {
  //   this.alertNotificationService.smallBox({
  //     // title: "James Simmons liked your comment",
  //     content: 'User Edit Successfully',
  //     color: "#296191",
  //     //iconSmall: "",
  //     timeout: 4000
  //   });
  // }

}
