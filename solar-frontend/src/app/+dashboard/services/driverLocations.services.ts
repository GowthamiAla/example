import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { IDashboard } from '../models/dashboard';
import 'rxjs/add/operator/toPromise';


import { endponitConfig } from '../../../environments/endpoints';
/**
 * This is dealers service class which does Rest service calls for  all dealers operations
 */
//let getdetails:any;

@Injectable()
export class DashboardService {
  private headers: Headers;
  private getacceptloadurl = 'app/getAcceptedLoadDetails';
  constructor(private _http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
   // this.headers.set('X-Auth-Token', localStorage.getItem('token'));
       this.headers.set('X-Auth-Token', localStorage.getItem('token'));
  }
  public getloadsbyloadnumber(loadNum: string) {
    let getDocumentDetailsByLoadNumberURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getAcceptedLoadDetails?loadNum='
    let url = `${getDocumentDetailsByLoadNumberURL}${loadNum}`;
    return this._http
      .get(url, { headers: this.headers })
      .toPromise()
      .then((response) => response.json().data)
      .catch(error => console.log("error occured updating driver details" + error));

  }
  /**
   * This method gets all Loads Numbers data for Select dropdown
   */
  public getAcceptedloadNumbers() {

    let getLoadsListURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getAcceptedLoads'
    let url = `${getLoadsListURL}`;
    return this._http.get(url, { headers: this.headers }).map((response: Response) => response.json());

  }
}
