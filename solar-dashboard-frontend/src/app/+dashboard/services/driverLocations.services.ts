import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { IDashboard } from '../models/dashboard';
import 'rxjs/add/operator/toPromise';


import { endponitConfig } from '../../../environments/endpoints';
/**
 * This is locations service class which does Rest service calls for  all locations operations
 */
// let getdetails:any;

@Injectable()
export class DashboardDriverService {
  private headers: Headers;
  private getacceptloadurl = 'app/getAcceptedLoadDetails';
  constructor(private _http: Http, private router: Router) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', localStorage.getItem('Authentication'));
  }

  public getloadsbyloadnumber(loadNum: string) {
    const getDocumentDetailsByLoadNumberURL = endponitConfig.LOAD_API_ENDPOINT + 'getLoadAppointments/';
    const url = `${getDocumentDetailsByLoadNumberURL}${loadNum}`;
    return this._http
      .get(url, { headers: this.headers })
      .toPromise()
      .then((response) => response.json().data)
      .catch(error => {
        this.handleError(error);
        console.log('error occured updating driver details' + error)
      });

  }
  /**
   * This method gets all Loads Numbers data for Select dropdown
   */
  public getAcceptedloadNumbers() {
    const getLoadsListURL = endponitConfig.LOAD_API_ENDPOINT + 'getAcceptedLoadList'
    const url = `${getLoadsListURL}`;
    return this._http.get(url, { headers: this.headers }).map((response: Response) => response.json()).catch(this.handleError);

  }

  public getdistanceandTime(orginLat, originLng, destLat, destLng) {
    const ggetdistanceandTimeURL = endponitConfig.SOLAR_API_ENDPOINT + 'locations/distance/'
      + orginLat + '/' + originLng + '/' + destLat + '/' + destLng + '/'
    const url = `${ggetdistanceandTimeURL}`;
    return this._http.get(url, { headers: this.headers }).map((response: Response) => response.json()).catch(this.handleError);

  }

  private handleError(error: any) {
    if (error.status == 404) {
      return Observable.throw(error.json());
    } else {
      localStorage.setItem('status', '401')
      // 401 unauthorized response so log user out of client
      window.location.href = '/#/error';
      //this.router.navigate(['/error']);
      return Observable.throw(error._body);
    }
  }
}
