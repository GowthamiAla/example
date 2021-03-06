import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Location } from '@angular/common';
import { ReportService } from '../service/report.service';
import { endponitConfig } from '../../../../environments/endpoints';
/*
* This component get all added reports shown in UI and delete a particular report
*/
declare var $: any;
@Component({
  selector: 'report-list',
  templateUrl: './report.list.component.html',

})
export class ReportListComponent {
  headers: Headers;
  reportUpdateMessages: string;
  errorMessage;
  sucessMessage;
  failureMessage;
  public reportNames;
  public reportReport = true;
  serviceErrorResponse;
  serviceErrorData;

  constructor(private reportService: ReportService, private route: ActivatedRoute, private http: Http, private router: Router, private zone: NgZone) {
    this.headers = new Headers();
    this.headers.append("Authorization", localStorage.getItem('Authentication'));
    this.headers.append("Content-Type", "application/json");

    if (localStorage.getItem('report') != null) {
      this.reportNames = localStorage.getItem('report').split(",");
      this.reportNames.forEach(element => {
        if (element === 'add report' || element === 'Add Report') {
          this.reportReport = false;
        }
      });
    }


  }


  options = {
    dom: "Bfrtip",
    ajax: (data, callback, settings) => {
      this.http.get(endponitConfig.REPORT_ENDPOINT, { headers: this.headers })
        .map(this.extractData)
        .catch(error => {
          const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          if (error.status == 404) {
            error = error.json();
            // this.serviceErrorResponse = error.exception;
            // this.serviceErrorData = true;
            localStorage.setItem('status', '500');
            return Observable.throw(errMsg);
          } else {
            localStorage.setItem('status', '401')
            window.location.href = '/#/error';
            return Observable.throw(errMsg);
          }
        })
        .subscribe((data) => {
          callback({
            aaData: data,
          })
        })
    },
    columns: [
      { data: 'id', responsivePriority: 1 }, { data: 'templateName.templateName', responsivePriority: 2 }, { data: 'formatType', responsivePriority: 3 }, {
        data: null,
        orderable: false,
        className: "editcenter",
        //<a class="editor_edit"> <i class="fa fa-edit"></i></a> /
        defaultContent: '<a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
        responsivePriority: 3
      }
    ],
    rowCallback: (row: Node, data: any | Object, index: number) => {

      const self = this;

      $('td', row).unbind('click');
      $('a.editor_edit', row).bind('click', () => {
        self.editReport(data);
      });

      $('a.editor_remove', row).bind('click', () => {
        this.reportService.deleteReport(data.id).subscribe(
          data => {
            if (data.error == null) {
              if ($.fn.DataTable.isDataTable('#DataTable table')) {
                var table = $('#DataTable table').DataTable();
                let info = table.page.info();
                $('td', row).parents('tr').remove();
                table.ajax.reload();
              }
              this.sucessMessage = 'Report deleted successfully';
              setTimeout(() => { this.sucessMessage = '' }, 3000);
            } else {
              this.failureMessage = data.error.message;
              setTimeout(() => { this.failureMessage = '' }, 3000);
            }
          },
          error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
          });
      });
      return row;
    }
  };

  public goToAddReport() {
    const link = ['/admin/report/add'];
    this.router.navigate(link);

  }

  /*
 * This method navigates you to EditReport
 */
  public editReport(report: any) {
    let link = ['/admin/report/editReport', report.id];
    this.router.navigate(link);
  }

  private extractData(res) {
    let body = res.json();
    if (body) {
      return body.data
    } else {
      return {}
    }
  }

  private handleError(error: any) {
    localStorage.setItem('status', '401')
    // 401 unauthorized response so log user out of client
    window.location.href = '/#/error';
    return Observable.throw(error._body);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != undefined) {
        if (params['data'] === 'ASuccess') {
          this.reportUpdateMessages = 'Report  Created Successfully';
          setTimeout(() => { this.reportUpdateMessages = '' }, 3000);
        } else if (params['data'] === 'USuccess') {
          this.reportUpdateMessages = 'Report Updated Successfully';
          setTimeout(() => { this.reportUpdateMessages = '' }, 3000);
        }
        else if (params['data'] === 'DSuccess') {
          this.reportUpdateMessages = 'Report  Deleted Successfully';
          setTimeout(() => { this.reportUpdateMessages = '' }, 3000);
        }
      }
    })
  }

}