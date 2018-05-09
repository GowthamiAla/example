import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

import { JsonApiService } from '../../core/api/json-api.service';
import { AuthService } from '../../+auth/auth.service';
import * as _ from 'lodash';
declare var $: any;

import { endponitConfig } from '../../../environments/endpoints';

import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
@FadeInTop()
@Component({
  selector: 'datatables-admin',
  templateUrl: './datatables-rest-demo.component.html',
  styles: []
})
export class DatatablesRestDemoComponent implements OnInit {

  private headers: Headers;
  public loggerLevels: any;
  public loggers: any[];
  message: any;
  public options;

  loggerMessage = new LoggerMessage('', '', '');


  someClickHandler(info: any): void {
    this.message = info.loggerName + ' - ' + info.loggerValue.configuredLevel + ' - ' + info.loggerValue.effectiveLevel;
    this.loggerMessage.loggerName = info.loggerName;
    this.loggerMessage.configuredLevel = info.loggerValue.configuredLevel;
    this.loggerMessage.effectiveLevel = info.loggerValue.effectiveLevel;

  }
  constructor(private http: Http, private jsonApiService: JsonApiService, private authService: AuthService, private router: Router) {

    this.headers = new Headers();
    this.headers.append('Authorization', localStorage.getItem('Authentication'));

    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  ngOnInit() {
    this.authService.loggerItems().subscribe(
      (state: any) => {
        this.loggerLevels = state.levels;
        // this.loggers = _.map(state.loggers, (value, prop) => {
        //   return { loggerName: prop, loggerValue: value };
        // });
     
      },
      error => {
        // this.loginErrorMessgae = 'Please Enter Valid Login Credentials.';
        //  this.loading = false;
      });

    this.DataTablesInit();
  }

  public DataTablesInit() {
    this.options = {
      dom: 'Bfrtip',
      ajax: (data, callback, settings) => {
        this.http.get(endponitConfig.SOLAR_ACTUTATOR_ENDPOINT + 'loggers', { headers: this.headers })
          .map(this.extractData)
          .catch(error => {
            // In a real world app, we might use a remote logging infrastructure
            // We'd also dig deeper into the error to get a better message
            const errMsg = (error.message) ? error.message :
              error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.error(errMsg); // log to console instead

            // this.navigateToLogin( this.errorMessage)

            localStorage.setItem('status', '401')
            // 401 unauthorized response so log user out of client
            window.location.href = '/#/error';
            return Observable.throw(errMsg);
          })
          .subscribe((jsonData) => {
            callback({
              aaData: jsonData,
            })

          })
      },
      columns: [
        { data: 'loggerName' }, { data: 'loggerValue.configuredLevel' }, { data: 'loggerValue.effectiveLevel' }
      ],

      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.someClickHandler(data);
        });
        return row;
      }
    };
  }
  updateLoggerEffectiveLevell(loggerLevels: any) {
    this.authService.updateLoggerEffectiveLevell(loggerLevels).subscribe(
      data => {
    
      },
      error => {
     
      });
  }

  private extractData(res) {
    this.loggers = _.map(JSON.parse(res._body).loggers, (value, prop) => {
      return { loggerName: prop, loggerValue: value };
    });
    return this.loggers;
  }


  private handleError(error: any) {
    let classInstance = this;

    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    classInstance = error.status
    // this.navigateToLogin( this.errorMessage)
   // if (error.status = 401) {
      classInstance.router.navigate(['/login']);
   // }
    return Observable.throw(errMsg);
  }


}

export class LoggerMessage {
  constructor(
    public loggerName: string,
    public configuredLevel: string,
    public effectiveLevel: string
  ) { }
}
