import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';


import { endponitConfig } from '../../environments/endpoints';





@Injectable()
export class AuthService {
    isLoggedIn = false;
    // store the URL so we can redirect after logging in
    redirectUrl: string;
    public headers: Headers;
    public loggersheaders: Headers;
    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');

        this.loggersheaders = new Headers();
        this.loggersheaders.append('Authorization', localStorage.getItem('Authentication'));
        this.loggersheaders.append('Content-Type', 'application/json');
    }
    /** User Authentication */
    login(username: string, password: string) {
        this.headers = new Headers();
        localStorage.setItem('Authentication', '')
        localStorage.setItem('Authentication', btoa(username + ':' + password))
        this.headers.append('Authorization',  localStorage.getItem('Authentication'));
        return this.http.get(endponitConfig.USER_API_ENDPOINT + 'getUserByEmail/' + username, { headers: this.headers })
            .map(response => {
                return response.json();

            });
    }


    /** User Authentication */
    userAuthentication(username: string, password: string) {
        localStorage.setItem('Authentication', '');
        const headers1 = new Headers();
        headers1.append('Content-Type', 'application/x-www-form-urlencoded');
        const body = 'username=' + username + '&password=' + password;
        return this.http.post('login', body, { headers: headers1 }).map(response => {
            localStorage.setItem('Authentication', response.headers.get('Authorization'));
            return response;
        });
    }

    getUserDetailsByEmail(email: string) {
        const headers1 = new Headers();
        headers1.append('Authorization', localStorage.getItem('Authentication'));
        return this.http.get(endponitConfig.USER_API_ENDPOINT + 'getUserByEmail/' + email, { headers: headers1 }).map(response => {
            return response.json();
        });
    }
    logout(): void {
        localStorage.setItem('currentUser', '')
        localStorage.setItem('Authentication', '')
        localStorage.setItem('userData', '')
        localStorage.setItem('userRole', '')

        this.isLoggedIn = false;
    }


    solarHealthItems() {
        return this.http.get(endponitConfig.SOLAR_ACTUTATOR_ENDPOINT + 'health', { headers: this.loggersheaders })
            .map(res => { return res.json() }).catch(this.handleError);
    }

    calendarHealthItems() {
        return this.http.get(endponitConfig.CALENDAR_ACTUTATOR_ENDPOINT + 'health', { headers: this.loggersheaders })
            .map(res => { return res.json() })
    }

    loggerItems() {
        return this.http.get(endponitConfig.SOLAR_ACTUTATOR_ENDPOINT + 'loggers', { headers: this.loggersheaders })
            .map(res => { return res.json() }).catch(this.handleError);
    }

    updateLoggerEffectiveLevell(loggerLevels) {
        const data = { 'configuredLevel': loggerLevels.effectiveLevel }
        return this.http.post(endponitConfig.SOLAR_ACTUTATOR_ENDPOINT + 'loggers/' +
            loggerLevels.loggerName, data, { headers: this.loggersheaders }).map((response: Response) => { }).catch(this.handleError);
    }

    userRegister(userData) {
        const headers = new Headers();
        //  this.headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
        headers.append('Content-Type', 'application/json');
        return this.http.post(endponitConfig.USER_API_ENDPOINT + 'registerUser', JSON.stringify(userData), { headers: headers })
            .map(res => { return res.json() })
    }


    userOTP(otp, userpassword) {
        let userId = localStorage.getItem('userData')
        if (!userId) {
            userId = ' ';
        }
        return this.http.post(endponitConfig.USER_API_ENDPOINT + 'setPassword/' + userId + '/' + otp + '/' + userpassword
            , '', { headers: this.headers })
            .map(res => { return res.json() })
    }

    userForgotPassword(email, phone) {
        return this.http.post(endponitConfig.USER_API_ENDPOINT + 'forgotPassword/' + email + '/' + phone, '', { headers: this.headers })
            .map(res => { return res.json() })
    }
    private handleError(error: any) {
        if (error.status === 401) {
            localStorage.setItem('status', '401')
            // 401 unauthorized response so log user out of client
            window.location.href = '/#/error';
            return Observable.throw(error._body);
        }
    }
}

