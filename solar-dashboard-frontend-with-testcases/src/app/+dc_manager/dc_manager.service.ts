import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { endponitConfig } from '../../environments/endpoints';

@Injectable()
export class dcMnagerService {
  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', localStorage.getItem('Authentication'));
  }

  setGeoMiles(loadnumber, milesValue) {
    const url = endponitConfig.LOAD_API_ENDPOINT + 'updateGeofenceMiles/' + loadnumber + '/' + milesValue
    return this.http.put(url, '', { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  setEmailNotifications(emails, postObject) {
    const url = endponitConfig.LOCATIONS_API_ENDPOINT + 'notifyEmail/' + emails + '/'
    return this.http.post(url, postObject, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getUserList() {
    const userurl = endponitConfig.USER_API_ENDPOINT + 'getAllUsers';
    return this.http.get(userurl, { headers: this.headers }).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  private handleError(error: any) {
    if (error.status == 401 ) {
      localStorage.setItem('status', '401')
      // 401 unauthorized response so log user out of client
      window.location.href = '/#/error';
      return Observable.throw(error._body);
    }
  }

}
