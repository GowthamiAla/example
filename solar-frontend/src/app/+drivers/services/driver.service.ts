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
    this.headers.set('X-Auth-Token', localStorage.getItem('token'));

  }

  /**
   * This method gets all drivers details
   */
  public getDrivers(): Observable<IDriver[]> {


    let getDriversURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDrivers'
    return this.http.get(getDriversURL, { headers: this.headers })
      .map((response: Response) => response.json().data);

  }

  /**
   * This method gets  driver details based on driver Id
   */
  public getDriverDetailsByID(employeeID: string) {

    return this.getDrivers().toPromise().then(drivers => drivers.find(driver => driver.empID == employeeID));
  }

  /**
  * This method updates  existing driver details
  */
  public updateDriver(driver: IDriver) {
    let driverUpdateURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'updateDriver?empID='
    let url = `${driverUpdateURL}${driver.empID}`;
    return this.http
      .put(url, JSON.stringify(driver), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("error occured updating driver details" + error));
  }

  /**
  * This method adds  a new  driver details
  */
  public addDriver(driver: IDriver) {

    let driverAddURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'addDriver'
    let url = `${driverAddURL}`;

    return this.http
      .post(url, JSON.stringify(driver), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("error occured in adding new driver details" + error));
  }

  /**
   * This method  deletes  driver details based on driver Id
   */

  public deletedriver(driver: IDriver) {
    let deleteDriverURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'deleteDriver?empId='
    let url = `${deleteDriverURL}${driver.empID}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("error occured in deleting driver details" + error));

  }


}
