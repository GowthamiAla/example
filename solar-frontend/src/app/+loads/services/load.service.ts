import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { ILoad } from '../models/load';


import { endponitConfig } from '../../../environments/endpoints';
/**
 * This is a service class which makes Rest service calls to PALS dash board to get loads details
 */
@Injectable()
export class LoadsService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.set('X-Auth-Token', localStorage.getItem('token'));
    }
    /**
     * This method gets all Loads data
     */
    public getAllLoads(): Observable<ILoad[]> {
        return this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT + 'getLoads', { headers: this.headers }).map((response: Response) => <any>response.json().data);
    }
    /**
     * This method gets Load data based on LoadNUmber
     */
    public getLoadDetailsByLoadNum(loadNum: string) {
        let getLoadDetailsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'updateLoad?loadNum=';
        let url = `${getLoadDetailsURL}${loadNum}`;
        return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data);
    }

    /**
     * This method gets Load data based on LoadNUmber for Load preview
     */
    public getLoadDetailsByLoadNumForLoadPreview(loadNum: string) {
        let getLoadDetailsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getLoadDetails?loadNum=';
        let url = `${getLoadDetailsURL}${loadNum}`;
        return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data);
    }

    /**
     * This method gets all Loads Numbers data for Select dropdown
     */
    public getAllLoadsDetails(loadNum: any) {
        let getLoadsListURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getloadnumbyPrefix?loadnumprefix='
        let url = `${getLoadsListURL}${loadNum}`;
        return this.http.post(url, loadNum, { headers: this.headers }).map((response: Response) => response.json());
    }
    /**
     * This method gets all Vins data for Select dropdown
     */
    public getAllVinsDetails(vinNum: any) {
        let getLoadsListURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getvinsbyPrefix?vinprefix='
        let url = `${getLoadsListURL}${vinNum}`;
        return this.http.post(url, vinNum, { headers: this.headers }).map((response: Response) => response.json());

    }
    /**
     * This method gets filter loads data
     */

    public getFilterLoadsData(loadQuery: any) {
        let getFilteredLoadsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getFilteredLoads?loadNum=';
        let url = `${getFilteredLoadsURL}${loadQuery.loadNumber}&startDate=${loadQuery.startDate}&endDate=${loadQuery.endDate}&loadStatus=${loadQuery.loadStatus}&driver=${loadQuery.empID}&vin=${loadQuery.vinNumber}&loadHighValue=${loadQuery.highValue}&loadHighPriority=${loadQuery.highPriority}`;
        return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data);
    }

    /**
    * This method adds  a new  Load details
    */
    public addLoad(load: any) {
        let loadAddURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'addLoad'
        let url = `${loadAddURL}`;
        return this.http
            .post(url, JSON.stringify(load), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(error => console.log("error occured in adding new Load details" + error));
    }
    /**
    * This method get driver mailId details based on DriverID
    */
    public getDriverMilIdDetails(driverId: any) {
        let getDriverMailId = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDriverMail?empId='
        let url = `${getDriverMailId}${driverId}`;
        return this.http.get(url, { headers: this.headers })
            .map((response: Response) => response.json().data);

    }

    /**
    * This method get dealer  details based on dealerID
    */
    public getDealerAddresses(dealerId: any) {
        let getDriverMailId = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDealerAddress?dealercd='
        let url = `${getDriverMailId}${dealerId}`;
        return this.http.get(url, { headers: this.headers })
            .map((response: Response) => response.json().data);

    }
    /**
    * This method updates  existing Load details
    */
    public updateLoad(load: ILoad) {
        let loadUpdateURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'updateLoad?loadNum='
        let url = `${loadUpdateURL}${load.loadNum}`;
        return this.http
            .put(url, JSON.stringify(load), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(error => console.log("error occured updating user details" + error));
    }
    /**
    * This method  deletes  dealer details based  on dealerCd
    */

    public deleteLoad(load: ILoad) {
        let deleteLoadsURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'deleteLoad?loadNum='
        let url = `${deleteLoadsURL}${load.loadNum}`;
        return this.http
            .delete(url, { headers: this.headers })
            .map(response => response.json())

    }

    public getDriverNameList() {
        var driverURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDriverNamesbyPrefix?DriverNamesbyPrefix';

        return this.http.get(driverURL, { headers: this.headers }).map((response: Response) => response.json().data);
    }

    public getDealerNameList() {
        var dealerURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDelerDetailsbyPrefix?dealersPrefix';

        return this.http.get(dealerURL, { headers: this.headers }).map((response: Response) => response.json().data);
    }

    private handleError(error: any) {
        console.error('An error occurred in getting loads', error);

    }

    public completeLoadCreation(load: ILoad) {
        let completeLoadCreation = endponitConfig.PALS_DRIVERS_ENDPOINT + 'completeLoadCreation/'
        let url = `${completeLoadCreation}${load.loadNum}`;
        return this.http
            .put(url, JSON.stringify(load), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(error => console.log("error complete load creation" + error));
    }

    public validateTruckNo(load: ILoad) {
        let validateTruckNumber = endponitConfig.PALS_DRIVERS_ENDPOINT + 'validateTruckNumber/'
        let url = `${validateTruckNumber}${load.loadNum}/${load.trkNum}`;
        return this.http
            .get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(error => console.log("error complete load creation" + error));
    }

}
