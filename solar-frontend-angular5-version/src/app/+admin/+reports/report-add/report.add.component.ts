import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Report, UserRole } from '../model/report';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ReportService } from '../service/report.service';

declare var $: any;

/*
 This component adds the report
*/
@Component({
    selector: 'report-add',
    templateUrl: './report.add.component.html'
})
export class ReportAddComponent {
    public userRole: UserRole[];
    public report = new Report(null, '', ' ', this.userRole);
    public reportError;

    public reportTemplateNames: any = [];
    public reportFormats: any = [];
    public fileAppend = false;

    public reportFormatSelections;
    public reportTemplateNamesSelections;
    reportContentStatus = false;
    public formData: FormData = new FormData();


    constructor(private reportService: ReportService, private router: Router, private location: Location) {

        this.reportFormatSelections = 'PDF';
        this.reportTemplateNamesSelections = 'DeliveryReceipt';

        this.reportFormats = [
            { id: 1, name: 'PDF', value: 'PDF' }
        ]
        this.reportTemplateNames = [
            { id: 1, name: 'DeliveryReceipt', value: 'DeliveryReceipt' },
            { id: 2, name: 'BillOfLaddingReport', value: 'BillOfLaddingReport' },
            { id: 3, name: 'TripConsolidatedReport', value: 'TripConsolidatedReport' }
        ]

    }

    /*
    * This method adds the report
    */

    ngAfterViewInit() {
        $('#reportFormats').on('change', (eventValues) => {
            this.reportFormatSelections = $(eventValues.target).val();
            if (this.reportFormatSelections === null) {
                this.reportFormatSelections = [];
            }
        });

        $('#reportTemplateNames').on('change', (eventValues) => {
            this.reportTemplateNamesSelections = $(eventValues.target).val();
            if (this.reportTemplateNamesSelections === null) {
                this.reportTemplateNamesSelections = [];
            }
        });
    }

    public addReportData: any;
    public addTemplateReport(reportTemplateName, reportTemplateFormat) {
        try {
            this.reportContentStatus = false;
            this.reportService.addReport(reportTemplateName, reportTemplateFormat, this.formData).subscribe(
                data => {
                    this.addReportData = data;
                    if (data.error == null) {
                        this.fileAppend = false;
                        this.reportError = '';
                        this.router.navigate(['/admin/report/list', { data: 'ASuccess' }]);
                    } else {
                        this.reportError = data.error.message
                        setTimeout(() => {
                            this.reportError = '';
                        }, 4000);
                    }
                },
                error => {
                    this.reportContentStatus = true;
                });

        } catch (error) {
            this.reportContentStatus = true;
        }
    }
    /*
      * This method takes back to previous page
      */
    public goBack() {
        this.router.navigate(['/admin/report/list']);
    }


    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            this.formData.append('reportData', file);
            this.fileAppend = true;
        } else {
            this.fileAppend = false;
        }
    }
}