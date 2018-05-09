import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';

import { AlertNotificationService } from '../../shared/utils/notification.service';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styles: []
})
export class OtpComponent implements OnInit {
  userRegisterModel = new UserOTPModel('', '');
  public errorMessage: string;
  public submitted: boolean;

  public complexForm: FormGroup;
  public otp: AbstractControl;
  public password: AbstractControl;
  public retypePassword: AbstractControl;
  public otpResponse;
  loading = false;
  public forgotPasswordMessage: string;

  constructor(private alertNotificationService: AlertNotificationService,
    private route: ActivatedRoute, private router: Router, private authService: AuthService, private fb: FormBuilder) {

    this.complexForm = fb.group({
      otp: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{6,6}$')])],
      password: [null, Validators.compose([Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[~!@#$%^&+=]).{6,32}$')])],
      retypePassword: ['', Validators.required]
    }, { validator: this.MatchPassword })
    this.otp = this.complexForm.controls['otp'];
    this.password = this.complexForm.controls['password'];
    this.retypePassword = this.complexForm.controls['retypePassword'];
  }
  MatchPassword(control: FormControl) {
    const password = control.get('password').value; // to get value in input tag
    const confirmPassword = control.get('retypePassword').value;
    // to get value in input tag
    if (confirmPassword != null) {
      if (password !== confirmPassword) {
        control.get('retypePassword').setErrors({ MatchPassword: true })
      } else {
        return null
      }
    }
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.data !== undefined) {
        if (params.data === 'Success') {
          this.forgotPasswordMessage = 'OTP has been sent to the registered Mobile Number/Email';
        }
      }
    })
  }

  register(event) {
    this.submitted = true;
    this.loading = true;
    this.authService.userOTP(event.otp, event.password).subscribe(
      data => {
        this.otpResponse = data;
        if (data.data != null) {
          this.errorMessage = '';
          localStorage.setItem('userRole', data.data.roles[0].name);
          //  localStorage.setItem('currentUser', data.data.email);
          localStorage.setItem('Authentication', btoa(data.data.email + ':' + event.password))
          //  this.router.navigate(['/login'])
          this.loading = false;
          // this.notificationAlert('Now you can Login with valid Credentilas');
          this.router.navigate(['/login', { data: 'Success' }])

        } else {
          this.loading = false;
          this.errorMessage = data.error.message;
          console.log(data.error.message)
        }


      },
      error => {
        this.loading = false;
        this.errorMessage = 'Enter  OTP and Password';
      });


    // if (event.otp == '123') {
    //    this.errorMessage=''
    //   this.router.navigate(['/login'])
    // }else if(event.otp != '123' && event.otp != ''){
    //    this.errorMessage='Invalid OTP'
    // }
    // else if(event.otp == ''){
    //    this.errorMessage='Enter  OTP and Password';
    // }

  }

  notificationAlert(a) {
    this.alertNotificationService.smallBox({
      // title: 'James Simmons liked your comment',
      content: a,
      color: '#296191',
      // iconSmall: '',
      timeout: 4000
    });
  }
}
export class UserOTPModel {
  constructor(

    public password: string,
    public otp: string
  ) { }
}
