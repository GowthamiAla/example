import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LayoutService } from '../../shared/layout/layout.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styles: []
})
export class ForgotComponent implements OnInit {
  public errorMessage: string;
  userRegisterModel = new UserRegisterModel('', '');

  public complexForm: FormGroup;
  public email: AbstractControl;
  public phone: AbstractControl;
  public forgotPasswordResponce;
  submitted = false;
  loading = false;


  constructor(private router: Router,
    private fb: FormBuilder, private layoutService: LayoutService, private authService: AuthService) {
    this.complexForm = fb.group({
      email: [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      phone: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,10}$')], )]

    })

    this.email = this.complexForm.controls['email'];
    this.phone = this.complexForm.controls['phone'];


  }

  ngOnInit() {
    this.layoutService.setCustomTheme();
  }

  submit(event) {
    this.submitted = true;
    this.loading = true;
    this.authService.userForgotPassword(event.email, event.phone).subscribe(
      data => {
        this.forgotPasswordResponce = data;
        if (data.data != null) {
          this.errorMessage = '';
          localStorage.setItem('userData', data.data.id)
          this.loading = false;
          this.router.navigate(['/otp', { data: 'Success' }])
        } else {
          this.loading = false;
          this.errorMessage = data.error.message;
        }
      },
      error => {
        // this.loginErrorMessgae = 'Please Enter Valid Login Credentials.';
        this.loading = false;
        console.log('Error')
      });
  }




}

export class UserRegisterModel {
  constructor(

    public email: string,
    public phone: string
  ) { }
}
