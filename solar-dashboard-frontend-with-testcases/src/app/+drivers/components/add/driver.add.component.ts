import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from '../../models/driver.data';
import { DriverService } from '../../services/driver.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IMyOptions, IMyDateModel } from 'mydatepicker';

/**
 * This component adds new driver
 */
@Component({
  templateUrl: './driver.add.component.html',
  providers: [DriverService],
  styles: [`
   @media only screen and (max-width: 500px) {
    .split-input {
      margin-top:5%'
    }
    }`]
})
export class DriverAddComponent implements OnInit {
  public driverAddSuccess;
  public driverAddFailure;
  @Output() close = new EventEmitter();
  navigated = true;

  driver: Driver = new Driver('', null, null, '', '', '', '', '', 0, 0, '', null, null);

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
  private datePickerOptions: IMyOptions = {
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
  private dateOfBirth: Date;
  isMatchedConfirmPassword: boolean;
  public activePageTitle: string;
  public minAge: Date;
  public error: string;
  public driverAddResponse: string;
  public maxAge: Date;
  private placeholder = 'Select date of birth';
  complexForm: FormGroup;
  formValidate: boolean;
  public dateBirth: any;
  public licenseExpiryDate: Date;
  public vendorsList;
  public dealerNameListData;
  public serviceErrorResponse;
  public serviceErrorData;

  firstName: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;
  phoneNumber: AbstractControl;
  licenseNumber: AbstractControl;
  vendorNum: AbstractControl;
  licenseExpiry;

  constructor(private router: Router, private driverService: DriverService, private fb: FormBuilder) {
    this.driverAddResponse = '';
    this.formValidate = false;
    this.isMatchedConfirmPassword = false;
    this.driver.vendor = '';
    this.complexForm = fb.group({
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'firstName': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern('[a-zA-Z*" "]+')])],
      'lastName': [null, Validators.compose([Validators.minLength(3),
      Validators.maxLength(32), Validators.pattern('[a-zA-Z*" "]+')])],
      'email': [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      'licenseNumber': [null, Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9, " "]+')])],
      'vendorNum': [null, Validators.required],
    })
    this.phoneNumber = this.complexForm.controls['phoneNumber'];
    this.firstName = this.complexForm.controls['firstName'];
    this.lastName = this.complexForm.controls['lastName'];
    this.email = this.complexForm.controls['email'];
    this.licenseNumber = this.complexForm.controls['licenseNumber'];
    this.vendorNum = this.complexForm.controls['vendorNum'];
  }
  ngOnInit() {
    this.getVendors();
    const updatetoday = new Date();
    this.myDatePickerOptions = {
      showClearDateBtn: false,
      dateFormat: 'dd-mm-yyyy',
      selectionTxtFontSize: '14px',
      indicateInvalidDate: true,
      disableSince: { year: updatetoday.getFullYear() - 17, month: updatetoday.getMonth() - 12, day: updatetoday.getDate() + 1 }
    }
    this.datePickerOptions = {
      showClearDateBtn: false,
      dateFormat: 'dd-mm-yyyy',
      selectionTxtFontSize: '14px',
      indicateInvalidDate: true,
    }
  }

  /**
   * This method sets submitted property to true to hide form in view .
   */

  onchange(confPassword) {
    if (this.driver.password == confPassword) {
      this.isMatchedConfirmPassword = true;
    } else {
      this.isMatchedConfirmPassword = false;
    }
  }
  getVendors() {
    this.driverService.getVendorsInfo().subscribe(response => {
      this.vendorsList = response;
    }, error =>
        console.log(error)
    )
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
    this.datePickerOptions = {
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
  /**
     * This method adds a new driver details
   */
  submitForm(value: any) {
    if (this.complexForm.valid) {
      if (this.driver.firstName != '' && this.driver.email != '' && this.dateBirth != null && this.driver.phoneNumber != ''
        && this.driver.licenseNumber != '' && this.driver.vendor != '' && this.licenseExpiry != null) {
        this.driver.dateOfBirth = this.dateBirth["jsdate"];
        this.driver.licenseExpiryDate = this.licenseExpiry["jsdate"];

        const driverObject = {
          'user': {},
          'dateOfBirth': this.driver.dateOfBirth,
          'firstName': this.driver.firstName,
          'lastName': this.driver.lastName,
          'email': this.driver.email,
          'phoneNumber': this.driver.phoneNumber,
          'password': '',
          'latitude': 0,
          'longitude': 0,
          'licenseNumber': this.driver.licenseNumber,
          'licenseExpiryDate': this.driver.licenseExpiryDate,
          'vendor': {
            'vendorNbr': this.driver.vendor
          }
        }
        this.driverService.addDriver(driverObject).then(response => {
          if (response.data != null) {
            this.driverAddSuccess = 'Driver added sucessfully'
            let that = this;
            setTimeout(() => {
              this.driverAddSuccess = ''
              this.router.navigate(['/drivers']);
            }, 2000);
          } else {
            this.driverAddFailure = response.error.message
            setTimeout(() => {
              this.driverAddFailure = ''
            }, 3000);
          }
        },error=>{
          this.serviceErrorResponse = error.exception;
          this.serviceErrorData = true;
        })
          .catch(error => this.error = error);
      } else {
        console.log('add driver form submission failure.....');
        this.formValidate = true;
        this.complexForm != this.complexForm;
      }
    } else {
      this.formValidate = true;
    }
  }


  /**
   * This method navigates screen to previous page
 */
  goBack(): void {
    if (this.navigated) { window.history.back(); }

  }
  /**
 * This method navigates screen to dash board page
 */
  goToHome() {
    let link = ['/dashboard'];
    this.router.navigate(link);
  }


}
