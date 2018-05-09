import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { IFuel } from '../models/fuel';
import { endponitConfig } from '../../../environments/endpoints';


/**
 * This is users service class which does Rest service calls for  all users operations
 */
@Injectable()
export class FuelService {
  private headers: Headers;
  private fuelUrl = 'app/fuelStations';
  fuelListUrl = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFuelStations';

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.set('X-Auth-Token', 'liF3pCIgkTqUp1dci93mZia8qS4xD0MnzLhbM7fPWRA=');
  }

  /**
    * This method gets all Fuel list details
    */
  public getFuel(): Observable<IFuel[]> {
    console.info("This method gets all Fuel list details");
    return this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFuelStations', { headers: this.headers })
      .map((response: Response) => response.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }


  /**
   * This method gets  Fuel Stations details based on  Id
   */
  public getFuelDetailsByID(Id: string) {
    console.info("This method gets all Fuel  based on  Id");
    return this.getFuel().toPromise().then(fuelStations => fuelStations.find(fuel => fuel.id === Number(Id)));
  }

  /**
  * This method updates  existing Fuel details
  */
  public updateFuel(fuel: IFuel) {
    console.info("updates  existing Fuel details");
    let fuelUpdateURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'updateFuelStation'
    let url = `${fuelUpdateURL}`;
    return this.http
      .put(url, JSON.stringify(fuel), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("error occured updating user details" + error));
  }

  /**
  * This method adds  a new  fuel  details
  */
  public addFuel(fuel: IFuel) {
    console.info("method adds  a new  user details");
    let fuelUpdateURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'addFuelStation'
    let url = `${fuelUpdateURL}`;
    return this.http
      .post(url, JSON.stringify(fuel), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("method adds  a new  user details failed" + error));
  }

  /**
   * This method  deletes  fuel details on Id
   */

  public deleteFuel(fuel: IFuel) {
    console.info("deletes  fuel details on  Id");
    let fuelDealeURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'deleteFuelStation?fuelStationId='
    let url = `${fuelDealeURL}${fuel.id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("error occured in deleting user details" + error));
  }

  /**
    * This method gets all fuel list details
    */
  public getFuelAddress(address: any) {
    console.info("gets all fuel list details");
    let accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
    var apiEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=' + accessToken + '&autocomplete=true&limit=3'
    return this.http.get(apiEndpoint)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }
}
