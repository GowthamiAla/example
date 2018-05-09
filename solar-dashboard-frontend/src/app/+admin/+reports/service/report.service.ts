import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from "@angular/http"; import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { endponitConfig } from '../../../../environments/endpoints';
import { Report } from '../model/report';
/*
  This is service class which get/adds/update/delete Templates
*/
@Injectable()
export class ReportService {
  private headers: Headers;
  private reportsHeaders: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append("Authorization", localStorage.getItem('Authentication'));
    this.headers.append("Content-Type", "application/json");


    this.reportsHeaders = new Headers();
    this.reportsHeaders.append("Authorization",localStorage.getItem('Authentication'));
    // this.reportsHeaders.append("Content-Type", "application/json");
  //  this.reportsHeaders.append('Content-Type', 'multipart/form-data');
   // this.reportsHeaders.append('Accept', 'application/json');
  }

  /*
    This method get Report based on ID
  */
  public getReportebyId(reportId: number) {
    return this.http.get(endponitConfig.REPORT_ENDPOINT + reportId, { headers: this.headers })
      .map(res => { return res.json() }).toPromise().catch(this.handleError);;
  }

  /*
   * This method  adds report
  */
  public addReport(reportTemplateName, reportTemplateFormat, report: any) {
    return this.http.post(endponitConfig.REPORT_ENDPOINT + '/' + reportTemplateName + '/' + reportTemplateFormat, report, { headers: this.reportsHeaders })
      .map(res => { return res.json() }).catch(this.handleError);
  }



  /*
    This method delete report
  */
  public deleteReport(reportId: number) {
    return this.http.delete(endponitConfig.REPORT_ENDPOINT + '/'+ reportId, { headers: this.headers })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  /*
    This method update report
  */
  public updateReport(reportDetails: any, reportId: number) {
    return this.http.put(endponitConfig.REPORT_ENDPOINT + reportId, JSON.stringify(reportDetails), { headers: this.headers })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  private handleError(error: any) {
    localStorage.setItem('status', '401')
    window.location.href = '/#/error';
    return Observable.throw(error._body);
  }
}
