import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../shared/layout/layout.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  userRegisterModel = new UserRegisterModel('', '', '');
  public errorMessage: string;
  public complexForm: FormGroup;
  public name: AbstractControl;
  public email: AbstractControl;
  public phone: AbstractControl;
  submitted = false;
  loading = false;
  public loginErrorMessgae: string;
  public registrationResponse;


  constructor(private router: Router, private authService: AuthService, private layoutService: LayoutService, private fb: FormBuilder) {
    this.complexForm = fb.group({
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      phone: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,10}$')], )]

    })
    this.name = this.complexForm.controls['name'];
    this.email = this.complexForm.controls['email'];
    this.phone = this.complexForm.controls['phone'];


  }

  ngOnInit() {
    //for default custom theme 
    this.layoutService.setCustomTheme();
  }
  register(event) {
    this.loginErrorMessgae = '';
    this.submitted = true;
    this.loading = true;
    this.authService.userRegister(event).subscribe(
      data => {
        this.registrationResponse = data;
        if (data.data != null) {
          this.loginErrorMessgae = '';
          localStorage.setItem('userData', data.data.id)
          this.loading = false;
          // this.notificationAlert('OTP has been sent to the registered mobile number/Email')
          this.router.navigate(['/otp', { data: 'Success' }])
        } else {
          this.loading = false;
          this.loginErrorMessgae = data.error.message;
          console.log(data.error.message)
        }
      },
      error => {
        // this.loginErrorMessgae = 'Please Enter Valid Login Credentials.';
        this.loading = false;
      });

  }



}


export class UserRegisterModel {
  constructor(
    public name: string,
    public email: string,
    public phone: string
  ) { }
}
