import { Component, Type, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DocumentService } from '../../services/document.service';
import { IDocument } from '../../models/document';
import { Document } from '../../models/document.data';

//import * as saveAs from 'file-saver';

import { saveAs } from 'file-saver';

import { endponitConfig } from '../../../../environments/endpoints';

import *as $ from 'jquery';

/**
 * This is the root component of documents module. It gets all documents data
 */

@Component({
    template: require('./documents.list.component.html'),
    providers: [DocumentService]
})
export class DocumentsListComponent implements OnInit {
    public filterQuery = "";
    public sortBy = "dealerName";
    public sortOrder = "asc";
    public activePageTitle: string;
    private document: IDocument = new Document("", "", "", "", "", "");
    public loadNumberList = [{ value: '', label: '' }]
    public loadNumberDetailsList = [{ id: '', shipid: '', affil: '', city: '', dealerName: '', loadNumber: '' }]
    documentListArray: Array<any> = [];
    documentDetailsListArray: Array<any> = [];
    isDocumentSubmitted: boolean;
    isLoadNumberSelected: boolean;
    complexForm: FormGroup;
    formValidate: boolean;
    private headers: Headers;

    public tripconsolidated_loading = false;
    public billoflading_loading = false;
    public documentLoadImage: number;
    //  public options: Select2Options;

    public loadnumprefix = '';
    constructor(private router: Router, private documentservice: DocumentService, fb: FormBuilder, private http: Http) {
        this.activePageTitle = 'Documents';
        this.isDocumentSubmitted = false;
        this.formValidate = false;
        this.isLoadNumberSelected = false;
        this.getAllDocuments();
        this.headers = new Headers();
         this.headers.set('X-Auth-Token', localStorage.getItem('token'));



    }
    ngOnInit() { }

    public widgetUserRolesOptions: Array<any> = [];
    private getAllDocuments(): void {
        let a = ''
        console.info("Getting  all documents  started");
        this.documentservice.getAllDocumentsDetailsSolar(a).subscribe(response => {
            this.documentListArray = response.data;
            let loadNumberList = new Array(this.documentListArray.length);
            for (let i = 0; i < this.documentListArray.length; i++) {
                loadNumberList[i] = {
                    value: this.documentListArray[i].toString(),
                    label: this.documentListArray[i].toString()
                };
            }
            // this.loadNumberList = loadNumberList.slice(0);
            this.widgetUserRolesOptions = loadNumberList.slice(0);
            this.document.loadNumber = this.widgetUserRolesOptions[0].value;
        },
            error => console.error(error),
            () => console.info('Getting  all documents complete in DocumnetListComponent'));
    }
    submitForm() {
        if (this.document.loadNumber != null && this.document.loadNumber != '') {
            this.getDocumentsDetailsforLoadnumber(this.document.loadNumber);
            // this.document.loadNumber = value;
            this.isDocumentSubmitted = true;
            this.isLoadNumberSelected = false;

        } else {
            this.isLoadNumberSelected = true;
        }
    }

    /**
         * This Method gets   loadNumber based on select drop down
         */
    public changed(e: any): void {
        this.document.loadNumber = e.value;
    }

    /**
     * This Method gets all Documents Details based on loadNumber
     */
    public getDocumentsDetailsforLoadnumber(value: any): void {
        console.info("Getting  all documents  started");
        this.documentservice.getDocumentDetailsByLoadNumber(value)
            .subscribe(response => {
                this.documentDetailsListArray = response;
                let loadNumberDetailsList = new Array(this.documentDetailsListArray.length);
                for (let i = 0; i < this.documentDetailsListArray.length; i++) {
                    loadNumberDetailsList[i] = {
                        id: this.documentDetailsListArray[i].id,
                        shipid: this.documentDetailsListArray[i].shipid,
                        affil: this.documentDetailsListArray[i].affil,
                        city: this.documentDetailsListArray[i].city,
                        dealerName: this.documentDetailsListArray[i].dealerName,
                        loadNumber: value
                    };
                }
                this.loadNumberDetailsList = loadNumberDetailsList.slice(0);

            },
            error => console.error(error),
            () => console.info('Getting  all documents complete in DocumnetListComponent'));
    }


    public widgetRolesSelections;
    ngAfterViewInit() {
        $('#document_load_list').on('change', (eventValues) => {
            this.widgetRolesSelections = $(eventValues.target).val();
            if (this.widgetRolesSelections === null) {
                this.widgetRolesSelections = [];
            }
            console.log(this.widgetRolesSelections);
            this.document.loadNumber = this.widgetRolesSelections;
        });
    }

    /**
     * This Method is used for generating delivery Receipt Document.
     */
    deliveryReceiptDocument(value) {
        var documentURL = endponitConfig.PALS_DRIVERS_ENDPOINT + "deliveryReceiptDocument?load=";
        let url = `${documentURL}${value.loadNumber}&dealer=${value.id}_${value.affil}_${value.shipid}`;
        this.documentLoadImage = value.id;
        try {
            this.http.get(url, { responseType: ResponseContentType.Blob, headers: this.headers })
                .map((res: Response) => res.blob())
                .subscribe(
                data => {
                    this.documentLoadImage = 0;
                    console.log(data);
                    var blob = new Blob([data], { type: 'application/pdf' });
                    console.log(blob);
                    var filename = 'deliveryReceiptDocument' + value.id + '.pdf';
                     saveAs(blob, filename);
                });
        }
        catch (error) {
            console.error("error occured in getting delivery Receipt Document " + error)
        }



    }
    /**
     * This Method is used for generating trip consolidated Document.
     */
    tripconsolidated(value) {
        var documentURL = endponitConfig.PALS_DRIVERS_ENDPOINT + "tripConsolidatedDocument?load=";
        let url = `${documentURL}${value}`;

        this.tripconsolidated_loading = true;
        try {
            this.http.get(url, { responseType: ResponseContentType.Blob, headers: this.headers })
                .map((res: Response) => res.blob())
                .subscribe(
                data => {
                    this.tripconsolidated_loading = false;
                    console.log(data);
                    var blob = new Blob([data], { type: 'application/pdf' });
                    console.log(blob);
                    var filename = 'tripConsolidatedDocument' + value + '.pdf';
                    saveAs(blob, filename);

                });
        }
        catch (error) {
            console.error("error occured in getting trip consolidated Document " + error)
        }

    }
    /**
     * This Method is used for generating billoflading Document.
     */
    billoflading(value) {
        var documentURL = endponitConfig.PALS_DRIVERS_ENDPOINT + "billOfLadingDocument?load=";
        let url = `${documentURL}${value}`;
        this.billoflading_loading = true;
        try {
            this.http.get(url, { responseType: ResponseContentType.Blob, headers: this.headers })
                .map((res: Response) => res.blob())
                .subscribe(
                data => {
                    this.billoflading_loading = false;
                    var blob = new Blob([data], { type: 'application/pdf' });
                    var filename = 'BillOfLadingDocument_' + value + '.pdf';
                   saveAs(blob, filename);
                });
        }
        catch (error) {
            console.error("error occured in getting billoflading Document " + error)
        }
    }

}
