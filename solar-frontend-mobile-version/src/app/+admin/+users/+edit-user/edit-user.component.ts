import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';

import { FadeInTop } from "../../../shared/animations/fade-in-top.decorator";

import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';


//import { ActivitiesService } from '../../shared/layout/header/activities/activities.service';

import { AlertNotificationService } from "../../../shared/utils/notification.service";


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
  submitted: boolean = false;
  userRoles: string;
  userDetails: any = {};
  userEditMessage;

  stompClient;


  constructor(private activitiesComponent: ActivitiesComponent, private alertNotificationService: AlertNotificationService, private userService: UserService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) {
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

  }

  ngOnInit() {

    // this.activitiesComponent.webSocketConnection();

    this.route.params.forEach((params: Params) => {
      console.info("Getting driver deails by Id started");
      if (params['userId'] !== undefined) {
        let userId: string = +params['userId'] + "";
        //  this.navigated = true;
        this.userService.getUserDetailsByID(userId).then(user => {
          this.userDetails = user;
          if (this.userDetails.roles) {
            for (let uRoles of this.userDetails.roles) {
              this.userRoles = uRoles.name;
            }
            if (this.userRoles === undefined) {
              this.userRoles = 'USER';
            }
          }


          this.cdr.detectChanges();
        }).catch(this.handleError);
        console.info("Getting driver deails by Id ended");
      } else {
        //this.navigated = false;

      }
    });

  }

  private handleError(error: any) {    
      localStorage.setItem('status', '401')
      // 401 unauthorized response so log user out of client
      window.location.href = '/#/error';
          return Observable.throw(error._body);
  }
  updateUser() {



    if (this.userDetails.roles.length != 0)
      this.userDetails.roles[0].name = this.userRoles;
    else {
      let userRolesrDetails = {
        "name": this.userRoles
      }
      //  this.userDetails.roles=this.userDetails;
      this.userDetails.roles.push(userRolesrDetails)
    }

    this.userService.updateUser(this.userDetails).subscribe(
      data => {
        if (data.error === null) {
          this.userEditMessage='';
          if (this.userDetails.id == Number(localStorage.getItem('userData'))) {
            // localStorage.setItem('userRole', this.userRoles);
            // this.router.navigate(['/admin/users', { data: "USuccess" }])
            this.showPopup();
          } else {
            this.router.navigate(['/admin/users', { data: "USuccess" }])
          }
          console.log("Success")
        }
        else {
         this.userEditMessage= data.error.message;
         setTimeout(() =>{
            this.userEditMessage='';
         }, 5000);
        }
        //this.notificationExample7();
      },
   error => {
        this.userEditMessage = 'Failed to Update User';
          localStorage.setItem('status', '401')
          this.router.navigate(['/error']);
        console.log("Error")
      });



  }

  showPopup() {
    this.alertNotificationService.smartMessageBox({
      title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
      content: "For updating changes you need to re-login",
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        localStorage.setItem('currentUser', '');
        localStorage.setItem('Authentication', '');
        localStorage.setItem('userData', '');
        localStorage.setItem('userRole', '');
        this.router.navigate(['/login']);
      }
    });
  }
  //cancel user edit button
  cancelEditUser(){
    this.userEditMessage = '';
    this.router.navigate(['/admin/users']);
  }
}
