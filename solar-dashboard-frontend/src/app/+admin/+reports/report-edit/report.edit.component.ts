import { Component, EventEmitter, Directive, ElementRef, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ReportService } from '../service/report.service';
import { Report } from '../model/report';

declare var $: any;
/*
*  This component updates the report
*/

@Component({
  selector: 'report-edit',
  templateUrl: './report.edit.component.html',
  providers: []
})
export class ReportEditComponent implements OnInit {
  @Input() report: Report;
  public reportID: number;
  public reportError;
  public reportRolesSelections: Array<string> = [];
  reportContentStatus = false;

  public reportUserRolesOptions: any = [];

  constructor(private el: ElementRef, private reportService: ReportService, private router: Router,
    private route: ActivatedRoute, private cdr: ChangeDetectorRef) {

    this.reportUserRolesOptions = [
      { id: 1, name: 'USER', value: 'USER' },
      { id: 2, name: 'ADMIN', value: 'ADMIN' },
      { id: 3, name: 'DC', value: 'DC' },
      { id: 4, name: 'STORE MANAGERS', value: 'STORE MANAGERS' },
    ]


  }

  ngAfterViewInit() {
    $('#reportUserRoleMultiple').on('change', (eventValues) => {
      this.reportRolesSelections = $(eventValues.target).val();
      if (this.reportRolesSelections === null) {
        this.reportRolesSelections = [];
      }
    });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['reportId'] !== undefined) {
        const reportId: string = +params['reportId'] + '';
        const reportID: number = parseInt(reportId, 10);
        this.reportID = reportID;
        this.reportService.getReportebyId(reportID).then(report => {
          this.report = report.data;

          this.report.role.forEach(element => {
            $('#reportUserRoleMultiple').val(element.name).trigger('change');
          })



          // this.cdr.detectChanges();
        });
      } else {
      }
    });

  }
  onReportTypeChange(value) {
  }

  /*
  * This method updates the report
  */



  public updateReport(reportName, reportRoles) {
    const roleData = new Array();
    if (reportRoles) {
      reportRoles.forEach(element => {
        roleData.push({ 'name': element })
      });
    }
    try {
      //  this.report.name = reportName;
      const reportData = {
        'name': reportName,
        'content': '',
        'role': roleData
      }
      this.reportContentStatus = false;
      this.reportService.updateReport(reportData, this.reportID).subscribe(
        data => {
          if (data.error == null) {
            this.reportError = '';
            const link = ['/admin/report/list', { data: 'USuccess' }];
            this.router.navigate(link);
          } else {
            this.reportError = data.error.message;
            setTimeout(() => {
              this.reportError = '';
            }, 5000);
          }
        },
        error => {
        });



    } catch (error) {
    }
  }

  public goBack() {
    const link = ['/admin/report/list'];
    this.router.navigate(link);
  }


}



