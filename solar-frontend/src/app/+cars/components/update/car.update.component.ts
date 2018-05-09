import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Dealer } from '../../../+dealers/models/dealer.data';
import { ICar } from '../../models/car';
import { IDealer } from '../../../+dealers/models/dealer';
import { CarService } from '../../services/cars.service';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

/**
 *This component deals with car update operation
 */

@Component({
  template: require('./car.update.component.html'),
  providers: [CarService, FormBuilder]
})
export class CarUpdateComponent implements OnInit {

  public carUpdateSuccess;
  public carUpdateFailure;

  public activePageTitle: string;
  public carUpdateResponse: string;
  public error: String;
  public carsList: ICar[];
  public dealersList: IDealer[];
  public dealer: Dealer;
  @Input() car: ICar;
  @Output() close = new EventEmitter();
  navigated = true;
  complexForm: FormGroup;
  formValidate: boolean;
  id: AbstractControl;
  vin: AbstractControl;
  vinSeq: AbstractControl;
  yardId: AbstractControl;
  loadSeq: AbstractControl;
  divCd: AbstractControl;
  scac: AbstractControl;
  loadNum: AbstractControl;
  affil: AbstractControl;
  shipId: AbstractControl;
  dealerCd: AbstractControl;
  colorDesc: AbstractControl;
  vinDesc: AbstractControl;
  parkingSpot: AbstractControl;
  lotLocation: AbstractControl;
  constructor(private carService: CarService, private route: ActivatedRoute, private router: Router, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {
    this.formValidate = false;
    this.carUpdateResponse = '';
    this.complexForm = fb.group({
      'loadSeq': [null, Validators.compose([Validators.required])],
      'yardId': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]+')])],
      'lotLocation': [null, Validators.compose([Validators.pattern('[a-z  A-Z]*')])],
      'parkingSpot': [null, Validators.compose([Validators.pattern('[a-zA-Z0-9]+')])],
      'vinDesc': [null, Validators.compose([Validators.pattern('[a-z  A-Z]*')])],
      'colorDesc': [null, Validators.compose([Validators.pattern('[a-z  A-Z]*')])],
      'dealerCd': [null, Validators.compose([Validators.required])],
      'vin': [null, Validators.compose([Validators.required])],
      'loadNum': [null, Validators.compose([Validators.required])],
    })
    this.loadNum = this.complexForm.controls['loadNum'];
    this.yardId = this.complexForm.controls['yardId'];
    this.loadSeq = this.complexForm.controls['loadSeq'];
    this.lotLocation = this.complexForm.controls['lotLocation'];
    this.parkingSpot = this.complexForm.controls['parkingSpot'];
    this.vinDesc = this.complexForm.controls['vinDesc'];
    this.colorDesc = this.complexForm.controls['colorDesc'];
    this.dealerCd = this.complexForm.controls['dealerCd'];
    this.vin = this.complexForm.controls['vin'];
  }
  ngOnInit(): void {
    this.activePageTitle = 'Update Car';
    this.route.params.forEach((params: Params) => {
      console.info("Getting car deails by Id started");
      if (params['id'] !== undefined) {
        let id: string = +params['id'] + "";
        this.navigated = true;
        this.carService.getCarDetailsByID(id).then(car => {
          this.car = car;
          this.onDealersSelected(this.car.dealerCd)
          this.getLoadDealers(this.car.dealerCd, this.car.shipId, this.car.affil)
        });
        console.info("Getting car deails by Id ended");
      } else {
        this.navigated = false;

      }
    });

  }
  public getLoadDealers(dealerCd: any, shipId: any, affil: any): void {
    console.info("Getting all dealers list by dealerCd started");
    try {
      this.carService
        .getDealersbyDealercd(dealerCd, shipId, affil).subscribe(response => {
          this.car.dealerName = response['desc'];
        });
    }
    catch (error) {
      console.error("error occured in getting dealers by dealerCd" + error)
    }

  }
  public onDealersSelected(dealerCd) {
    let dealerAddress = dealerCd + '_' + this.car.shipId + '_' + this.car.affil;
    this.carService.getDealerAddresses(dealerAddress).subscribe(response => {
      this.car.dealerAddress = response;
    }, error => console.error(error),
      () => console.info('Getting dealerAddress completed'));

  }
  /** cars Form submit **/
  submitForm(value: any) {
    if (value.loadSeq != '' && value.yardId != '') {
      console.info("update car form submission started.....");
      value.affil = this.car.affil;
      value.shipId = this.car.shipId;
      value.id = this.car.id;
      value.dealerCd = this.car.dealerCd;
      this.carService.updateCar(value)
        .then(response => {
          if (response.status == "SUCCESS") {
            this.carUpdateResponse = response.message
            this.carUpdateSuccess = response.message;

            setTimeout(() => {
              this.carUpdateSuccess = '';
              this.router.navigate(['/cars']);
            }, 2000);
          } else {
            this.carUpdateFailure = response.message;
            setTimeout(() => {
              this.carUpdateFailure = '';
            }, 3000);

            this._flashMessagesService.show(response.message, { cssClass: 'alert-danger' })
          }
        })
        .catch(error => this.error = error);
    }
    else {
      console.info("update car form submission failure.....");
      this.formValidate = true;
      this.complexForm != this.complexForm;
    }
  }
  /**
    * This method navigates the screen to back
  */
  public goBack(savedDriver: ICar = null): void {
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
