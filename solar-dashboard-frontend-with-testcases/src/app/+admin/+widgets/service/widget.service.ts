import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http'; import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { endponitConfig } from '../../../../environments/endpoints';
import { Widget } from '../model/widget';
/*
  This is service class which get/adds/update/delete Templates
*/
@Injectable()
export class WidgetService {
  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Authorization', localStorage.getItem('Authentication'));
    this.headers.append('Content-Type', 'application/json');
  }


  /*
     This method get widget based on ID
   */
  public getAllRoles() {
    return this.http.get(endponitConfig.USER_API_ENDPOINT + 'getAllRoles', { headers: this.headers })
      .map(res => { return res.json() }).catch(this.handleError);;
  }

  /*
    This method get widget based on ID
  */
  public getWidgetebyId(widgetId: number) {
    return this.http.get(endponitConfig.WIDGET_ENDPOINT + widgetId, { headers: this.headers })
      .map(res => { return res.json() }).toPromise().catch(this.handleError);
  }

  /*
   * This method  adds widget
  */
  public addWidget(widget: any) {
    return this.http.post(endponitConfig.WIDGET_ENDPOINT, JSON.stringify(widget), { headers: this.headers })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  /*
    This method delete widget
  */
  public deleteWidget(widgetId: number) {
    return this.http.delete(endponitConfig.WIDGET_ENDPOINT + widgetId, { headers: this.headers })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  /*
    This method update widget
  */
  public updateWidget(widgetDetails: any, widgetId: number) {
    return this.http.put(endponitConfig.WIDGET_ENDPOINT + widgetId, JSON.stringify(widgetDetails), { headers: this.headers })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  private handleError(error: any) {
    localStorage.setItem('status', '401')
    window.location.href = '/#/error';
    return Observable.throw(error._body);
  }
}
