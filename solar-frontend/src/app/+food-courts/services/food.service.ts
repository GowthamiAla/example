import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { IFood } from '../models/food';
import { endponitConfig } from '../../../environments/endpoints';


/**
 * This is users service class which does Rest service calls for  all users operations
 */
@Injectable()
export class FoodService {
  private headers: Headers;
  private foodUrl = 'app/food-courts';
  foodListUrl = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFoodCourts';
  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.set('X-Auth-Token', 'ZI2R5Wh+deX//3KRfr53jVV7vsbPf0dslTUsjSbQQlI=');
  }

  /**
    * This method gets all Food list details
    */
  public getFood(): Observable<IFood[]> {
    return this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFoodCourts', { headers: this.headers })
      .map((response: Response) => response.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }


  /**
    * This method gets all Food list details
    */
  public getFoodAddress(address: any) {
    let accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
    var apiEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=' + accessToken + '&autocomplete=true&limit=3'
    return this.http.get(apiEndpoint)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }

  /**
   * This method gets  user details based on user Id
   */
  public getFoodDetailsByID(Id: string) {
    return this.getFood().toPromise().then(foodcourts => foodcourts.find(food => food.id === Number(Id)));
  }

  /**
  * This method updates  existing user details
  */
  public updateFood(food: IFood) {
    let foodUpdateURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'updateFoodCourt'
    let url = `${foodUpdateURL}`;
    try {
      return this.http
        .put(url, JSON.stringify(food), { headers: this.headers })
        .toPromise()
        .then(response => response.json())
        .catch(error => console.error("error occured updating user details" + error));
    } catch (error) {
      console.error("error occured updating user details" + error)
    }
  }

  /**
  * This method adds  a new  user details
  */
  public addFood(food: IFood) {
    let foodUpdateURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'addFoodCourt'
    let url = `${foodUpdateURL}`;
    try {
      return this.http
        .post(url, JSON.stringify(food), { headers: this.headers })
        .toPromise()
        .then(response => response.json())
        .catch(error => console.log("error occured in adding new user details" + error));
    } catch (error) {
      console.error("error occured in adding new user details" + error);
    }
  }

  /**
   * This method adds deletes  user details on user Id
   */
  public deleteFood(food: IFood) {

    console.log(" deletes  food details on food Id");
    let foodDealeURL = endponitConfig.PALS_DRIVERS_ENDPOINT+ 'deleteFoodCourt?foodCourtId='
    let url = `${foodDealeURL}${food.id}`;
    try {
      return this.http
        .delete(url, { headers: this.headers })
        .toPromise()
        .then(response => response.json())
        .catch(error => console.log("error occured in deleting user details" + error));
    } catch (error) {
      console.log("error occured in deleting user details" + error);
    }
  }
}
