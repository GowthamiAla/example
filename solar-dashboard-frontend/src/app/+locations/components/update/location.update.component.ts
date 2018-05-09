import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LocationService } from '../../services/location.services';
import { ILocation } from '../../models/location';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { Location } from '../../models/location.data';
import * as moment from 'moment';
/** Global declarions for accessing google and $ value **/
declare var google: any;
declare var $: any;

/**
 *This component deals with dealer update operation dealer.update.component
 */

@Component({
  templateUrl: './location.update.component.html',
  providers: [LocationService, FormBuilder],
})
export class LocationUpdateComponent implements OnInit {

  public locationUpdateSuccess;
  public locationUpdateFailure;
  public locationsList: ILocation[];
  @Input() locationData: ILocation;
  public postLocation: Location = new Location('', '', '', '', '', '', '', '', '', '', null, null, null, null);;
  @Output() close = new EventEmitter();
  navigated = true;

  public activePageTitle: string;
  public locationUpdateResponse: String;
  public error: String;
  complexForm: FormGroup;
  formValidate: boolean;
  locNbr: AbstractControl;
  contactPerson: AbstractControl;
  locAddrName: AbstractControl;
  address: AbstractControl;
  city: AbstractControl;
  state: AbstractControl;
  country: AbstractControl;
  zipCode: AbstractControl;
  email: AbstractControl;
  phoneNumber: AbstractControl;
  latitude: AbstractControl;
  longitude: AbstractControl;
  public lastUpdatedDate: any;
  // public createdTS:any;
  public createdDate: any;
  public dd: any;
  public mm: any;
  public yyyy: any;
  public serviceErrorResponse;
  public serviceErrorData;


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

  constructor(private locationService: LocationService, private router: Router, fb: FormBuilder, private route: ActivatedRoute) {

    this.activePageTitle = 'updateLocation';
    this.formValidate = false;
    this.locationUpdateResponse = '';
    /** Complex form validations for Dealer data **/
    this.complexForm = fb.group({
      'locNbr': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'contactPerson': [null, Validators.compose([Validators.required, Validators.minLength(3),
      Validators.maxLength(32), Validators.pattern('[a-zA-Z, " "]+')])],
      'locAddrName': [null, Validators.compose([Validators.required,
      Validators.minLength(3), Validators.maxLength(32), Validators.pattern('[a-zA-Z, " "]+')])],
      'address': [null, Validators.required],
      'city': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
      'state': [null, Validators.compose([Validators.required])],
      'country': [null, Validators.compose([Validators.required])],
      'zipCode': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'email': [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'latitude': [null, Validators.compose([Validators.required])],
      'longitude': [null, Validators.compose([Validators.required])],
    })
    this.locNbr = this.complexForm.controls['locNbr'];
    this.contactPerson = this.complexForm.controls['contactPerson'];
    this.locAddrName = this.complexForm.controls['locAddrName'];
    this.address = this.complexForm.controls['address'];
    this.city = this.complexForm.controls['city'];
    this.state = this.complexForm.controls['state'];
    this.country = this.complexForm.controls['country'];
    this.zipCode = this.complexForm.controls['zipCode'];
    this.email = this.complexForm.controls['email'];
    this.phoneNumber = this.complexForm.controls['phoneNumber'];
    this.latitude = this.complexForm.controls['latitude'];
    this.longitude = this.complexForm.controls['longitude'];
  }


  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['locNbr'] !== undefined) {
        const locNbr: string = +params['locNbr'] + '';
        this.navigated = true;
        this.locationService.getLocationDetailsByID(locNbr).then(locationData => {
          this.locationData = locationData;
          // let locationdate = new Date(locationData.lastUpdatedTS);
          const date = new Date(locationData.lastUpdatedTS);
          this.lastUpdatedDate = {
            date: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate()
            }
          };

          // public model: any = { date: { year: 2018, month: 10, day: 9 } };
          const lastdate = new Date(locationData.createdTS);
          this.createdDate = {
            date: {
              year: lastdate.getFullYear(),
              month: lastdate.getMonth() + 1,
              day: lastdate.getDate()
            }
          };
        });
      } else {
        this.navigated = false;
      }
    });
  }


  /** Dealers Form submit **/
  submitForm(locationDataValues) {
    const today_Date = new Date();
    this.postLocation = {
      'locNbr': locationDataValues.locNbr,
      'contactPerson': locationDataValues.contactPerson,
      'locAddrName': locationDataValues.locAddrName,
      'address': locationDataValues.address,
      'city': locationDataValues.city,
      'state': locationDataValues.state,
      'country': locationDataValues.country,
      'zipCode': locationDataValues.zipCode,
      'email': locationDataValues.email,
      'phoneNumber': locationDataValues.phoneNumber,
      'latitude': locationDataValues.latitude,
      'longitude': locationDataValues.longitude,
      'createdTS': moment(today_Date).format(),
      'lastUpdatedTS': moment(today_Date).format(),
    }

    if (locationDataValues.locNbr != '' && locationDataValues.contactPerson != ''
      && locationDataValues.locAddrName != '' && locationDataValues.state != '' && locationDataValues.city != ''
      && locationDataValues.country != '' && locationDataValues.zipCode != '' && locationDataValues.phoneNumber != ''
      && locationDataValues.email != '' && locationDataValues.address != '' && locationDataValues.latitude != '' &&
      locationDataValues.longitude != '' && this.complexForm.valid) {
      // successs
      this.locationService.updateLocation(this.postLocation)
        .then(response => {
          if (response.data != null) {
            this.locationUpdateSuccess = 'Location updated successfully'
            setTimeout(() => {
              this.locationUpdateSuccess = '';
              this.router.navigate(['/locations']);
            }, 3000);
          } else {
            this.locationUpdateFailure = response.error.message;
            setTimeout(() => {
              this.locationUpdateFailure = ''
            }, 3000)
          }
        }, error => {
          this.serviceErrorResponse = error.exception;
          this.serviceErrorData = true;
        })
        .catch(error => this.error = error);
    } else {
      this.formValidate = true;
    }
  }


  /** Google auto generated places for Dealer address **/
  onchange(eventChange: any) {
    const places = new google.maps.places.Autocomplete(document.getElementById('address'));
    google.maps.event.addListener(places, 'place_changed', () => {
      const place = places.getPlace();
      const address = place.formatted_address.split(',');
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      this.locationData.latitude = latitude;
      this.locationData.longitude = longitude;
      if (address[1] != 'undefined') {
        this.locationData.city = address[1].trim();
      }
      if (address[2] != 'undefined') {
        this.locationData.state = (address[2]).trim().split(' ')[0];
      }
      if (address[2] != 'undefined') {
        this.locationData.zipCode = (address[2]).trim().split(' ')[1];
      }
      if (address[0] != 'undefined') {
        this.locationData.address = address[0].trim();
      }
    });

  }

  /**
    * This method navigates the screen to back
  */
  public goBack(savedDriver: ILocation = null): void {
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


}
