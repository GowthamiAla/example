import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from '../../models/driver.data';
import { DriverService } from '../../services/driver.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { FlashMessagesService } from 'angular2-flash-messages';

/**
 * This component adds new driver
 */
@Component({
  template: require('./driver.add.component.html'),
  providers: [DriverService]
})
export class DriverAddComponent implements OnInit {
  public driverAddSuccess;
  public driverAddFailure;
  @Output() close = new EventEmitter();
  navigated = true;
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
  isMatchedConfirmPassword: boolean;
  public activePageTitle: string;
  public minAge: Date;
  public error: string;
  public driverAddResponse: string;
  public maxAge: Date;
  private placeholder: string = 'Select Date Of Birth';
  complexForm: FormGroup;
  formValidate: boolean;

  empID: AbstractControl;
  // bDate: AbstractControl;
  firstName: AbstractControl;
  lastName: AbstractControl;
  middleName: AbstractControl;
  terminal: AbstractControl;
  email: AbstractControl;
  phoneNumber: AbstractControl;
  passWord: AbstractControl;
  confirmPassword: AbstractControl;

  constructor(private router: Router, private driverService: DriverService, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {
    this.activePageTitle = "Add Driver";
    this.driverAddResponse = '';
    this.formValidate = false;
    this.isMatchedConfirmPassword = false;
    this.complexForm = fb.group({
      'empID': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'firstName': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
      'lastName': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
      'passWord': [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,32}$')])],
      'middleName': [null, Validators.compose([Validators.pattern('[a-zA-Z, " "]+')])],
      'confirmPassword': [null, Validators.compose([Validators.required])]


    })
    this.empID = this.complexForm.controls['empID'];
    this.phoneNumber = this.complexForm.controls['phoneNumber'];
    this.firstName = this.complexForm.controls['firstName'];
    this.lastName = this.complexForm.controls['lastName'];
    this.email = this.complexForm.controls['email'];
    this.passWord = this.complexForm.controls['passWord'];
    this.middleName = this.complexForm.controls['middleName'];
    // this.bDate = this.complexForm.controls['bDate'];
    this.confirmPassword = this.complexForm.controls['confirmPassword'];
  }
  ngOnInit() {
    var updatetoday = new Date();
    this.myDatePickerOptions = {
      disableSince: { year: updatetoday.getFullYear() - 17, month: updatetoday.getMonth() - 11, day: updatetoday.getDate() + 1 }
    }
  }

  /**
   * This method sets submitted property to true to hide form in view .
   */

  onchange(confPassword) {
    if (this.driver.passWord == confPassword) {
      this.isMatchedConfirmPassword = true;
    } else {
      this.isMatchedConfirmPassword = false;
    }
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

  submitForm(value: any) {
    if (this.complexForm.valid == true && this.driver.empID != '' && this.driver.phoneNumber != '' && this.driver.firstName != '' && this.driver.lastName != '' && this.driver.passWord != '' && this.driver.selectedDate != null && this.isMatchedConfirmPassword == true) {
      this.driver.terminal = '60';
      console.log(JSON.stringify(this.driver.selectedDate))
      let year = this.driver.selectedDate.date.year;
      let month = this.driver.selectedDate.date.month;
      let day = this.driver.selectedDate.date.day;
      this.driver.bDate = year + '-' + month + '-' + day;
      console.info("add driver form submission started.....");

      this.driverService.addDriver(this.driver).then(response => {
        if (response.status == "SUCCESS") {

          this.driverAddSuccess = response.message
          let that = this;
          setTimeout(() => {
            this.driverAddSuccess = ''
            that.router.navigate(['/drivers']);
          }, 3000);
        } else {

          this.driverAddFailure = response.message
          setTimeout(() => {
            this.driverAddFailure = ''
          }, 3000);

        }
      })
        .catch(error => this.error = error);
    }
    else {
      console.info("add driver form submission failure.....");
      this.formValidate = true;
      this.complexForm != this.complexForm;
    }
  }
  /**
    * This method adds a new driver details
  */
  public addDriver(driver: Driver) {
    console.info("Adding new driver started ");
    console.info("Adding new driver ended ");
    this.goBack();
  }

  /**
   * This method navigates screen to previous page
 */
  goBack(): void {
    this.close.emit();

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
