import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { ILoad } from '../models/load'; 
import { IDashboardAnalytics } from '../models/dashboardAnalytics';
import { IChartsData } from '../models/chartsData';


import { endponitConfig } from '../../../environments/endpoints';

@Injectable()
export class DashboardsServices {

    private headers: Headers;

    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
          this.headers.set('X-Auth-Token', localStorage.getItem('token'));
    }

    public getDriverMarkersDetails() : Observable<ILoad[]> {
        return this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT+'getDashboardDriverData', { headers: this.headers })
            .map((response: Response) => response.json().data.driverList);
    } 

    public getDashboardAnalytics() : Observable<IDashboardAnalytics> {
        return this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT+'getDashboardAnalytics', { headers: this.headers })
            .map((response: Response) => response.json().data);
    } 

    public getChartsData() : Observable<IChartsData[]> {
        return this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT+'getDashboardData', { headers: this.headers })
            .map((response: Response) => response.json().data);
    } 

}
