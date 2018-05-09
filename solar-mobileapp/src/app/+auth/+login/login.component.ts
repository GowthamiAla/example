import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';

import { endponitConfig } from '../../../environments/endpoints';
import { Global } from '../../shared/global';
declare var SockJS;
declare var Stomp;
declare let cordova: any;

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
  public otpNotification: string;
  submitted: boolean;
  loading = false;
  stompClient;
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder, ) {
    this.complexForm = fb.group({
      email: [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      password: [null, Validators.compose([Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[~!@#$%^&+=]).{6,32}$')])]
    })
    this.email = this.complexForm.controls['email'];
    this.password = this.complexForm.controls['password'];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] !== undefined) {
        if (params['data'] === 'Success') {
          this.otpNotification = 'Now you can Login with valid credentials';
        }
      }
    })

    // this.webSocketConnection();

  }

  login(event) {
    this.submitted = true;
    this.loading = true;
    this.authService.login(this.userLogin.username, this.userLogin.password).subscribe(
      data => {

        if (data.error === null) {
          localStorage.setItem('userRole', data.data.roles[0].name);
          localStorage.setItem('currentUser', data.data.email);
          localStorage.setItem('userData', data.data.id);
          console.log('Login Successs')
          // websocket connection establishment
          // this.webSocketConnection();

          // get driver ids
          this.authService.getDriverIds(data.data.id).subscribe(
            Driverdata => {
              if (Driverdata != null) {
                localStorage.setItem('driverData', Driverdata.id);
                this.loginErrorMessgae = '';
                this.loading = false;
                localStorage.setItem('status', '');
                // this.acceptNativeLocationDevice();
                this.router.navigate(['/maps']);
              } else {
                this.loginErrorMessgae = 'Please enter valid credentials';
              }
            }, error => {
              this.loading = false;
              this.loginErrorMessgae = error.message;
            })
        } else {

          this.loginErrorMessgae = data.error.message;
          localStorage.setItem('Authentication', '')
          // this.loginErrorMessgae = error.message;
          this.loginErrorMessgae = 'Please enter valid credentials';
          setTimeout(() => {
            this.loginErrorMessgae = ''
          }, 5000);
        }
        this.loading = false;

      }, error => {
        this.loginErrorMessgae = 'Please enter valid credentials';
        // this.loginErrorMessgae = error.message;
        setTimeout(() => {
          this.loginErrorMessgae = ''
        }, 5000);
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
            if (data.error === null) {
              if (data.error === null) {
              localStorage.setItem('userRole', data.data.roles[0].name);
              localStorage.setItem('currentUser', data.data.email);
              localStorage.setItem('userData', data.data.id);
              console.log('Login Successs')
              // websocket connection establishment
              // this.webSocketConnection();

              // get driver ids
              this.authService.getDriverIds(data.data.id).subscribe(
                Driverdata => {
                  if (Driverdata != null) {
                    localStorage.setItem('driverData', Driverdata.id);
                    this.loginErrorMessgae = '';
                    this.loading = false;
                    localStorage.setItem('status', '');
                    // this.acceptNativeLocationDevice();
                    this.router.navigate(['/maps']);
                  } else {
                    this.loginErrorMessgae = 'Please enter valid credentials';
                  }
                }, error => {
                  this.loading = false;
                  this.loginErrorMessgae = error.message;
                })
            } else {
              this.loading = false;
              this.loginErrorMessgae = data.error.message;
              localStorage.setItem('Authentication', '')
              // this.loginErrorMessgae = error.message;
              this.loginErrorMessgae = 'Please enter valid credentials';
              setTimeout(() => {
                this.loginErrorMessgae = ''
              }, 5000);
            }
          }
          }, error => {
            this.loading = false;
            localStorage.setItem('Authentication', '')
            // this.loginErrorMessgae = error.message;
            this.loginErrorMessgae = 'Please enter valid credentials';
            setTimeout(() => {
              this.loginErrorMessgae = ''
            }, 5000);
          })
        } else {
          this.loading = false;
          this.loginErrorMessgae = 'Please enter valid credentials';
          // localStorage.setItem('Authentication', '')
          // this.loginErrorMessgae = error.message;
          setTimeout(() => {
            this.loginErrorMessgae = ''
          }, 5000);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        console.log('Test: ' + JSON.parse(error._body).message);
        this.loginErrorMessgae = JSON.parse(error._body).message;
        this.loginErrorMessgae = 'Please enter valid credential'

      });
  }




  geoLocation() {
    console.log('Geo location function called');
    // html5 current location
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(this.getCurrentLocations.bind(this),
        this.locationError.bind(this), { enableHighAccuracy: true });
    }
  }
  getCurrentLocations = (position) => {
    // temporary us co-ordinates
    const lotLatLng = {
      lat: 39.053720,
      lng: -121.517768
    };

    // orginal to get current position
    // var lotLatLng = {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude
    // };

    console.log('get current position called');
  }
  // error call back
  locationError = () => {
    alert('Please Enable Location Services');
  }

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
