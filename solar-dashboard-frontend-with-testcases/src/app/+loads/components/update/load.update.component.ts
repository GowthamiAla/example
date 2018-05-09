import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { LoadsService } from '../../services/load.service';
import { ILoad } from '../../models/load';
import { Load } from '../../models/load.data';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import * as moment from 'moment';
declare var $;
/**
 * This component deals with loads update operation
 */
@Component({
    templateUrl: './load.update.component.html',
    providers: [LoadsService]
})
export class LoadUpdateComponent implements OnInit {

    public loadUpdateSuccess;
    public loadUpdateFailure;

    public updateDriverNameListData;
    public updateDealerNameListData;
    public updateDriversOptions;
    public updateDealerOptions;
    public selectedDriverName: string;
    public selectedDealerName: string;
    public skiDropsMismatched: boolean;
    public selectedDealerList: Array<string> = [];
    public loadUpdateResponse: String;
    public error: String;
    public loadList: ILoad[];
    @Input() load: any = {};
    @Output() close = new EventEmitter();

    public locationList;
    public truckList;
    public vendorsList;
    public appointmentTypesList;
    public driverList;

    public activePageTitle: string;

    navigated = true;
    public driversList = [];
    public dealersList = [];
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

    public orignlocAddrName;
    public destAddrName;
    public vendorId: any;
    public appointmentypeId: any;
    public driverNum: any;
    public serviceErrorResponse;
    public serviceErrorData;


    constructor(private router: Router, private route: ActivatedRoute, private loadService: LoadsService,
        fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.activePageTitle = 'Update Load';
        this.loadUpdateResponse = '';
        this.formValidate = false;
        this.complexForm = fb.group({
            'loadNum': [null, Validators.compose([Validators.required, Validators.minLength(1),
            Validators.maxLength(10), Validators.pattern('[0-9]+')])],
            'driverId': [null, Validators.required],
            'originNum': [null, Validators.required],
            'destinNum': [null, Validators.required],
            'vendorNum': [null, Validators.required],
            // 'truckNum': [null, Validators.compose([Validators.required, Validators.pattern('[a-z A-Z 0-9]+')])],
            'appointmentye': [null, Validators.required],
            'cartons': [null, Validators.compose([Validators.pattern('^(15[0]|1[0-4][0-9]|[0-9][0-9]|[1-9])$')])],
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
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            if (params['loadNum'] !== undefined) {
                const loadNum: string = +params['loadNum'] + '';
                this.navigated = true;
                this.loadService.getLoadDetailsByLoadNum(loadNum).toPromise().then(loads => {
                    this.load = loads;
                    // this.driverNameDetails(loadNum);
                    this.getAppointments();
                    this.getAlllocations();
                    this.getVendors();
                    this.getDriversByVendorNum(this.load.vndNbr.vendorNbr);
                    this.cdr.detectChanges();
                });
            } else {
                this.navigated = false;
            }
        });

    }

    /**
    * Get All locations
    */

    getAlllocations() {
        this.loadService.getAlllocationsInfo().subscribe(response => {
            this.locationList = response;
            for (let i = 0; i < this.locationList.length; i++) {
                if (this.locationList[i].locNbr == this.load.originLocNbr.locNbr) {
                    this.orignlocAddrName = this.locationList[i].locNbr;
                    break;
                }
            }
            for (let i = 0; i < this.locationList.length; i++) {
                if (this.locationList[i].locNbr == this.load.destLocNbr.locNbr) {
                    this.destAddrName = this.locationList[i].locNbr;
                    break;
                }
            }
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
            for (let v = 0; v < this.vendorsList.length; v++) {
                if (this.vendorsList[v].vendorNbr == this.load.vndNbr.vendorNbr) {
                    this.vendorId = this.vendorsList[v].vendorNbr;
                }
            }
        }, error =>
                console.log(error)
        )
    }
    /**
     * Drivers List Based on Vendors
     */
    getDriversByVendorNum(vendorNbr) {
        this.driverNum = '';
        this.loadService.getDriverNameListBasedOnVendors(vendorNbr).subscribe(response => {
            this.driverList = response.data;
            for (const driver of this.driverList) {
                if (this.load.driver.id == driver.id) {
                    this.driverNum = this.load.driver.id;
                }
            }
        }, error =>
                console.log(error)
        )
    }

    /**
    * AppointmentTypes
    */

    public getAppointments() {
        this.loadService.getAppointmentTypesInfo().subscribe(response => {
            this.appointmentTypesList = response;
            for (let a = 0; a < this.appointmentTypesList.length; a++) {
                if (this.appointmentTypesList[a].id == this.load.apptTypNbr.id) {
                    this.appointmentypeId = this.appointmentTypesList[a].id;
                }
            }
        }, error =>
                console.log(error)
        )
    }

    /**
     * Driver Info
     */


    /**
    * This method sets submitted property to true to hide form in view .
    */
    updateLoadData(value: any) {
        if (this.complexForm.valid && value.loadNum != '' && value.driverId != '' && value.originNum != ''
            && value.destinNum != '' && value.geomile != '' && value.appointmentye != '' && this.complexForm.valid) {
            if (value.originNum != value.destinNum) {
                const today_Date = new Date();
                const userID = localStorage.getItem('userData');
                const updateLoadObject = {
                    'apptNbr': value.loadNum,
                    'originLocNbr': {
                        'locNbr': value.originNum
                    },
                    'destLocNbr': {
                        'locNbr': value.destinNum
                    },

                    'lastUpdatedTS': moment(today_Date).format(),
                    'lastUpdatedUser': {
                        'id': userID
                    },
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
                        'id': this.load.apptStatNbr.id
                    },
                    'highValueLoad': this.load.highValueLoad,
                    'highPriorityLoad': this.load.highPriorityLoad,
                    'geomiles': value.geomile
                }

                this.loadService.updateLoad(updateLoadObject).then(response => {
                    if (response.data != null) {
                        // this.loadService = response.message
                        this.loadUpdateSuccess = 'Load updated successfully';
                        setTimeout(() => {
                            this.loadUpdateSuccess = ''
                            this.router.navigate(['/loads']);
                        }, 2000);
                    } else {
                        this.loadUpdateFailure = response.error.message;
                        setTimeout(() => {
                            this.loadUpdateFailure = ''
                        }, 2000);
                    }
                }, error => {
                    this.serviceErrorResponse = error.exception;
                    this.serviceErrorData = true;
                })
            } else {
                this.loadUpdateFailure = 'Please select different destination locations';
                setTimeout(() => {
                    this.loadUpdateFailure = ''
                }, 2000);
            }
        } else {
            console.log('error');
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }



    goBack(): void {
        this.router.navigate(['/loads']);
    }
    goToHome() {
        const link = ['/dashboard'];
        this.router.navigate(link);
    }



}
