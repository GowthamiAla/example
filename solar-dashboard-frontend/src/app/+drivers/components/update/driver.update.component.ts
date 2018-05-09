import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { IDriver } from '../../models/driver';
import { Driver } from '../../models/driver.data';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { IMyOptions, IMyDateModel } from 'mydatepicker';


/**
 * This component deals with driver update operation
 */
@Component({
    templateUrl: './driver.update.component.html',
    providers: [DriverService, FormBuilder],
    styles: [`
   @media only screen and (max-width: 500px) {
    .split-input {
      margin-top:5% 
    }
    }`]
})
export class DriverUpdateComponent implements OnInit {
    public driverUpdateSuccess;
    public driverUpdateFailure;
    public serviceErrorResponse;
    public serviceErrorData;
    driver: any = {};

    private myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'dd-mm-yyyy',
        showTodayBtn: false,
        showClearDateBtn: false,
        editableDateField: false,
        height: '30px',
        selectionTxtFontSize: '14px',
        indicateInvalidDate: true,
    };

    private expirydatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'dd-mm-yyyy',
        showTodayBtn: false,
        showClearDateBtn: false,
        editableDateField: false,
        height: '30px',
        selectionTxtFontSize: '14px',
        indicateInvalidDate: true,
    };
    private model: Object = { date: { year: 2018, month: 10, day: 9 } };
    private selectedDate: Object;
    public selectedLicenseExpiryDate: Object;
    public vendorsList;
    public dealerNameListData;
    public dd: any;
    public mm: any;
    public yyyy: any;
    isMatchedConfirmpassword: boolean;
    public driversList: IDriver[];
    public driverUpdateResponse: string;
    public vendorId;
    // @Input() driver: IDriver;
    public minAge: Date;
    public maxAge: Date;
    @Output() close = new EventEmitter();
    public activePageTitle: string;
    navigated = true;
    error: any;
    complexForm: FormGroup;
    formValidate: boolean;
    firstName: AbstractControl;
    lastName: AbstractControl;
    email: AbstractControl;
    phoneNumber: AbstractControl;
    licenseNumber: AbstractControl;
    vendorNum: AbstractControl;

    constructor(private driverService: DriverService, private route: ActivatedRoute, private router: Router, fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.activePageTitle = 'Update driver';
        this.driverUpdateResponse = '';
        this.isMatchedConfirmpassword = false;
        this.formValidate = false;
        this.complexForm = fb.group({
            'phoneNumber': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            'firstName': [null, Validators.compose([Validators.required])],
            'lastName': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(32), Validators.pattern('[a-zA-Z*" "]+')])],
            'licenseNumber': [null, Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9, " "]+')])],
            'vendorNum': [null, Validators.required]
        })
        this.phoneNumber = this.complexForm.controls['phoneNumber'];
        this.firstName = this.complexForm.controls['firstName'];
        this.lastName = this.complexForm.controls['lastName'];
        this.licenseNumber = this.complexForm.controls['licenseNumber'];
        this.vendorNum = this.complexForm.controls['vendorNum'];
    }

    ngOnInit() {
        //disabling the dates in calender
        var updatetoday = new Date();
        this.myDatePickerOptions = {
            showClearDateBtn: false,
            dateFormat: 'dd-mm-yyyy',
            selectionTxtFontSize: '14px',
            indicateInvalidDate: true,
            disableSince: { year: updatetoday.getFullYear() - 17, month: updatetoday.getMonth() - 12, day: updatetoday.getDate() + 1 }
        }


        this.expirydatePickerOptions = {
            dateFormat: 'dd-mm-yyyy',
            showTodayBtn: false,
            showClearDateBtn: false,
            editableDateField: false,
            height: '30px',
            selectionTxtFontSize: '14px',
            indicateInvalidDate: true,
        }

        //get state params value
        this.route.params.forEach((params: Params) => {
            if (params['id'] !== undefined) {
                let driverId: string = +params['id'] + "";
                this.navigated = true;

                //get driver Details by Id
                this.driverService.getDriverDetailsByID(driverId).then(driver => {
                    this.driver = driver;
                    this.getVendors();
                    //this.driver.password = '';
                    let driverDOb = new Date(driver.dateOfBirth);
                    this.selectedLicenseExpiryDate = moment(driver.licenseExpiryDate).format("DD-MM-YYYY");
                    //selectedLicenseExpiryDate
                    this.dd = driverDOb.getDate();
                    this.mm = driverDOb.getMonth() + 1;
                    this.yyyy = driverDOb.getFullYear();
                    if (this.dd < 10) { this.dd = "0" + this.dd }
                    if (this.mm < 10) { this.mm = "0" + this.mm }
                    this.selectedDate = moment(driver.dateOfBirth).format("DD-MM-YYYY");

                    var updatetoday = new Date();
                    var age = updatetoday.getFullYear() - this.yyyy;
                    var m = updatetoday.getMonth() - this.mm;
                    if (m < 0 || (m === 0 && updatetoday.getDate() < this.dd)) {
                        age--;
                    }
                    if (age < 18) {
                        this.myDatePickerOptions = {
                            disableSince: { year: updatetoday.getFullYear() - 17, month: updatetoday.getMonth() - 12, day: updatetoday.getDate() + 1 }
                        }
                    }
                });
                this.cdr.detectChanges();
                console.info("Getting driver deails by Id ended");
            } else {
                this.navigated = false;
            }
        });
    }


    onDateChanged(event: IMyDateModel) {
        this.myDatePickerOptions = {
            // other options...
            dateFormat: 'dd-mm-yyyy',
            showTodayBtn: false,
            showClearDateBtn: false,
            editableDateField: false,
            height: '30px',
            selectionTxtFontSize: '14px',
            indicateInvalidDate: true,
        };
    }
    getVendors() {
        this.driverService.getVendorsInfo().subscribe(response => {
            this.vendorsList = response;
            for (let i = 0; i < this.vendorsList.length; i++) {
                if (this.vendorsList[i].vendorNbr == this.driver.vendor.vendorNbr) {
                    this.driver.vendorId = this.vendorsList[i].vendorNbr;
                    break;
                }
            }
        }, error =>
                console.log(error)
        )
    }



    /**
     * This method saves updated driver details
     */
    submitForm(value: any) {
        if (this.complexForm.valid) {
            if (this.driver.firstName != '' && this.driver.email != '' && this.driver.selectedDate != null && this.driver.phoneNumber != ''
                && this.driver.licenseNumber != '' && this.driver.vendorId != '' && this.driver.selectedLicenseExpiryDate != null) {
                this.driver.dateOfBirth = this.driver.selectedDate["jsdate"];
                this.driver.licenseExpiryDate = this.driver.selectedLicenseExpiryDate["jsdate"];


                let driverPostObject = {
                    'id': this.driver.id,
                    'user': this.driver.user,
                    'dateOfBirth': this.driver.dateOfBirth,
                    'firstName': this.driver.firstName,
                    'lastName': this.driver.lastName,
                    'email': this.driver.email,
                    'phoneNumber': this.driver.phoneNumber,
                    'latitude': this.driver.latitude,
                    'longitude': this.driver.longitude,
                    'password': this.driver.password,
                    'licenseNumber': this.driver.licenseNumber,
                    'vendor':
                        {
                            'vendorNbr': this.driver.vendorId
                        },
                    'licenseExpiryDate': this.driver.licenseExpiryDate
                }
                this.driverService.updateDriver(driverPostObject).then(response => {
                    if (response.data != null) {
                        this.driverUpdateSuccess = 'Driver updated sucessfully';
                        let that = this;
                        setTimeout(() => {
                            this.driverUpdateSuccess = '';
                            that.router.navigate(['/drivers']);
                        }, 3000);
                    } else {
                        this.driverUpdateFailure = response.error.message;
                        setTimeout(() => {
                            this.driverUpdateFailure = '';
                        }, 3000);
                    }
                }, error => {
                    this.serviceErrorResponse = error.exception;
                    this.serviceErrorData = true;
                })
                    .catch(error => this.error = error);
            }
            else {
                this.formValidate = true;
                this.complexForm != this.complexForm;

            }
        } else {
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }

    /**
       * This method navigates the screen to back
     */
    public goBack(savedDriver: IDriver = null): void {
        this.router.navigate(['/drivers']);
    }
    /**
     * This method navigates the screen to home Page (dashboard)
     */
    public goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }

}











