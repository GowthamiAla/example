import { Component, Type, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ILoad } from '../../models/load';
import { Load } from '../../models/load.data';
import { LoadsService } from '../../services/load.service';

import * as moment from 'moment';
// import { Select2OptionData } from 'ng2-select2';

declare var $;

/**
 * This component adds new Load
 */
@Component({
    templateUrl: './load.add.component.html',
    providers: [LoadsService]
})

export class LoadAddComponent implements OnInit {

    public loadAddSuccess;
    public loadAddFailure;

    public driverNameListData;
    public dealerNameListData;

    public locationList;
    public truckList;
    public vendorsList;
    public appointmentTypesList;
    public geomiles;

    @Output() close = new EventEmitter();
    public activePageTitle: string;
    public loadAddResponse: String;
    public error: String;
    navigated = true; // true if navigated here
    public load: any = {};
    public driversList;

    complexForm: FormGroup;
    formValidate: boolean;

    loadNum: AbstractControl;
    driverId: AbstractControl;
    originNum: AbstractControl;
    destinNum: AbstractControl;
    truckNum: AbstractControl;
    vendorNum: AbstractControl;
    appointmentye: AbstractControl;
    cartons: AbstractControl;
    geomile: AbstractControl;
    public serviceErrorResponse;
    public serviceErrorData;
    
    constructor(private router: Router, private loadService: LoadsService, fb: FormBuilder) {
        this.load.driverId = '';
        this.load.originNum = '';
        this.load.destinNum = '';
        this.load.vendorNum = '';
        this.load.appointmentye = '';

        this.load.highValueLoad = 0;
        this.load.highPriorityLoad = 0;
        this.formValidate = false;
        this.complexForm = fb.group({
            'loadNum': [null, Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]+')])],
            'driverId': [null, Validators.required],
            'originNum': [null, Validators.required],
            'destinNum': [null, Validators.required],
            'vendorNum': [null, Validators.required],
            // 'truckNum': [null, Validators.compose([Validators.required, Validators.pattern('[a-z A-Z 0-9]+')])],
            'appointmentye': [null, Validators.required],
            'cartons': [null, Validators.compose([ Validators.pattern('^(15[0]|1[0-4][0-9]|[0-9][0-9]|[1-9])$')])],
            'geomile': [null, Validators.compose([Validators.required, Validators.pattern('^(15[0]|1[0-4][0-9]|[0-9][0-9]|[5-9])$')])]
        })
        this.loadNum = this.complexForm.controls['loadNum'];
        this.driverId = this.complexForm.controls['driverId'];
        this.originNum = this.complexForm.controls['originNum'];
        this.destinNum = this.complexForm.controls['destinNum'];
        // this.truckNum = this.complexForm.controls['truckNum'];
        this.vendorNum = this.complexForm.controls['vendorNum'];
        this.appointmentye = this.complexForm.controls['appointmentye'];
        this.cartons = this.complexForm.controls['cartons'];
        this.geomile = this.complexForm.controls['geomile'];
    }


    ngOnInit() {
        // alert(localStorage.getItem('userData'))
        this.getAlllocations();
        this.getVendors();
        this.getAppointments();
        // this.driverNameDetails();
        this.dealerNameDetails();
        // $.ajaxSetup({ headers: { "X-Auth-Token": localStorage.getItem('token') } })
    }

    /**
     * Get All locations
     */
    getAlllocations() {
        this.loadService.getAlllocationsInfo().subscribe(response => {
            this.locationList = response
        }, error =>
                console.log(error)
        )
    }

   

    /**
    * Vendors List
    */
    getVendors() {
        this.loadService.getVendorsInfo().subscribe(response => {
            this.vendorsList = response;
        }, error =>
                console.log(error)
        )
    }
    /**
    * Drivers List Based on Vendors
    */
    getDriversByVendorNum(vendorNbr) {
        this.load.driverId = '';
        this.loadService.getDriverNameListBasedOnVendors(vendorNbr).subscribe(response => {
            this.driverNameListData = response.data;
        }, error =>
                console.log(error)
        )
    }

    /**
    * AppointmentTypes
    */
    getAppointments() {
        this.loadService.getAppointmentTypesInfo().subscribe(response => {
            this.appointmentTypesList = response;
        }, error =>
                console.log(error)
        )
    }

    /**
     * Drivers List
     */
    // driverNameDetails() {
    //     this.loadService.getDriverNameList().subscribe(response => {
    //         let driverNameDetailsList = new Array(response.length);
    //         for (let i = 0; i < response.length; i++) {
    //             driverNameDetailsList[i] = {
    //                 //id: response[i].id,
    //                 id: response[i].id,
    //                 firstName: response[i].firstName
    //             };
    //         }
    //         this.driverNameListData = driverNameDetailsList.slice(0);
    //     }, error => console.error(error),
    //         () => console.info('Getting  driverMailId complete in LoadAddComponent'));
    // }

    /**
     * dealerNameDetails is used as vendorsDetailsList
     */
    public dealerNameDetails() {
        this.loadService.getDriverNameList().subscribe(response => {
            const dealerNameDetailsList = new Array(response.length);
            for (let i = 0; i < response.length; i++) {
                dealerNameDetailsList[i] = {
                    id: response[i].vendorNbr,
                    text: response[i].vendorName
                };
            }
            this.dealerNameListData = dealerNameDetailsList.slice(0);
        }, error => console.error(error),
        );
    }

    /**
    * This method sets submitted property to true to hide form in view .
    */

    submitForm(value: any) {

        if (this.complexForm.valid && value.loadNum != '' && value.driverId != '' && value.originNum != ''
            && value.destinNum != '' && value.appointmentye != '' && value.vendorNum != '' && this.geomiles != '' && this.complexForm.valid) {
            if (value.originNum != value.destinNum) {
                const today_Date = new Date();
                const userID = localStorage.getItem('userData');
                const addLoadObject: any = {
                    'apptNbr': value.loadNum,
                    'originLocNbr': {
                        'locNbr': value.originNum
                    },
                    'destLocNbr': {
                        'locNbr': value.destinNum
                    },
                    'createdTS': moment(today_Date).format(),
                    'createdUser': {
                        'id': userID
                    },
                    'lastUpdatedTS': moment(today_Date).format(),
                    'lastUpdatedUser': {
                        'id': userID
                    },
                    'scheduledArrivalDate': null,
                    'actualArrivalDate': null,
                    'startDate': null,
                    'endDate': null,
                    'cartons': value.cartons,
                    'driver': {
                        'id': value.driverId
                    },
                    'vndNbr':
                        {
                            'vendorNbr': value.vendorNum

                        },
                    'apptTypNbr': {
                        'id': value.appointmentye
                    },
                    'apptStatNbr': {
                        'id': 1
                    },
                    'geomiles': this.geomiles,
                    'highValueLoad': this.load.highValueLoad,
                    'highPriorityLoad': this.load.highPriorityLoad

                }
                this.loadService.addLoad(addLoadObject).then(response => {
                    if (response.data != null) {
                        this.loadAddSuccess = 'Load created sucessfully'
                        const that = this;
                        setTimeout(() => {
                            this.loadAddSuccess = ''
                            this.router.navigate(['/loads']);
                        }, 3000);
                    } else {

                        this.loadAddFailure = response.error.message
                        setTimeout(() => {
                            this.loadAddFailure = ''
                        }, 3000);

                    }
                }, error => {
                    this.serviceErrorResponse = error.exception;
                    this.serviceErrorData = true;
                    this.loadAddFailure = ' Failed to create load'
                })
            } else {
                this.loadAddFailure = 'Please select different destination locations'
                setTimeout(() => {
                    this.loadAddFailure = ''
                }, 3000);
            }
        } else {
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }

    }


    /**
     * This method navigates screen to previous page
     */
    goBack(): void {
        this.close.emit();
        this.router.navigate(['/loads']);

    }
    /**
   * This method navigates screen to dash board page
   */
    goToHome() {
        const link = ['/dashboard'];
        this.router.navigate(link);
    }

}
