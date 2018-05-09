
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
  public reportNames;
  public reportReport = true;

  constructor(private reportService: ReportService, private route: ActivatedRoute, private http: Http, private router: Router, private zone: NgZone) {
    this.headers = new Headers();
    this.headers.append("Authorization", "Basic " + localStorage.getItem('Authentication'));
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

      this.http.get(endponitConfig.REPORT_ENDPOINT+'userreport/', { headers: this.headers })
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe((data) => {
          callback({
            aaData: data,
          })
        })
    },
    columns: [
      { data: 'id', responsivePriority: 1 }, { data: 'templateName', responsivePriority: 2 },{ data: 'formatType', responsivePriority: 3 }, {
        data: null,
        orderable: false,
        className: "editcenter",
        defaultContent: ' <a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
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
        try {
          this.reportService.deleteReport(data.id).subscribe(
            data => {
              console.log("report delete end");
              if (data.error) {
                // this.sucessMessage = '';
                // this.errorMessage = 'report Already Assigned to Other Events'
                // setTimeout(() => {
                //   this.errorMessage = ''
                // }, 5000);
              }
              else {
                $('td', row).parents('tr').remove();
                this.errorMessage = '';
                this.sucessMessage = 'Report Deleted Successfully'
                setTimeout(() => {
                  this.sucessMessage = ''
                }, 5000);
              }

            },
            error => {
              console.log("Error")
            });

        } catch (error) {
          console.log("report delete failed", error);
        }

      });
      return row;
    }
  };



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
      if (params.data != undefined) {
        if (params.data === 'ASuccess') {
          this.reportUpdateMessages = 'Report  Created Successfully';
          setTimeout(() => { this.reportUpdateMessages = '' }, 3000);
        } else if (params.data === 'USuccess') {
          this.reportUpdateMessages = 'Report Updated Successfully';
          setTimeout(() => { this.reportUpdateMessages = '' }, 3000);
        }
        else if (params.data === 'DSuccess') {
          this.reportUpdateMessages = 'Report  Deleted Successfully';
          setTimeout(() => { this.reportUpdateMessages = '' }, 3000);
        }
      }
    })
  }

}
