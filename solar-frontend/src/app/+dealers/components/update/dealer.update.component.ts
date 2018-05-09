import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DealerService } from '../../services/dealer.services';
import { IDealer } from '../../models/dealer';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';


/** Global declarions for accessing google and $ value **/
declare var google: any;
declare var $: any;

/**
 *This component deals with dealer update operation dealer.update.component
 */

@Component({
  template: require('./dealer.update.component.html'),
  providers: [DealerService, FormBuilder]
})
export class DealerUpdateComponent implements OnInit {

  public dealerUpdateSuccess;
  public dealerUpdateFailure;
  public dealersList: IDealer[];
  @Input() dealerData: IDealer;
  @Output() close = new EventEmitter();
  navigated = true;

  public activePageTitle: string;
  public dealerUpdateResponse: String;
  public error: String;
  complexForm: FormGroup;
  formValidate: boolean;
  dealerCd: AbstractControl;
  desc: AbstractControl;
  affil: AbstractControl;
  shipId: AbstractControl;
  address: AbstractControl;
  city: AbstractControl;
  state: AbstractControl;
  zipCode: AbstractControl;
  contact: AbstractControl;
  phone: AbstractControl;
  phone2: AbstractControl;
  email1: AbstractControl;
  email2: AbstractControl;
  latitude: AbstractControl;
  longtitude: AbstractControl;
  password: AbstractControl;
  instruction: AbstractControl;



  constructor(private dealerService: DealerService, private router: Router, fb: FormBuilder, private route: ActivatedRoute, private _flashMessagesService: FlashMessagesService) {

    this.activePageTitle = 'updateDealer';
    this.formValidate = false;
    this.dealerUpdateResponse = '';
    /** Complex form validations for Dealer data **/
    this.complexForm = fb.group({
      'dealerCd': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'contact': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
      'desc': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
      'phone': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'affil': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'phone2': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'shipId': [null, Validators.compose([Validators.required, Validators.pattern('[a-z A-Z]+')])],
      'email1': [null, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
      'address': [null, Validators.required],
      'email2': [null, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
      'city': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+')])],
      'latitude': [null, Validators.compose([Validators.required])],
      'state': [null, Validators.compose([Validators.required])],
      'longtitude': [null, Validators.compose([Validators.required])],
      'zipCode': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      'password': [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}$')])],
      'instruction': [null, Validators.required],
    })
    this.dealerCd = this.complexForm.controls['dealerCd'];
    this.desc = this.complexForm.controls['desc'];
    this.affil = this.complexForm.controls['affil'];
    this.shipId = this.complexForm.controls['shipId'];
    this.address = this.complexForm.controls['address'];
    this.city = this.complexForm.controls['city'];
    this.state = this.complexForm.controls['state'];
    this.zipCode = this.complexForm.controls['zipCode'];
    this.contact = this.complexForm.controls['contact'];
    this.phone = this.complexForm.controls['phone'];
    this.phone2 = this.complexForm.controls['phone2'];
    this.email1 = this.complexForm.controls['email1'];
    this.email2 = this.complexForm.controls['email2'];
    this.latitude = this.complexForm.controls['latitude'];
    this.longtitude = this.complexForm.controls['longtitude'];
    this.password = this.complexForm.controls['password'];
    this.instruction = this.complexForm.controls['instruction'];
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      console.info("Getting dealer deails by Id started");
      if (params['dealerCd'] !== undefined) {
        let dealerCd: string = +params['dealerCd'] + "";
        this.navigated = true;
        this.dealerService.getDealerDetailsByID(dealerCd).then(dealerData => {
          this.dealerData = dealerData;
          // console.log(JSON.stringify(this.dealerData))
        });
        console.info("Getting dealer deails by Id ended");
      } else {
        this.navigated = false;
      }
    });
  }


  /** appending auto generated google place data to Dealers data **/
  updateDealerForm(values: any) {
    this.dealerData.city = $("#city").val();
    this.dealerData.latitude = $("#latitude").val();
    this.dealerData.longtitude = $("#longtitude").val();
    this.dealerData.zipCode = $("#zipCode").val();
    this.dealerData.address = $("#address").val();
  }


  /** Dealers Form submit **/
  submitForm(value: any) {

    if (this.dealerData.dealerCd != '' && this.dealerData.desc != '' && this.dealerData.affil != '' && this.dealerData.shipId != '' && this.dealerData.address != '' && this.dealerData.city != '' &&
      this.dealerData.state != '' && this.dealerData.zipCode != '' && this.dealerData.contact != '' && this.dealerData.phone != '' && this.dealerData.email1 != '' && this.dealerData.latitude != null &&
      this.dealerData.longtitude != null) {
      this.dealerData.primaryEmailFlag = "1";
      this.dealerData.primaryEmailFlag2 = "1";
      this.dealerData.primaryPhoneFlag = "1";
      this.dealerData.primaryPhoneFlag2 = "1";
      //successs
      console.info("add dealer form submission started.....");
      this.dealerService.updateDealer(this.dealerData)
        .then(response => {
          if (response.status == "SUCCESS") {
            // this._flashMessagesService.show(response.message, { cssClass: 'alert-success' })
            this.dealerUpdateSuccess = response.message
            let that = this;
            setTimeout( ()=>{
              this.dealerUpdateSuccess = '';
              that.router.navigate(['/dealers']);
            }, 3000);
          } else {
            // this._flashMessagesService.show(response.message, { cssClass: 'alert-danger' })
            this.dealerUpdateFailure = response.message;
            setTimeout(() => {
              this.dealerUpdateFailure = ''
            }, 3000)
          }
        })
        .catch(error => this.error = error);
    }
    else {
      //failure
      console.info("add dealer form submission failure.....");
      this.formValidate = true;
      this.complexForm != this.complexForm;
    }
  }

  /** Google auto generated places for Dealer address **/
  onchange(eventChange: any) {
    let places = new google.maps.places.Autocomplete(document.getElementById('address'));
    google.maps.event.addListener(places, 'place_changed', function () {
      let place = places.getPlace();
      let address = place.formatted_address.split(',');
      let latitude = place.geometry.location.lat();
      let longitude = place.geometry.location.lng();
      $("input[name='latitude']").val(latitude);
      $("input[name='longtitude']").val(longitude);
      if (address[1] != 'undefined')
        $("input[name='city']").val(address[1].trim());
      if (address[2] != 'undefined')
        $("input[name='state']").val((address[2]).trim().split(" ")[0]);
      if (address[2] != 'undefined')
        $("input[name='zipCode']").val((address[2]).trim().split(" ")[1]);
      if (address[0] != 'undefined')
        $("input[name='address']").val(address[0].trim());
    });

  }

  /**
    * This method navigates the screen to back
  */
  public goBack(savedDriver: IDealer = null): void {
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
