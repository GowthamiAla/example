import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { DriverService } from '../../services/driver.service';
import { IDriver } from '../../models/driver';

import { ModalDirective } from 'ngx-bootstrap';
import { endponitConfig } from '../../../../environments/endpoints';
import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var $;

/**
 * This is the root component of drivers module. It gets all drivers data
 */

@Component({
  templateUrl: './drivers.list.component.html',
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
  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'firstName';
  public sortOrder = 'asc';
  public driverListView;
  public serviceErrorResponse;
  public serviceErrorData;

  public activePageTitle: string;
  public userlistMessage;

  message: string;
  private driverHeaders: Headers;

  @ViewChild('driverviewPopup') public driverviewPopup: ModalDirective;


  options = {
    dom: 'Bfrtip',
    buttons: [
      {
          text: '<i class="fa fa-refresh"></i> Refresh',
          className: 'btn bg-color-blueLight  txt-color-white btn-sm dataTableCustomButtonMargin',
          action: function (e, dt, node, config) {
              if ($.fn.DataTable.isDataTable('#DataTable table')) {
                  var table = $('#DataTable table').DataTable();
                  table.ajax.reload();
              }
          }
      }
  ],
    ajax: (data, callback, settings) => {
      this.http.get(endponitConfig.DRIVER_API_ENDPOINT + 'getDrivers', { headers: this.driverHeaders })
        .map(this.extractData)
        .catch(error => {
          // In a real world app, we might use a remote logging infrastructure
          // We'd also dig deeper into the error to get a better message
          const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          console.error(errMsg); // log to console instead

          if ( error.status == 404) {
            error=error.json();
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
            return Observable.throw(error);
          } else {
            // this.navigateToLogin( this.errorMessage)
            localStorage.setItem('status', '401')
            // 401 unauthorized response so log user out of client
            window.location.href = '/#/error';
            return Observable.throw(errMsg);
          }
        })
        .subscribe((jsondata) => {
          callback({
            aaData: jsondata,
          })
        })
    },
    columns: [
      { data: 'firstName', responsivePriority: 1 }, { data: 'email', responsivePriority: 4 },
      { data: 'phoneNumber', responsivePriority: 3 }, { data: 'vendor.vendorName', responsivePriority: 5 }, {
        data: null,
        orderable: false,
        className: 'editcenter',
        //  defaultContent: '<a  class="editor_edit">Edit</a>'
        defaultContent:
          '<a class="editor_edit"> <i class="fa fa-edit"></i></a>/ <a class=" editor_view" ><i class="fa fa-eye" (click)="mypopup()"></i></a> / <a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
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
      $('a.editor_view', row).bind('click', () => {
        self.gotoViewDriverDetails(data);
      });

      $('a.editor_remove', row).bind('click', () => {
        if (data.id == Number(localStorage.getItem('userData'))) {
          window.alert('Logged in User can not be deleted')
        } else {
          this.driverService
            .deletedriver(data)
            .then(response => {
              if (response.data != null) {
                if ($.fn.DataTable.isDataTable('#DataTable table')) {
                  var table = $('#DataTable table').DataTable();
                  let info = table.page.info();
                  $('td', row).parents('tr').remove();
                  table.ajax.reload();
                  //    setTimeout(()=>{
                  //     table.page(info.page).draw('page'); 
                  //    },500)
              }
                this.driverDeleteSuccess = response.data
                setTimeout(() => {
                  this.driverDeleteSuccess = '';
                }, 3000);


              } else {
                this.driverDeleteFailure = response.error.message;
                setTimeout(() => {
                  this.driverDeleteFailure = '';
                }, 3000)
              }
            }, error => {
              this.serviceErrorResponse = error.exception;
              this.serviceErrorData = true;
            })
            .catch(error => this.error = error);
        }
      });
      return row;
    },
  };

  public showChildModal(): void {
    this.driverviewPopup.show();
  }

  constructor(private http: Http, private driverService: DriverService, private router: Router) {
    this.activePageTitle = 'Drivers';
    this.driverDeleteResponse = '';


    this.driverHeaders = new Headers();
    this.driverHeaders.append('Content-Type', 'application/json');
    this.driverHeaders.append('Authorization', localStorage.getItem('Authentication'));
  }

  ngOnInit() {
    this.getAllDrivers();

  }



  private extractData(res) {
    const body = res.json();
    if (body) {
      return body.data
    } else {
      return {}
    }
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  /**
   * This method gets all driver details
   */
  public getAllDrivers(): void {
    try {
      this.driverService.getDrivers().toPromise().then((cars) => {
        this.driversList = cars;
      });
    } catch (error) {
      console.error('error occured in getting all drivers  details' + error)
    }
  }
  /**
  * This method gets Driver details by Id
  */
  getDriverDataByID(id: string) {

    for (const driver of this.driversList) {
      if (driver.id === id) {
        this.driver = driver;
      }
    }

  }

  /**
  *  This method adds new driver details
  */
  public goToAddDriver() {
    const link = ['/drivers/addDriver'];
    this.router.navigate(link);

  }

  /**
   *  This method updates driver details
   */
  public goToUpdateDriverDetials(employeeID) {
    const link = ['/drivers/updateDriver', employeeID.id];
    this.router.navigate(link);

  }
  /**
 *  This method deletes driver details
 */


  public deletedriver(driver: IDriver, event: any): void {
    // event.stopPropagation();
    try {
      this.driverService
        .deletedriver(driver).then(response => {
          if (response.error == null) {
            this.router.navigate(['/drivers']);
          }

        });
      this.getAllDrivers();
    } catch (error) {
      console.error('error occured in deleting truck' + error)
    }
    finally {
      this.getAllDrivers();
    }

  }
  public delete() {
    this.driverDeleteResponse = false;

  }

  /**
     * View Driver
     */

  public gotoViewDriverDetails(viewObj: any) {
    this.driverListView = viewObj;
    this.driverviewPopup.show();
  }

  /**
   * This method navigates the screen to home Page (dashboard)
   */
  public goToHome() {
    const link = ['/dashboard'];
    this.router.navigate(link);
  }
}
