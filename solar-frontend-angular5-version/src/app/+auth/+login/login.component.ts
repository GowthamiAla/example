import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';

import { endponitConfig } from '../../../environments/endpoints';
import { Global } from '../../shared/global';

import { config } from '../../shared/smartadmin.config';
import { LayoutService } from '../../shared/layout/layout.service';


declare var SockJS;
declare var Stomp;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  userLogin = new UserLoginModel('', '');
  public loginErrorMessgae;
  public complexForm: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  submitted = false;
  public otpNotification: string;
  loading = false;
  stompClient;
  isActivated: boolean;
  public loginResponse;


  constructor(private router: Router, private layoutService: LayoutService, private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder, ) {
    this.complexForm = fb.group({
      email: [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      password: [null, Validators.compose([Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[~!@#$%^&+=]).{6,32}$')])]
    })
    this.email = this.complexForm.controls['email'];
    this.password = this.complexForm.controls['password'];

    //localStorage.setItem('token', 'liF3pCIgkTqUp1dci93mZia8qS4xD0MnzLhbM7fPWRA=')

  }

  ngOnInit() {
    //set default theme
    this.layoutService.setCustomTheme();
    //state pramas for messages
    this.route.params.subscribe(params => {
      if (params.data !== undefined) {
        if (params.data === 'Success') {
          this.otpNotification = 'Now you can Login with valid credentials';
        }
      }
    })
  }

  login(event) {
    this.submitted = true;
    this.loading = true;
    this.authService.login(this.userLogin.username, this.userLogin.password).subscribe(
      data => {
        this.loginResponse = data;
        if (data.error === null) {
          const role: any = data.data.roles[0].name;
          if (role !== 'DRIVER') {
            localStorage.setItem('userRole', data.data.roles[0].name);
            localStorage.setItem('currentUser', data.data.email);
            localStorage.setItem('UserName', data.data.name);
            localStorage.setItem('userData', data.data.id);
            console.log('Login Successs')
            // websocket connection establishment
            // this.webSocketConnection();

            this.loginErrorMessgae = '';
            this.loading = false;
            localStorage.setItem('status', '');
            if (role === 'DCMANAGER') {
              this.router.navigate(['/dcmanagerloads']);
            } else {
              this.router.navigate(['/dashboard/analytics'])
            }

          } else {
            this.loginErrorMessgae = 'Please Enter Valid Login Credentials.';
            localStorage.setItem('Authentication', '')
            setTimeout(() => {
              this.loginErrorMessgae = ''
            }, 5000);
          }
        } else {
          this.loginErrorMessgae = data.error.message;
          localStorage.setItem('Authentication', '')
          // this.loginErrorMessgae = error.message;
          setTimeout(() => {
            this.loginErrorMessgae = ''
          }, 5000);
        }
        this.loading = false;

      },
      error => {

        //  alert(error)
        localStorage.setItem('Authentication', '')
        this.loginErrorMessgae = 'Please Enter Valid Login Credentials.'
        this.loading = false;
      });
  }


  userAuthentication(event) {
    this.submitted = true;
    this.loading = true;
    this.authService.userAuthentication(this.userLogin.username, this.userLogin.password).subscribe(
      response => {
        if (response.status === 200) {
          this.authService.getUserDetailsByEmail(this.userLogin.username).subscribe(data => {
            this.loginResponse = data;
            if (data.error === null) {
              const role: any = data.data.roles[0].name;
              if (role !== 'DRIVER') {
                localStorage.setItem('userRole', data.data.roles[0].name);
                localStorage.setItem('currentUser', data.data.email);
                localStorage.setItem('UserName', data.data.name);
                localStorage.setItem('userData', data.data.id);
                console.log('Login Successs')
                // websocket connection establishment
                // this.webSocketConnection();
                this.loginErrorMessgae = '';
                this.loading = false;
                localStorage.setItem('status', '');
                if (role === 'DCMANAGER') {
                  this.router.navigate(['/dcmanagerloads']);
                } else {
                  this.router.navigate(['/dashboard/analytics'])
                }
              } else {
                this.loginErrorMessgae = 'Please Enter Valid Login Credentials.';
                localStorage.setItem('Authentication', '')
                setTimeout(() => {
                  this.loginErrorMessgae = ''
                }, 5000);
              }
            } else {
              this.loginErrorMessgae = data.error.message;
              localStorage.setItem('Authentication', '')
              // this.loginErrorMessgae = error.message;
              setTimeout(() => {
                this.loginErrorMessgae = ''
              }, 5000);
            }
            this.loading = false;
          }, error => {
            this.loading = false;
            this.loginErrorMessgae = 'Please Enter Valid Login Credentials.';
            setTimeout(() => {
              this.loginErrorMessgae = ''
            }, 5000);
          });
        }
      },
      error => {
        this.loginErrorMessgae = 'Please Enter Valid Login Credentials.';
        this.loading = false;
        setTimeout(() => {
          this.loginErrorMessgae = ''
        }, 5000);
        this.loginErrorMessgae = JSON.parse(error._body).message;
      });
  }




  // getAllEventsCodes() {
  //   this.authService.getAllWebSocketConnections().subscribe(
  //     data => {
  //       if (data) {
  //         data.forEach(eventCode => {
  //           Global.stompClient.subscribe(localStorage.getItem('userData') + '/' + eventCode, (response) => {
  //             console.log(response)
  //           });
  //         });
  //       }
  //     },
  //     error => {
  //     });
  // }

  public webSocketConnection() {
    // var socket = new WebSocket(process.env.WEBSOCKET_ENDPOINT);
    const socket = new SockJS(endponitConfig.WEBSOCKET_ENDPOINT,
      null,
      {
        transports: ['xhr-streaming'],
        headers: { 'Authorization': localStorage.getItem('Authentication') }
      });
    Global.stompClient = Stomp.over(socket);
    Global.stompClient.connect({}, (frame) => {
      // this.getAllEventsCodes()
    });
  }
}


export class UserLoginModel {
  constructor(
    public username: string,
    public password: string
  ) { }
}
