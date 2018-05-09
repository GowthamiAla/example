import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { ILocation } from '../models/location';


import { endponitConfig } from '../../../environments/endpoints';

/**
 * This is dealers service class which does Rest service calls for  all dealers operations
 */
@Injectable()
export class LocationService {
  private headers: Headers;
  private locationsUrl = 'app/dealers';
  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
   // this.headers.set('X-Auth-Token', localStorage.getItem('token'));
   this.headers.append("Authorization", localStorage.getItem('Authentication'));

  }


  /**
   * This method gets all dealers data
   */
  public getAllLocations(){
    console.info("method gets all dealers data");
    let getLocationsURL =endponitConfig.LOCATIONS_API_ENDPOINT + 'getAllLocations'
    return this.http.get(getLocationsURL, { headers: this.headers }).map((response: Response) => response.json().data).catch(this.handleError);
  }

  /**
  * This method gets  dealer details based on dealerCd
  */
  public getLocationDetailsByID(locNbr: string) {
    console.info("dealer details based on dealerCd");
    return this.getAllLocations().toPromise().then(locationData => locationData.find(locationData => locationData.locNbr === locNbr)).catch(this.handleError);
  }

  /**
   * This method gets filter dealers data
   */

  public getFilterLocationsData(city: string, state: string) {
    console.info("gets filter locations data");
    let getFilteredDealersURL =endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFilteredLocations?city=';
    let url = `${getFilteredDealersURL}${city}&state=${state}`;
    return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data).catch(this.handleError);
  }



  /**
   * This method adds  a new  location details
   */
  public addLocation(location: ILocation) {
    console.info("adds  a new  location details");
    let addLocationsURL =endponitConfig.LOCATIONS_API_ENDPOINT + 'addLocation'
    let url = `${addLocationsURL}`;
    try {
      return this.http
        .post(url, JSON.stringify(location), { headers: this.headers })
        .toPromise()
        .then(response => response.json())
        .catch(error => {
          this.handleError;
          console.error("error occured in adding new location details" + error)
        });
    } catch (error) {
      console.error("error occured in adding new location details" + error);
    }

  }
  /**
  * This method updates  existing location details
  */
  public updateLocation(location: ILocation) {
    console.info("updates  existing location details");
    let locationUpdateURL =endponitConfig.LOCATIONS_API_ENDPOINT + 'updateLocation?locNbr='
    let url = `${locationUpdateURL}${location.locNbr}`;
    return this.http
      .put(url, JSON.stringify(location), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
        console.error("error occured updating location details" + error)
      });
  }

  /**
  * This method  deletes  dealer details based  on dealerCd
  */

  public deleteLocation(location: ILocation) {
    console.info("deletes  location details based  on locNbr");
    let deleteLocationsURL =endponitConfig.LOCATIONS_API_ENDPOINT + 'deleteLocation/'
    let url = `${deleteLocationsURL}${location.locNbr}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
        console.error("error occured in deleting dealer details" + error)
      });
  }
  private handleError(error: any) {
    if (error.status == 404) {
      return Observable.throw(error.json());
    } else {
      localStorage.setItem('status', '401')
      // 401 unauthorized response so log user out of client
      window.location.href = '/#/error';
      return Observable.throw(error.json());
    }
    }
}
