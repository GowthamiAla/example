import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Car, Load } from '../../models/car.data';
import { ICar, ILoad } from '../../models/car';
//import { ILoad } from '../../../loads/models/load';
//import { Load } from '../../../loads/models/load.data';
import { IDealer } from '../../../+dealers/models/dealer';
import { Dealer } from '../../../+dealers/models/dealer.data';
import { CarService } from '../../services/cars.service';
import { FlashMessagesService } from 'angular2-flash-messages';

/** 
 * This component adds new car
 */
@Component({
  template: require('./cars.add.component.html'),
  providers: [CarService, FormBuilder]
})
export class CarAddComponent {


  public carAddFailure;
  public carAddSuccess;

  public activePageTitle: string;
  public message: string;
  @Output() close = new EventEmitter();
  navigated = true;
  public loadsList: ILoad[];
  public dealersList: IDealer[];
  public carsList: ICar[];
  public dealer: Dealer;
  public dealerData: any;
  public userAddResponse: string;
  public error: string;
  public dealersListLength: number;
  public loadArrayList = [{ value: '', label: '' }];
  ngOnInit() {
    this.getAllLoadsList();
    this.activePageTitle = 'Add Car';

  }
  private car: ICar = new Car("", "", "", "", "", "", "", "", "", "", "", [], "", "", "", "", "", "");
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

  constructor(private router: Router, private carService: CarService, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {
    this.formValidate = false;
    this.complexForm = fb.group({
      'loadNum': [null, Validators.compose([Validators.required])],
      'loadSeq': [null, Validators.compose([Validators.required])],
      'vin': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]+')])],
      'yardId': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]+')])],
      'lotLocation': [null, Validators.compose([Validators.pattern('[a-z  A-Z]*')])],
      'parkingSpot': [null, Validators.compose([Validators.pattern('[a-zA-Z0-9 ]+')])],
      'vinDesc': [null, Validators.compose([Validators.pattern('[a-z  A-Z]*')])],
      'colorDesc': [null, Validators.compose([Validators.pattern('[a-z  A-Z]*')])],
      'dealerCd': [null, Validators.compose([Validators.required])]

    })
    this.loadNum = this.complexForm.controls['loadNum'];
    this.vin = this.complexForm.controls['vin'];
    this.yardId = this.complexForm.controls['yardId'];
    this.loadSeq = this.complexForm.controls['loadSeq'];
    this.lotLocation = this.complexForm.controls['lotLocation'];
    this.parkingSpot = this.complexForm.controls['parkingSpot'];
    this.vinDesc = this.complexForm.controls['vinDesc'];
    this.colorDesc = this.complexForm.controls['colorDesc'];
    this.dealerCd = this.complexForm.controls['dealerCd'];
  }
  /**
* This method gets all load details
*/

  public getAllLoadsList(): void {
    try {
      this.carService.getAllPartialLoads().toPromise().then(load => {
        this.loadsList = load;
        let loadArrayList = new Array(this.loadsList.length);
        for (let i = 0; i < this.loadsList.length; i++) {
          loadArrayList[i] = {
            value: this.loadsList[i].toString(),
            label: this.loadsList[i].toString()
          };
        }
        this.loadArrayList = loadArrayList.slice(0);
      });
    }
    catch (error) {
      console.error("error occured in getting all loads details" + error)
    }
    console.info('Getting  all loads complete')
  }
  /**
* This method gets dealers details based on loadNum
*/
  public getLoadDealers(loadNum: any): void {
    console.info("Getting all load dealers list started");
    try {
      this.carService
        .getDealers(loadNum).subscribe(dealers => {
          this.dealersList = dealers
          this.dealersListLength = this.dealersList.length;
        });
    }
    catch (error) {
      console.error("error occured in getting load dealer details" + error)
    }

  }
  /**
* This method gets dealer address based on dealerCd
*/
  public onDealersSelected(dealerCd) {
    this.car.dealercds.push(dealerCd);
    this.carService.getDealerAddresses(dealerCd).subscribe(response => {
      this.car.dealerAddress = response;
    }, error => console.error(error),
      () => console.info('Getting dealer address completed'));
  }
  public onloadseqsubmit(loadSeq) {
    if (loadSeq != '') {
      this.carService.validateLoadSequence(loadSeq, this.car).subscribe(response => {
        let data = response;

        if (data.status == 'FAILURE') {
          this.message = "Please give another sequence to selected dealer";
        }
        else {
          this.message = "";
        }

      }, error => console.error(error),
        () => console.info('Getting dealer address completed'));
    }


  }

  /** cars Form submit **/
  submitForm(value: any) {
    if (value.loadNum != '' && value.vin != '' && value.loadSeq != '' && value.yardId != '' && value.dealerCd != '' && this.message == '') {
      console.info("add car form submission started.....");
      value.dealerAddress = this.car.dealerAddress;
      this.carService.addCar(value)
        .then(response => {
          if (response.status == "SUCCESS") {

            this.carAddSuccess = response.message;
            setTimeout(() => {
              this.router.navigate(['/cars']);
              this.carAddSuccess = '';
            }, 2000);
            // this.router.navigate(['/cars']);
          } else {
            this.carAddFailure = response.message;
            setTimeout(() => {
              this.carAddFailure = '';
            }, 2000);
          }
        })
        .catch(error => this.error = error);
    }
    else {
      console.info("add car form submission failure.....");
      this.formValidate = true;
      this.complexForm != this.complexForm;
    }
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
