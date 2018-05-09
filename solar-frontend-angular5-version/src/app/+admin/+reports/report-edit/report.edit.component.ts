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
    //  @Input() report: Report;
    public report: any;
    public reportID: number;
    public reportError;
    public reportRolesSelections: Array<string> = [];
    reportContentStatus = false;

    public reportUserRolesOptions: any = [];
    public reportFormats: any = [];

    constructor(private el: ElementRef, private reportService: ReportService, private router: Router,
        private route: ActivatedRoute, private cdr: ChangeDetectorRef) {

        this.reportUserRolesOptions = [
            { id: 1, name: 'USER', value: 'USER' },
            { id: 2, name: 'ADMIN', value: 'ADMIN' },
            { id: 3, name: 'DC', value: 'DC' },
            { id: 4, name: 'STORE MANAGERS', value: 'STORE MANAGERS' },
        ]
        this.reportFormats = [
            { id: 1, name: 'PDF', value: 'PDF' }
        ]

    }

    ngAfterViewInit() {
        $('#reportFormats').on('change', (eventValues) => {
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
                this.reportService.getReportByID(reportID).then(report => {
                    this.report = report;
                    $('#reportFormats').val(this.reportFormats[0].name).trigger('change');//fixed the type as PDF
                });
            }
        });
    }


    /*
    * This method updates the report
    */

    public updateReport(reportName, reportRoles) {
        try {
            const reportData = {
                'templateName': reportName,
                'formatType': 'PDF'
            }
            this.reportContentStatus = false;
            this.reportService.updateReport(reportData).subscribe(
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
