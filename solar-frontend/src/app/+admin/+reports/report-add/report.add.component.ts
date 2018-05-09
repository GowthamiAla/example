import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    public report = new Report(null, "", " ", this.userRole);
    public reportError;

    public reportTemplateNames: any = [];
    public reportFormats: any = [];
    public fileAppend = false;


    constructor(private reportService: ReportService, private router: Router, private location: Location) {

        this.reportFormatSelections = 'PDF';
        this.reportTemplateNamesSelections = 'USERDETAILS';

        this.reportFormats = [
            { id: 1, name: 'PDF', value: 'PDF' }
        ]
        this.reportTemplateNames = [
            { id: 1, name: 'USERDETAILS', value: 'USERDETAILS' },
            { id: 2, name: 'DOCS', value: 'DOCS' },
            { id: 3, name: 'DATA', value: 'DATA' },

        ]

    }

    public reportFormatSelections;
    public reportTemplateNamesSelections;
    /*
    * This method adds the report
    */
    ngAfterViewInit() {
        $('#reportFormats').on('change', (eventValues) => {
            this.reportFormatSelections = $(eventValues.target).val();
            if (this.reportFormatSelections === null) {
                this.reportFormatSelections = [];
            }
            console.log(this.reportFormatSelections);
        });

        $('#reportTemplateNames').on('change', (eventValues) => {
            this.reportTemplateNamesSelections = $(eventValues.target).val();
            if (this.reportTemplateNamesSelections === null) {
                this.reportTemplateNamesSelections = [];
            }
            console.log(this.reportTemplateNamesSelections);
        });
    }

    reportContentStatus: boolean = false;

    // roleData = new Array();
    public addTemplateReport(reportTemplateName, reportTemplateFormat) {
        try {
            this.reportContentStatus = false;

            this.reportService.addReport(reportTemplateName, reportTemplateFormat, this.formData).subscribe(
                data => {
                    if (data.error == null) {
                        this.fileAppend = false;
                        this.reportError = '';
                        let link = ['/admin/report/list', { data: "ASuccess" }];
                        this.router.navigate(link);
                    } else {
                        this.reportError = data.error.message
                        setTimeout(() => {
                            this.reportError = '';
                        }, 4000);
                    }

                },
                error => {
                    console.log("Error : " + error);
                    this.reportContentStatus = true;
                });

        } catch (error) {
            console.debug("report add failed", error);
            this.reportContentStatus = true;
        }

    }
    /*
      * This method takes back to previous page
      */
    public goBack() {
        let link = ['/admin/report/list'];
        this.router.navigate(link);
    }

    public formData: FormData = new FormData();
    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            // let formData: FormData = new FormData();
            this.formData.append('reportData', file);
            this.fileAppend = true;
        }
        else {
            this.fileAppend = false;
        }
    }

}
