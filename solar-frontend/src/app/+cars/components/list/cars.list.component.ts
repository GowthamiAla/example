import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ICar, ILoad } from '../../models/car';
//import { ILoad } from '../../../loads/models/load';
import { Load } from '../../models/car.data';
import { IDealer } from '../../../+dealers/models/dealer';
import { Dealer } from '../../../+dealers/models/dealer.data';
import { CarService } from '../../services/cars.service';
import * as log from 'loglevel';
//import { Ng2MessagePopupComponent, Ng2PopupComponent } from 'ng2-popup';
import { FlashMessagesService } from 'angular2-flash-messages';


declare var $;



import { Http, Response, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { endponitConfig } from '../../../../environments/endpoints';

/**
 * This is the root component of cars module.
 */
@Component({
  template: require('./cars.list.component.html'),
  providers: [CarService],
  styles: [`
    .popup-header, .popup-body, .popup-footer {
      padding: 15px;
      text-align: center;
    }
    .popup-header  {  
      font-weight: bold;
      font-size: 18px;
      border-bottom: 1px solid #ccc;
    }
  `]
})
export class CarsListComponent implements OnInit {

  public carsLoadNumberOptions;
  public carsVinNumberOptions;
  public dealerNamesList = [{ value: '', label: '' }];
  public activePageTitle: string;
  public error: string;
  public carDeleteResponse: any;
  public carsList: ICar[];
  public car: ICar;
  public loadsList: ILoad[];

  public dealersList: IDealer[];
  public dealer: Dealer;
  carQueryData: any = { vin: '', dealerCd: '', loadNum: '' };
  isCarSearchQuerySubmitted: boolean;

  public pseudoServer = [];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "vin";
  public sortOrder = "asc";
  public amountOfRows = 0;

  public carHeaders: Headers;
  public carDeleteSuccess;
  public carDeleteFailure;


  // @ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
  message: string;

  constructor(private http: Http, private carService: CarService, private router: Router, private _flashMessagesService: FlashMessagesService) {
    this.carDeleteResponse = '';
    this.isCarSearchQuerySubmitted = false;


    this.carHeaders = new Headers();
    this.carHeaders.append('Content-Type', 'application/json');
    this.carHeaders.set('X-Auth-Token', localStorage.getItem('token'));
  }






  options = {
    dom: "Bfrtip",
    ajax: (data, callback, settings) => {
      this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT + 'getVins', { headers: this.carHeaders })
        .map(this.extractData)
        .catch(error => {
          // In a real world app, we might use a remote logging infrastructure
          // We'd also dig deeper into the error to get a better message
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          console.error(errMsg); // log to console instead

          // this.navigateToLogin( this.errorMessage)
          localStorage.setItem('status', '401')
          // 401 unauthorized response so log user out of client
          window.location.href = '/#/error';
          return Observable.throw(errMsg);
        })
        .subscribe((data) => {
          callback({
            aaData: data,
          })
        })
    },
    columns: [
      { data: 'vin', responsivePriority: 1 }, { data: 'vinDesc', responsivePriority: 2 }, { data: 'loadNum', responsivePriority: 3 }, {
        data: null,
        orderable: false,
        className: "editcenter",
        //  defaultContent: '<a  class="editor_edit">Edit</a>'
        defaultContent: '<a class="editor_edit"> <i class="fa fa-edit"></i></a> / <a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
        responsivePriority: 2
      }
    ],
    rowCallback: (row: Node, data: any | Object, index: number) => {

      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td', row).unbind('click');

      $('a.editor_edit', row).bind('click', () => {
        // self.editUser(data);
        // self.goToUpdateDealerDetials(data)

        self.goToUpdateCarDetials(data);
      });

      $('a.editor_remove', row).bind('click', () => {
        this.carService
          .deleteCar(data)
          .then(response => {
            if (response.status == "SUCCESS") {
              $('td', row).parents('tr').remove();
              // this.carDeleteResponse = response.message

              this.carDeleteSuccess = response.message
              setTimeout(() => {
                this.carDeleteSuccess = '';
              }, 2000);

            } else {
              this.carDeleteFailure = response.message
              setTimeout(() => {
                this.carDeleteFailure = '';
              }, 2000);
            }
          })
          .catch(error => this.error = error);

      });
      return row;
    },
  };


  private extractData(res) {
    let body = res.json();
    if (body) {
      return body.data
    } else {
      return {}
    }
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }



  openPopup(size, car) {

    // this.popup.open(Ng2MessagePopupComponent, {
    //   classNames: size,
    //   message: "Are you sure want to delete ",
    //   buttons: {
    //     OK: () => {
    //       console.info("deleting  car details started");

    //       this.carService
    //         .deleteCar(car)
    //         .then(response => {
    //           if (response.status == "SUCCESS") {
    //             this._flashMessagesService.show(response.message, { cssClass: 'alert-success' })
    //             this.carDeleteResponse = response.message
    //             this.getAllCars();
    //             this.router.navigate(['/cars']);
    //           } else {
    //             this._flashMessagesService.show(response.message, { cssClass: 'alert-danger' })
    //           }
    //         })
    //         .catch(error => this.error = error);
    //       this.popup.close();
    //     },
    //     CANCEL: () => {
    //       this.popup.close();
    //     }
    //   }
    // });
  }
  ngOnInit() {
    this.getAllCars();
    // this.getAllLoadsList();
    this.getAllDealers();
    this.activePageTitle = 'Cars';



    $.ajaxSetup({ headers: { "X-Auth-Token": localStorage.getItem('token') } })
    this.carsLoadNumberOptions = {
      //multiple: true,
      placeholder: "Select Load Number",
      theme: 'classic',
      allowClear: true,
      closeOnSelect: true,
      minimumInputLength: 3,
      ajax: {
        url: endponitConfig.PALS_DRIVERS_ENDPOINT + 'getloadnumbyPrefix',
        dataType: 'json',
        delay: 250,
        data: function (params: any) {
          return {
            "loadnumprefix": params.term
          };
        },
        processResults: function (data: any, params: any) {
          var newdata = data["data"]
          return {
            results:
            newdata.map(function (item) {
              return {
                id: item,
                text: item
              };
            }
            )
          };
        },
        cache: true
      },

    }

    this.carsVinNumberOptions = {
      //multiple: true,
      placeholder: "Select VIN Number",
      theme: 'classic',
      closeOnSelect: true,
      minimumInputLength: 3,
      ajax: {
        url: endponitConfig.PALS_DRIVERS_ENDPOINT + 'getvinsbyPrefix',
        dataType: 'json',
        delay: 250,
        data: function (params: any) {
          return {
            "vinprefix": params.term
          };
        },
        processResults: function (data: any, params: any) {
          var newdata = data["data"]
          return {
            results:
            newdata.map(function (item) {
              return {
                id: item,
                text: item
              };
            }
            )
          };
        },
        cache: true
      },

    }


  }
  /**
      * This method gets all dealers data
    */
  private getAllDealers(): void {
    console.info("Getting  all dealers  started");
    this.carService.getAllDealers()
      .subscribe(dealer => {
        this.dealersList = dealer;
        let dealerNamesList = new Array(this.dealersList.length);

        for (let i = 0; i < this.dealersList.length; i++) {
          dealerNamesList[i] = {
            value: this.dealersList[i].dealerCd + "_" + this.dealersList[i].shipId + "_" + this.dealersList[i].affil,
            label: this.dealersList[i].desc
          };
        }
        this.dealerNamesList = dealerNamesList.slice(0);
      });
  }
  /**
   * This method gets all cars details
   */
  public getAllCars(): void {
    try {
      this.carService.getAllCars().toPromise().then((cars) => {
        setTimeout(() => {
          this.pseudoServer = cars;
          this.load(1);
        }, 2000);
      });
    } catch (error) {
      console.error("error occured in getting all cars details" + error)
    }
  }

  public onPageChange(event) {
    this.rowsOnPage = event.rowsOnPage;
    this.load(event.activePage);
  }

  public load(page: number) {
    page = page - 1;
    if (this.pseudoServer) {
      this.amountOfRows = this.pseudoServer.length;
      let start = page * this.rowsOnPage;
      this.carsList = this.pseudoServer.slice(start, start + this.rowsOnPage);

    }

  }
  /**
  * This method gets car details by Id
  */
  getCarDataByID(id: string) {

    for (let car of this.carsList) {
      if (car.vin == id) {
        this.car = car;
      }
    }
    return this.car;
  }
  /**
    * This method gets All Loads List.
    */
  public getAllLoadsList(): void {
    try {
      this.carService.getAllLoads().toPromise().then(load => this.loadsList = load)
    }
    catch (error) {
      console.error("error occured in getting all loadsList" + error)
    }
    console.info('Getting  all loads complete')
  }
  /**
   *  This method gets all filtered cars details`
   */

  public CarQuerySubmit(): void {
    if (this.carQueryData.vin == '' && (this.carQueryData.dealerCd == undefined || this.carQueryData.dealerCd == '') && this.carQueryData.loadNum == '') {
      this.isCarSearchQuerySubmitted = true;
    }
    else {

      this.isCarSearchQuerySubmitted = false;
      console.info("Getting  filtered cars  started");
      try {
        this.carService.getFilterCarsData(this.carQueryData).toPromise().then((cars) => {
          this.pseudoServer = cars;
          this.load(1);
        });
      } catch (error) {
        console.error("error occured in getting all cars details" + error)
      }
    }
  };
  /**
  *  This method resets all the filtered cars details`
  */
  public CarQueryReset(): void {
    this.carQueryData.vin = '';
    this.carQueryData.dealerCd = '';
    this.carQueryData.loadNum = '';
    this.isCarSearchQuerySubmitted = false;
    this.getAllCars();

  };
  /**
  *  This method adds new Car details
  */
  public goToAddCar() {
    let link = ['/addCar'];
    this.router.navigate(link);

  }

  /**
   *  This method updates car details
   */
  public goToUpdateCarDetials(id) {
    let link = ['/cars/updateCar', id.id];
    this.router.navigate(link);

  }
  /**
 *  This method deletes car details
 */
  public deleteCar(car: ICar, event: any): void {
    event.stopPropagation();
    try {
      this.carService.deleteCar(car)
        .then(response => {
          this.carsList = this.carsList.filter(car => car !== car);

        });

    } catch (error) {
      console.error("error occured in deleting car" + error)
    }
    finally {
      this.getAllCars();
    }

  }

  public delete() {
    this.carDeleteResponse = false;

  }
  /**
   * This method navigates the screen to home Page (dashboard)
   */
  public goToHome() {
    let link = ['/dashboard'];
    this.router.navigate(link);
  }

  /**
    * This Method gets   VIN Number based on select drop down
    */
  public vinNumbersListChanged(e: any): void {
    this.carQueryData.vin = e.value;
  }
  /**
     * This Method gets   loadNumber based on select drop down
     */
  public loadNumbersListChanged(e: any): void {
    this.carQueryData.loadNum = e.value;

  }
}
