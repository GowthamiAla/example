import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { IDriver } from '../models/driver';

import { endponitConfig } from '../../../environments/endpoints';


/**
 * This is drivers service class which does Rest service calls for all drivers operations
 */

@Injectable()
export class DriverService {
  private headers: Headers;
  private diversUrl = 'app/drivers';

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', localStorage.getItem('Authentication'));
    // this.headers.set('X-Auth-Token', localStorage.getItem('token'));

  }

  /**
   * This method gets all drivers details
   */
  public getDrivers() {
    let getDriversURL = endponitConfig.DRIVER_API_ENDPOINT + 'getDrivers'
    return this.http.get(getDriversURL, { headers: this.headers })
      .map((response: Response) => response.json().data).catch(this.handleError);

  }

  /**
   * This method gets  driver details based on driver Id
   */
  public getDriverDetailsByID(id: string) {

    return this.getDrivers().toPromise().then(drivers => drivers.find(driver => driver.id == id)).catch(this.handleError);
  }

  /**
  * This method updates  existing driver details
  */
  public updateDriver(driver) {
    let driverUpdateURL = endponitConfig.DRIVER_API_ENDPOINT + 'updateDriver?id='
    let url = `${driverUpdateURL}${driver.id}`;
    return this.http
      .put(url, driver, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
        console.error('error occured updating driver details' + error)
      });
  }

  /**
  * This method adds  a new  driver details
  */
  public addDriver(driver) {
    let driverAddURL = endponitConfig.DRIVER_API_ENDPOINT + 'addDriver'
    let url = `${driverAddURL}`;

    return this.http
      .post(url, JSON.stringify(driver), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
        console.error('error occured in adding new driver details' + error)
      });
  }

  /**
     * This method gets all vendors info
     */
  public getVendorsInfo() {
    return this.http.get(endponitConfig.VENDORS_API_ENDPOINT + 'getVendors', { headers: this.headers })
      .map((response: Response) =>
        response.json().data
      ).catch(this.handleError);
  }

  /**
   * This method  deletes  driver details based on driver Id
   */

  public deletedriver(driver: IDriver) {

    let deleteDriverURL = endponitConfig.DRIVER_API_ENDPOINT + 'deleteDriver/'
    let url = `${deleteDriverURL}${driver.id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
        console.error('error occured in deleting driver details' + error)
      });

  }

  private handleError(error: any) {
    if ( error.status == 404) {
      return Observable.throw(error.json());
    } else {
      localStorage.setItem('status', '401')
      // 401 unauthorized response so log user out of client
      window.location.href = '/#/error';
      return Observable.throw(error.json());
    }
  }

}
