import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IVendor } from '../../models/vendor';
import { VendorService } from '../../services/vendors.service';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';


/** Global declarions for accessing google and $ value **/
declare var google: any;
declare var $: any;

/**
 *This component deals with vendor update operation
 */

@Component({
  templateUrl: './vendors.update.component.html',
  providers: [VendorService, FormBuilder]
})
export class VendorUpdateComponent implements OnInit {

  public vendorUpdateSuccess;
  public vendorUpdateFailure;
  public serviceErrorResponse;
  public serviceErrorData;

  public activePageTitle: string;
  public vendorUpdateResponse: string;
  public error: String;
  public vendorsList: IVendor[];
  @Input() vendor: IVendor;
  @Output() close = new EventEmitter();
  navigated = true;
  complexForm: FormGroup;
  formValidate: boolean;

  vendorNbr: AbstractControl;
  vendorName: AbstractControl;
  phoneNumber: AbstractControl;
  email: AbstractControl;
  address: AbstractControl;
  state: AbstractControl;
  city: AbstractControl;
  country: AbstractControl;
  zipCode: AbstractControl;

  constructor(private vendorService: VendorService, private route: ActivatedRoute,
    private cdr: ChangeDetectorRef, private router: Router, fb: FormBuilder) {
    this.formValidate = false;
    this.vendorUpdateResponse = '';
    this.complexForm = fb.group({
      'vendorNbr': [null, Validators.compose([Validators.pattern('[0-9]*')])],
      'vendorName': [null, Validators.compose([Validators.required,
      Validators.minLength(3), Validators.maxLength(32)])],
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'email': [null, Validators.compose([Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      'address': [null, Validators.required],
      'state': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
      'country': [null, Validators.compose([Validators.required])],
      'zipCode': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
    })
    this.vendorNbr = this.complexForm.controls['vendorNbr'];
    this.vendorName = this.complexForm.controls['vendorName'];
    this.phoneNumber = this.complexForm.controls['phoneNumber'];
    this.email = this.complexForm.controls['email'];
    this.address = this.complexForm.controls['address'];
    this.state = this.complexForm.controls['state'];
    this.city = this.complexForm.controls['city'];
    this.country = this.complexForm.controls['country'];
    this.zipCode = this.complexForm.controls['zipCode'];
  }
  ngOnInit(): void {
    this.activePageTitle = 'Update Vendor';

    this.route.params.forEach((params: Params) => {
      if (params['vendorNbr'] !== undefined) {
        const vendorNbr: string = +params['vendorNbr'] + '';
        this.navigated = true;
        this.vendorService.getVendorDetailsByNumber(vendorNbr).then(vendor => {
          this.vendor = vendor;

        });
      } else {
        this.navigated = false;

      }
    });

  }
  /** vendor Form submit **/
  updatevendorInfo(vendorData: any) {
    if (vendorData.vendorNbr != '' && vendorData.vendorName != '' && vendorData.phoneNumber != '' && vendorData.email != '' && vendorData.address != ''
      && vendorData.state != '' && vendorData.city != '' && vendorData.country != '' && vendorData.zipCode != '' && this.complexForm.valid) {
      vendorData.vendorNbr = this.vendor.vendorNbr;
      vendorData.vendorName = this.vendor.vendorName;
      vendorData.phoneNumber = this.vendor.phoneNumber;
      vendorData.email = this.vendor.email;
      vendorData.address = this.vendor.address;
      vendorData.state = this.vendor.state;
      vendorData.city = this.vendor.city;
      vendorData.country = this.vendor.country;
      vendorData.zipCode = this.vendor.zipCode;


      this.vendorService.updateVendor(vendorData)
        .then(response => {
          if (response.data != null) {
            this.vendorUpdateResponse = 'vendor details updated successfully'
            this.vendorUpdateSuccess = 'vendor details updated successfully'
            setTimeout(() => {
              this.vendorUpdateSuccess = '';
              this.router.navigate(['/vendors']);
            }, 2000);
          } else {
            this.vendorUpdateFailure = response.error.message;
            setTimeout(() => {
              this.vendorUpdateFailure = '';
            }, 3000);

          }
        }, error => {
          this.serviceErrorResponse = error.exception;
          this.serviceErrorData = true;
        })
        .catch(error => this.error = error);
    } else {
      console.log('update vendor form submission failure.....');
      this.formValidate = true;
      this.complexForm != this.complexForm;
    }
  }

  /*
 google search function
 */
  onchange(eventChange: any) {
    const places = new google.maps.places.Autocomplete(document.getElementById('address'));
    google.maps.event.addListener(places, 'place_changed', () => {
      const place = places.getPlace();
      const address = place.formatted_address.split(',');
      //   let latitude = place.geometry.location.lat();
      //   let longitude = place.geometry.location.lng();
      // this.locationData.longitude=longitude;
      // this.locationData.latitude=latitude;
      if (address[1] != 'undefined') {
        this.vendor.city = address[1].trim();
      } if (address[2] != 'undefined') {
        this.vendor.state = (address[2]).trim().split(' ')[0];
      } if (address[2] != 'undefined') {
        this.vendor.zipCode = (address[2]).trim().split(' ')[1];
      } if (address[3] != 'undefined') {
        this.vendor.country = (address[3]);
      } if (address[0] != 'undefined') {
        this.vendor.address = (address[0].trim());
      }
    });
    // this.fetchSearchDetails=false;
    this.cdr.detectChanges();
  }

  /**
    * This method navigates the screen to back
  */
  public goBack(savedVendor: IVendor = null): void {
    this.close.emit(savedVendor);
    if (this.navigated) { window.history.back(); }

  }
  /**
   * This method navigates the screen to home Page (dashboard)
   */
  public goToHome() {
    const link = ['/dashboard'];
    this.router.navigate(link);
  }

}
