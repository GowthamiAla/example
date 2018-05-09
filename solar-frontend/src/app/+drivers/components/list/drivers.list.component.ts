import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { DriverService } from '../../services/driver.service';
import { IDriver } from '../../models/driver';
import { FlashMessagesService } from 'angular2-flash-messages';

import { endponitConfig } from '../../../../environments/endpoints';


import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var $;

/**
 * This is the root component of drivers module. It gets all drivers data
 */

@Component({
  template: require('./drivers.list.component.html'),
  providers: [DriverService],
  encapsulation: ViewEncapsulation.None,
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
export class DriversListComponent implements OnInit {
  public driverDeleteSuccess;
  public driverDeleteFailure;
  public driverDeleteResponse: any;
  public driversList: IDriver[];
  public driver: IDriver;
  public error: string;
  public pseudoServer = [];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "firstName";
  public sortOrder = "asc";

  public activePageTitle: string;
  public userlistMessage;

  message: string;
  private driverHeaders: Headers;

  constructor(private http: Http, private driverService: DriverService, private router: Router, private _flashMessagesService: FlashMessagesService) {
    this.activePageTitle = 'Drivers';
    this.driverDeleteResponse = '';


    this.driverHeaders = new Headers();
    this.driverHeaders.append('Content-Type', 'application/json');
    this.driverHeaders.set('X-Auth-Token', localStorage.getItem('token'));
  }

  ngOnInit() {
    this.getAllDrivers();

  }

  options = {
    dom: "Bfrtip",
    ajax: (data, callback, settings) => {
      this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDrivers', { headers: this.driverHeaders })
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
      { data: 'firstName', responsivePriority: 1 }, { data: 'lastName', responsivePriority: 3 }, { data: 'email', responsivePriority: 2 }, {
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
        self.goToUpdateDriverDetials(data)
      });

      $('a.editor_remove', row).bind('click', () => {
        if (data.id == Number(localStorage.getItem('userData'))) {
          window.alert("Logged in User can not be deleted")
        } else {
          this.driverService
            .deletedriver(data)
            .then(response => {
              if (response.status == "SUCCESS") {
                $('td', row).parents('tr').remove();

                this.driverDeleteSuccess = response.message
                setTimeout(() => {
                  this.driverDeleteSuccess = '';
                }, 3000);
                this.getAllDrivers();
                this.router.navigate(['/drivers']);
              } else {
                this.driverDeleteFailure = response.message;
                setTimeout(() => {
                  this.driverDeleteFailure = '';
                }, 3000)
              }
            })
            .catch(error => this.error = error);
        }
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

  /**
   * This method gets all driver details
   */
  public getAllDrivers(): void {
    console.info("Getting all drivers list started");
    try {
      this.driverService.getDrivers().toPromise().then((cars) => {
        this.driversList = cars;
      });
    } catch (error) {
      console.error("error occured in getting all drivers  details" + error)
    }
  }
  /**
  * This method gets Driver details by Id
  */
  getDriverDataByID(id: string) {

    for (let driver of this.driversList) {
      if (driver.empID == id) {
        this.driver = driver;
      }
    }

  }

  /**
  *  This method adds new driver details
  */
  public goToAddDriver() {
    let link = ['/drivers/addDriver'];
    this.router.navigate(link);

  }

  /**
   *  This method updates driver details
   */
  public goToUpdateDriverDetials(employeeID) {
    let link = ['/drivers/updateDriver', employeeID.empID];
    this.router.navigate(link);

  }
  /**
 *  This method deletes driver details
 */
  openPopup(size, driver) {
    // this.popup.open(Ng2MessagePopupComponent, {
    //   classNames: size,
    //   message: "Are you sure want to delete ",
    //   buttons: {
    //     OK: () => {
    //       console.info("deleting  driver details started");
    //       this.driverService
    //         .deletedriver(driver)
    //         .then(response => {
    //           if (response.status == "SUCCESS") {
    //             this._flashMessagesService.show(response.message, { cssClass: 'alert-success' })
    //             this.driverDeleteResponse = response.message
    //             this.getAllDrivers();
    //             this.router.navigate(['/drivers']);
    //           } else {
    //             this._flashMessagesService.show(response.message, { cssClass: 'alert-danger' })
    //           }
    //         })
    //         .catch(error => this.error = error);
    //          this.popup.close();
    //     },
    //     CANCEL: () => {
    //       this.popup.close();
    //     }
    //   }
    // });
  }
  public delete() {
    this.driverDeleteResponse = false;

  }

  /**
   * This method navigates the screen to home Page (dashboard)
   */
  public goToHome() {
    let link = ['/dashboard'];
    this.router.navigate(link);
  }
}
