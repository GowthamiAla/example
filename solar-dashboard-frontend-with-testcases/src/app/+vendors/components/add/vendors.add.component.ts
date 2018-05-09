import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Vendor } from '../../models/vendor.data';
import { IVendor } from '../../models/vendor';
import { VendorService } from '../../services/vendors.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';



/** Global declarions for accessing google and $ value **/
declare var google: any;
declare var $: any;

/**
 * This component adds new VendorService
 */
@Component({
  templateUrl: './vendors.add.component.html',
  providers: [VendorService, FormBuilder]
})
export class VendorAddComponent implements OnInit {


  public vendorAddFailure;
  public vendorAddSuccess;

  public activePageTitle: string;
  public message: string;
  @Output() close = new EventEmitter();
  navigated = true;
  public vendorsList: IVendor[];
  public userAddResponse: string;
  public error: string;
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
  public vendor: IVendor = new Vendor('', '', '', '', '', '', '', '', '');
  public serviceErrorResponse;
  public serviceErrorData;


  ngOnInit() {
    this.activePageTitle = 'Add Vendor';
  }


  constructor(private router: Router, private vendorService: VendorService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.formValidate = false;
    this.complexForm = fb.group({
      'vendorNbr': [null, Validators.compose(
        [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]+')])],
      'vendorName': [null,
        Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern('[a-zA-Z*" "]+')])],
      'phoneNumber': [null,
        Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
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
  /** vendors Form submit **/
  submitForm(value: any) {

    if (value.vendorNbr != '' && value.vendorName != '' && value.phoneNumber != '' && value.email != '' && value.address != ''
      && value.state != '' && value.city != '' && value.country != '' && value.zipCode != '' && this.complexForm.valid) {


      const vendorObject = {
        'vendorNbr': value.vendorNbr,
        'vendorName': value.vendorName,
        'phoneNumber': value.phoneNumber,
        'email': value.email,
        'address': value.address,
        'state': value.state,
        'city': value.city,
        'country': value.country,
        'zipCode': value.zipCode,

      }


      this.vendorService.addVendor(vendorObject)
        .then(response => {

          if (response.data != null) {
            this.vendorAddSuccess = 'vendor details added successfully';
            setTimeout(() => {
              this.router.navigate(['/vendors']);
              this.vendorAddSuccess = '';
            }, 2000);
            // this.router.navigate(['/vendors']);
          } else {
            this.vendorAddFailure = response.error.message;
            setTimeout(() => {
              this.vendorAddFailure = '';
            }, 2000);
          }
        }, error => {
          this.serviceErrorResponse = error.exception;
          this.serviceErrorData = true;
        })
        .catch(error => this.error = error);
    } else {
      console.log('add vendor form submission failure.....');
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

      if (address[1] != 'undefined') {
        this.vendor.city = address[1].trim();
      }
      if (address[2] != 'undefined') {
        this.vendor.state = (address[2]).trim().split(' ')[0];
      }
      if (address[2] != 'undefined') {
        this.vendor.zipCode = (address[2]).trim().split(' ')[1];
      }
      if (address[3] != 'undefined') {
        this.vendor.country = (address[3]);
      }
      if (address[0] != 'undefined') {
        this.vendor.address = (address[0].trim());
      }
    });
    // this.fetchSearchDetails=false;
    this.cdr.detectChanges();
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
    const link = ['/dashboard'];
    this.router.navigate(link);
  }
}
