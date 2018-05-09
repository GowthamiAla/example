import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { endponitConfig } from '../../../../environments/endpoints';
import { Template } from '../model/template';
/*
  This is service class which get/adds/update/delete Templates
*/
@Injectable()
export class TemplateService {
  private headers: Headers;

  constructor(private http: Http) {

  }

  /*
    This method get Template based on ID
  */
  public getTemplatebyId(templateId: number) {
    let header = new Headers();
    header.append('Authorization', localStorage.getItem('Authentication'));
    header.append('Content-Type', 'application/json');
    return this.http.get(endponitConfig.TEMPLATES_API_ENDPOINT + templateId, { headers: header })
      .map(res => { return res.json() }).toPromise().catch(this.handleError);
  }

  /*
   * This method  adds Template
  */
  public addTemplate(template: Template) {
    let header = new Headers();
    header.append('Authorization', localStorage.getItem('Authentication'));
    header.append('Content-Type', 'application/json');
    return this.http.post(endponitConfig.TEMPLATES_API_ENDPOINT, JSON.stringify(template), { headers: header })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  /*
    This method delete Template
  */
  public deleteTemplate(templateId: number) {
    let header = new Headers();
    header.append('Authorization', localStorage.getItem('Authentication'));
    header.append('Content-Type', 'application/json');
    return this.http.delete(endponitConfig.TEMPLATES_API_ENDPOINT + templateId, { headers: header })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  /*
    This method update Template
  */
  public updateTemplate(templateDetails: Template, templateId: number) {
    let header = new Headers();
    header.append('Authorization', localStorage.getItem('Authentication'));
    header.append('Content-Type', 'application/json');
    return this.http.put(endponitConfig.TEMPLATES_API_ENDPOINT + templateId, JSON.stringify(templateDetails), { headers: header })
      .map(res => { return res.json() }).catch(this.handleError);
  }

  private handleError(error: any) {
    if (error.status == 400) {
      return Observable.throw(error.josn());
    } else {
      localStorage.setItem('status', '401')
      window.location.href = '/#/error';
      return Observable.throw(error._body);
    }
  }
}
