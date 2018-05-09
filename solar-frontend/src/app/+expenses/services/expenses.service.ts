import { Injectable } from '@angular/core'; 
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { IExpenses } from '../model/expenses';
import { IDriver } from '../models/driver';
import { endponitConfig } from '../../../environments/endpoints';


/**
 * This is expenses service class which does Rest service calls for  all expenses operations
 */
@Injectable()
export class ExpensesService {
  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.set('X-Auth-Token', localStorage.getItem('token'));

  }

  /**
    * This method gets all expenses list details
    */
  public getExpenses(id) {
    console.info("gets all expenses list details");
    let expenseListUrl = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getExpensesDetailsbydriverId?driverId='
    let url = `${expenseListUrl}${id}`;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data)
      .catch(error => console.error("error occured in getting expenses details" + error));
  }


  /**
* This method gets all drivers details
*/
  public getDrivers(): Observable<IDriver[]> {
    console.info("gets all drivers details");
    try {
      let getDriversURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDrivers'
      return this.http.get(getDriversURL, { headers: this.headers })
        .map((response: Response) => response.json().data);
    } catch (error) {
      console.error("error occured in getting drivers  details" + error);
    }
  }
}
