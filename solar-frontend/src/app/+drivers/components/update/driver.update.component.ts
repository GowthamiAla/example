import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { IDriver } from '../../models/driver';
import { Driver } from '../../models/driver.data';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { FlashMessagesService } from 'angular2-flash-messages';

/**
 * This component deals with driver update operation
 */
@Component({
    template: require('./driver.update.component.html'),
    providers: [DriverService, FormBuilder]
})
export class DriverUpdateComponent implements OnInit {
    public driverUpdateSuccess;
    public driverUpdateFailure;

    driver: Driver = new Driver("", null, "", "", "", "", "", "", "", { formatted: '' }, { date: '' });



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
    private model: Object = { date: { year: 2018, month: 10, day: 9 } };

    private selectedDate: Object;
    public dd: any;
    public mm: any;
    public yyyy: any;

    isMatchedConfirmPassword: boolean;
    public driversList: IDriver[];
    public driverUpdateResponse: string;
    // @Input() driver: IDriver;
    public minAge: Date;
    public maxAge: Date;
    @Output() close = new EventEmitter();
    public activePageTitle: string;
    navigated = true;
    error: any;
    complexForm: FormGroup;
    formValidate: boolean;
    empID: AbstractControl;

    firstName: AbstractControl;
    lastName: AbstractControl;
    middleName: AbstractControl;
    terminal: AbstractControl;
    email: AbstractControl;
    phoneNumber: AbstractControl;
    passWord: AbstractControl;
    confirmPassword: AbstractControl;

    constructor(private driverService: DriverService, private route: ActivatedRoute, private router: Router, fb: FormBuilder, private _flashMessagesService: FlashMessagesService, private cdr: ChangeDetectorRef) {

        this.activePageTitle = "Update driver";
        this.driverUpdateResponse = '';
        this.isMatchedConfirmPassword = false;
        this.formValidate = false;
        this.complexForm = fb.group({
            'phoneNumber': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            'firstName': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
            'lastName': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
            'passWord': [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,32}$')])],
            'middleName': [null, Validators.compose([Validators.pattern('[a-zA-Z, " "]+')])],
            'confirmPassword': [null, Validators.compose([Validators.required])]
        })
        this.phoneNumber = this.complexForm.controls['phoneNumber'];
        this.firstName = this.complexForm.controls['firstName'];
        this.lastName = this.complexForm.controls['lastName'];
        this.passWord = this.complexForm.controls['passWord'];
        this.middleName = this.complexForm.controls['middleName'];
        this.confirmPassword = this.complexForm.controls['confirmPassword'];

    }
    ngOnInit() { }
    ngAfterViewInit(): void {
        this.route.params.forEach((params: Params) => {
            console.info("Getting driver deails by Id started");
            if (params['employeeID'] !== undefined) {
                let employeeID: string = +params['employeeID'] + "";
                this.navigated = true;
                this.driverService.getDriverDetailsByID(employeeID).then(driver => {

                    this.driver = driver;
                    this.driver.passWord = '';
                    let today = new Date(driver.bDate);
                    this.dd = today.getDate();
                    this.mm = today.getMonth() + 1;
                    this.yyyy = today.getFullYear();
                    if (this.dd < 10) { this.dd = "0" + this.dd }
                    if (this.mm < 10) { this.mm = "0" + this.mm }
                    this.selectedDate = this.dd + '-' + this.mm + '-' + this.yyyy;
                    this.driver.selectedDate = this.selectedDate;


                    var updatetoday = new Date();
                    var age = updatetoday.getFullYear() - this.yyyy;
                    var m = updatetoday.getMonth() - this.mm;
                    if (m < 0 || (m === 0 && updatetoday.getDate() < this.dd)) {
                        age--;
                    }
                    //return age;
                    if (age < 18) {
                        this.myDatePickerOptions = {
                            // disableSince:{year: updatetoday.getFullYear()-age, month: updatetoday.getMonth()-m, day:updatetoday.getDate()}
                            disableSince: { year: updatetoday.getFullYear() - 17, month: updatetoday.getMonth() - 11, day: updatetoday.getDate() + 1 }
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
    }

    onchange(confPassword) {
        if (this.driver.passWord == confPassword) {
            this.isMatchedConfirmPassword = true;
        } else {
            this.isMatchedConfirmPassword = false;
        }
    }
    /**
     * This method saves updated driver details
     */
    submitForm(value: any) {
        console.log(JSON.stringify(this.driver))
        if (this.complexForm.valid == true && this.driver.phoneNumber != '' && this.driver.firstName != '' && this.driver.lastName != '' && this.driver.passWord != '' && this.isMatchedConfirmPassword == true) {
            console.log(JSON.stringify(this.driver.selectedDate))
            let year = this.driver.selectedDate.date.year;
            let month = this.driver.selectedDate.date.month;
            let day = this.driver.selectedDate.date.day;
            this.driver.bDate = year + '-' + month + '-' + day;
            console.info("Driver update started ");
            this.driverService
                .updateDriver(this.driver)
                .then(response => {
                    if (response.status == "SUCCESS") {
                        this.driverUpdateSuccess = response.message;
                        let that = this;
                        setTimeout(() => {
                            this.driverUpdateSuccess = '';
                            that.router.navigate(['/drivers']);
                        }, 3000);
                    } else {
                        this.driverUpdateFailure = response.message;
                        setTimeout(() => {
                            this.driverUpdateFailure = '';
                        }, 3000);

                    }
                })
                .catch(error => this.error = error);
        }
        else {
            console.info("Driver update form submission failure.....");

            this.formValidate = true;
            this.complexForm != this.complexForm;
        }

    }
    /**
       * This method navigates the screen to back
     */
    public goBack(savedDriver: IDriver = null): void {
        this.close.emit(savedDriver);
        if (this.navigated) { window.history.back(); }

    }
    /**
     * This method navigates the screen to home Page (dashboard)
     */
    public goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }

}
