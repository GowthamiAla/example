import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { ILoad } from '../models/load';
import { IDashboardAnalytics } from '../models/dashboardAnalytics';
import { IChartsData } from '../models/chartsData';


import { endponitConfig } from '../../../environments/endpoints';

@Injectable()
export class DashboardsServices {

    private headers: Headers;

    constructor(private http: Http, private router: Router) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', localStorage.getItem('Authentication'));
    }

    public getAnalyticsData(): Observable<any[]> {
        const url = endponitConfig.ANALYTICS_API_ENDPOINT + 'getAnalyticsData';
        return this.http.get(url, { headers: this.headers }).map((response: Response) => <any>response.json().data).catch(this.handleError);
    }

    public getAllAppointments(startDate: string, endDate: string): Observable<any[]> {
        const url = endponitConfig.ANALYTICS_API_ENDPOINT + 'getAnalyticsData/' + startDate + '/' + endDate;
        return this.http.get(url, { headers: this.headers }).map((response: Response) => <any>response.json().data).catch(this.handleError);
    }



    public generateReportsData(analyticsName, dateRange): Observable<any[]> {

        const reportsHeaders: any = new Headers();
        reportsHeaders.append('Authorization', localStorage.getItem('Authentication'));

        const url = endponitConfig.SOLAR_API_ENDPOINT + 'reports/' + analyticsName;
        return this.http.post(url, dateRange, {
            method: RequestMethod.Post,
            responseType: ResponseContentType.Blob, headers: reportsHeaders
        }).map((response: Response) => <any>response.blob());
    }

    public getLoadAppointmentById(loadNum: string) {
        const getLoadDetailsURL = endponitConfig.LOAD_API_ENDPOINT + 'getLoadAppointments/';
        const url = `${getLoadDetailsURL}${loadNum}`;
        return this.http.get(url, { headers: this.headers }).map((response: Response) => response.json().data).catch(this.handleError);
    }

    public updateHighvalues(loadAppointment, loadHigh, loadPriority): Observable<any> {
        const getdealersURL = endponitConfig.LOAD_API_ENDPOINT + 'updateHighValue/';

        const url = `${getdealersURL}${loadAppointment}/${loadHigh}/${loadPriority}`;
        return this.http.get(url, { headers: this.headers }).map((response: Response) => <any>response).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        if (error.status == 404) {
            console.log('error 404')
            return Observable.throw(error.json());
        } else {
            localStorage.setItem('status', '401')
            // 401 unauthorized response so log user out of client
            window.location.href = '/#/error';
            //this.router.navigate(['/error']);
            return Observable.throw(error._body);
        }
    }
}
