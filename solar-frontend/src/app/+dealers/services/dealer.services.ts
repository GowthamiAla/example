import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { IDealer } from '../models/dealer';


import { endponitConfig } from '../../../environments/endpoints';

/**
 * This is dealers service class which does Rest service calls for  all dealers operations
 */
@Injectable()
export class DealerService {
  private headers: Headers;
  private dealersUrl = 'app/dealers';
  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.set('X-Auth-Token', localStorage.getItem('token'));

  }


  /**
   * This method gets all dealers data
   */
  public getAllDealers(): Observable<IDealer[]> {
    console.info("method gets all dealers data");
    let getDealersURL =endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDealers'
    return this.http.get(getDealersURL, { headers: this.headers }).map((response: Response) => response.json().data);
  }

  /**
  * This method gets  dealer details based on dealerCd
  */
  public getDealerDetailsByID(dealerCd: string) {
    console.info("dealer details based on dealerCd");
    return this.getAllDealers().toPromise().then(dealerData => dealerData.find(dealerData => dealerData.dealerCd === dealerCd));
  }

  /**
   * This method gets filter dealers data
   */

  public getFilterDealersData(city: string, state: string) {
    console.info("gets filter dealers data");
    let getFilteredDealersURL =endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFilteredDealers?city=';
    let url = `${getFilteredDealersURL}${city}&state=${state}`;
    return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data);
  }



  /**
   * This method adds  a new  dealer details
   */
  public addDealer(dealer: IDealer) {
    console.info("adds  a new  dealer details");
    let addDealerURL =endponitConfig.PALS_DRIVERS_ENDPOINT + 'addDealer'
    let url = `${addDealerURL}`;
    try {
      return this.http
        .post(url, JSON.stringify(dealer), { headers: this.headers })
        .toPromise()
        .then(response => response.json())
        .catch(error => console.error("error occured in adding new dealer details" + error));
    } catch (error) {
      console.error("error occured in adding new dealer details" + error);
    }

  }
  /**
  * This method updates  existing dealer details
  */
  public updateDealer(dealer: IDealer) {
    console.info("updates  existing dealer details");
    let userUpdateURL =endponitConfig.PALS_DRIVERS_ENDPOINT + 'updateDealer?dealerCd='
    let url = `${userUpdateURL}${dealer.dealerCd}`;
    return this.http
      .put(url, JSON.stringify(dealer), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("error occured updating dealer details" + error));
  }

  /**
  * This method  deletes  dealer details based  on dealerCd
  */

  public deleteDealer(dealer: IDealer) {
    console.info("deletes  dealer details based  on dealerCd");
    let deleteDealersURL =endponitConfig.PALS_DRIVERS_ENDPOINT + 'deleteDealer?dealerCd='
    let url = `${deleteDealersURL}${dealer.dealerCd}&affil=${dealer.affil}&shipId=${dealer.shipId}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.error("error occured in deleting dealer details" + error));
  }
}
