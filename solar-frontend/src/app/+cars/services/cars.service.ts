import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { ICar,ILoad } from '../models/car';
//import { ILoad } from '../../loads/models/load';
import { Load } from '../models/car.data';
import { IDealer } from '../../+dealers/models/dealer';

import { endponitConfig } from '../../../environments/endpoints';

/**
*This is cars service class which does Rest service calls for  all cars operations
*/

@Injectable()
export class CarService {
  private headers: Headers;
  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.set('X-Auth-Token', localStorage.getItem('token'));

  }

  /**
  * This method gets all cars details
  */
  public getAllCars(): Observable<ICar[]> {
    let url = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getVins';
    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => response.json().data);
  }

  /**
  * This method gets car details based on id
  */
  public getCarDetailsByID(id: string) {
    return this.getAllCars().toPromise().then(vins => vins.find(vins => vins.id == id));
  }
  /**
    * This method gets all loads
    */
  public getAllLoads(): Observable<ILoad[]> {
    let url = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getLoads';
    return this.http.get(url, { headers: this.headers }).map((response: Response) => <any>response.json().data);
  }
  
  public getAllPartialLoads(): Observable<ILoad[]> {
    let url = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getPartialLoads';
    return this.http.get(url, { headers: this.headers }).map((response: Response) => <any>response.json().data);
  }
  /**
 * This method gets all dealers data
 */
  public getAllDealers(): Observable<IDealer[]> {
    let url = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDealers';
    return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data);
  }
  /**
  * This method gets dealers data based on loadNum
  */
  public getDealers(loadNum: any): Observable<IDealer[]> {
    let getdealersURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getLoadDealerByLoadNum?loadNum=';
    let url = `${getdealersURL}${loadNum}`;
    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => response.json().data);

  }
  /**
  * This method gets dealers data based on dealerCd
  */
  public getDealersbyDealercd(dealerCd: any, shipId: any, affil: any): Observable<IDealer[]> {

    let getdealersURL2 = endponitConfig.PALS_DRIVERS_ENDPOINT + 'showUpdateDealer?dealerCd=';
    let url = `${getdealersURL2}${dealerCd}&affil=${affil}&shipId=${shipId}`;
    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => response.json().data);

  }
  
  /**
     * This method gets filtered cars data
     */

  public getFilterCarsData(carQuery: any) {
    let getFilteredCarsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFilteredVins?loadNum=';
    let url = `${getFilteredCarsURL}${carQuery.loadNum}&vin=${carQuery.vin}&dealer=${carQuery.dealerCd}`;
    return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data);
  }
  /**
    * This method gets dealer address.
    */
  public getDealerAddresses(dealerId: any) {
    let getdealersaddURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDealerAddress?dealercd=';
    let url = `${getdealersaddURL}${dealerId}`;
    return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data);
  }
  public validateLoadSequence(loadSeq:any,car:ICar)
  {
     let getdealersseqURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'validateDealerSeq/';
    let url = `${getdealersseqURL}${car.loadNum}/${car.dealerCd}/${loadSeq}`;
    return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json());
  }
  /**
  * This method adds  a new  car details 
  */
  public addCar(car: any) {
    let addcarsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'addVin';
    return this.http
      .post(addcarsURL, JSON.stringify(car), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.log("error occured in adding new car details :" + error));
  }

  /**
  * This method update a car details 
  */
  public updateCar(car: ICar) {
    let updatecarsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'updateVin';
    return this.http
      .put(updatecarsURL, JSON.stringify(car), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.log("error occured in updating car details :" + error));
  }

  /**
    * This method deletes  car details based on Id
    */

  public deleteCar(car: ICar) {
    let deletecarsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'deleteVin?id='
    let url = `${deletecarsURL}${car.id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => console.log("error occured in deleting car details" + error));
  }
public getValidateloadSequence(loadSeq:any,car:ICar)
  {
    let dealercd=car.dealerCd+'_'+car.shipId+'_'+car.affil;
     let getdealersseqURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'validateDealerSeq/';
    let url = `${getdealersseqURL}${car.loadNum}/${dealercd}/${loadSeq}`;
    return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json());
  }
}
