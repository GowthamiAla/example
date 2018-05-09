import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { IVendor} from '../models/vendor';

import { endponitConfig } from '../../../environments/endpoints';

/**
*This is Vendors service class which does Rest service calls for  all vendor operations
*/

@Injectable()
export class VendorService {
  private headers: Headers;
  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    //this.headers.set('X-Auth-Token', localStorage.getItem('token'));
     this.headers.append("Authorization", localStorage.getItem('Authentication'));

  }

  /**
  * This method gets all Vendors details
  */
  public getAllvendors(){
    let url = endponitConfig.VENDORS_API_ENDPOINT + 'getVendors';
    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => response.json().data).catch(this.handleError);
  }

  /**
  * This method gets vendor details based on Vendor number
  */
  public getVendorDetailsByNumber(number: string) {

    return this.getAllvendors().toPromise().then(vendors => vendors.find(vendors => vendors.vendorNbr == number)).catch(this.handleError);
  }

  /**
  * This method adds  a new  vendor details 
  */
  public addVendor(vendor: any) {
    let addvendorsURL = endponitConfig.VENDORS_API_ENDPOINT + 'addVendor';
    return this.http
      .post(addvendorsURL, vendor, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
        console.log("error occured in adding new vendor details :" + error)});
  }

  /**
  * This method update a vendor details 
  */
  public updateVendor(vendor: IVendor) {
    let updatevendorsURL = endponitConfig.VENDORS_API_ENDPOINT + 'updateVendor';
    return this.http
      .put(updatevendorsURL, JSON.stringify(vendor), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
        console.log("error occured in updating vendor details :" + error)});
  }

  /**
    * This method deletes  vendor details based on vendor number
    */

  public deleteVendor(vendor: IVendor) {
    let deletevendorsURL = endponitConfig.VENDORS_API_ENDPOINT + 'deleteVendor/'
    let url = `${deletevendorsURL}${vendor.vendorNbr}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        this.handleError;
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
