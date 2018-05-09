import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IVendor } from '../../models/Vendor';
import { VendorService } from '../../services/vendors.service';
import * as log from 'loglevel';
import { ModalDirective } from 'ngx-bootstrap';


import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { endponitConfig } from '../../../../environments/endpoints';

declare var $;

/**
 * This is the root component of vendors module.
 */
@Component({
  templateUrl: './vendors.list.component.html',
  providers: [VendorService],
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
export class VendorsListComponent implements OnInit {

  public activePageTitle: string;
  public error: string;
  public vendorDeleteResponse: any;
  public vendorsList: IVendor[];
  public vendor: IVendor;
  public vendorListView;

  vendorQueryData: any = { vendorNbr: '', vendorName: '' };
  isVendorSearchQuerySubmitted: boolean;

  public pseudoServer = [];
  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'vendorNbr';
  public sortOrder = 'asc';
  public amountOfRows = 0;
  public serviceErrorResponse;
  public serviceErrorData;

  public vendorHeaders: Headers;
  public vendorDeleteSuccess;
  public vendorDeleteFailure;

  // @ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
  message: string;

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
      this.http.get(endponitConfig.VENDORS_API_ENDPOINT + 'getVendors', { headers: this.vendorHeaders })
        .map(this.extractData)
        .catch(error => {
          // In a real world app, we might use a remote logging infrastructure
          // We'd also dig deeper into the error to get a better message
          const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          console.error(errMsg); // log to console instead
          // this.navigateToLogin( this.errorMessage)
          if ( error.status == 404) {
            error = error.json();
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
            Observable.throw(error)
          }
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
      {
        data:
          'vendorNbr', responsivePriority: 1
      }, { data: 'vendorName', responsivePriority: 2 }, { data: 'phoneNumber', responsivePriority: 3 }, {
        data: null,
        orderable: false,
        className: 'editcenter',
        //  defaultContent: '<a  class="editor_edit">Edit</a>'
        defaultContent:
          '<a class="editor_edit"> <i class="fa fa-edit"></i></a> /<a class=" editor_view" ><i class="fa fa-eye" (click)="mypopup()"></i></a> / <a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
        responsivePriority: 2
      }
    ],
    rowCallback: (row: Node, data: any | Object, index: number) => {

      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td', row).unbind('click');

      $('a.editor_edit', row).bind('click', () => {

        self.goToUpdateVendorDetials(data);
      });

      $('a.editor_view', row).bind('click', () => {
        self.gotoViewVendorDetails(data);
      });

      $('a.editor_remove', row).bind('click', () => {
        this.vendorService
          .deleteVendor(data)
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
              // this.vendorDeleteResponse = response.message
              this.vendorDeleteSuccess = response.data
              setTimeout(() => {
                this.vendorDeleteSuccess = '';
              }, 2000);

            } else {
              this.vendorDeleteFailure = response.error.message
              setTimeout(() => {
                this.vendorDeleteFailure = '';
              }, 3000);
            }
          }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
          })
          .catch(error => this.error = error);

      });
      return row;
    },
  };


  @ViewChild('vendorviewPopup') public vendorviewPopup: ModalDirective;
  public showChildModal(): void {
    this.vendorviewPopup.show();
  }

  constructor(private http: Http, private vendorService: VendorService, private router: Router) {
    this.vendorDeleteResponse = '';
    this.isVendorSearchQuerySubmitted = false;

    this.vendorHeaders = new Headers();
    this.vendorHeaders.append('Content-Type', 'application/json');
    this.vendorHeaders.append('Authorization', localStorage.getItem('Authentication'));
    // this.vendorHeaders.set('X-Auth-Token', localStorage.getItem('token'));
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

  ngOnInit() {
    this.getAllVendors();
    this.activePageTitle = 'Vendors';

  }

  /**
   * This method gets all vendors details
   */
  public getAllVendors() {
    try {
      this.vendorService.getAllvendors().toPromise().then((vendors) => {
        setTimeout(() => {
          this.pseudoServer = vendors;
          this.load(1);
        }, 2000);
      });
    } catch (error) {
      console.error('error occured in getting all vendors details' + error)
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
      const start = page * this.rowsOnPage;
      this.vendorsList = this.pseudoServer.slice(start, start + this.rowsOnPage);

    }

  }
  /**
  * This method gets vendor details by vendor number
  */
  getvendorDataByNumber(id: string) {

    for (const vendor of this.vendorsList) {
      if (vendor.vendorNbr == id) {
        this.vendor = vendor;
      }
    }
    return this.vendor;
  }

  /**
  *  This method resets all the filtered vendors details`
  */
  public VendorQueryReset(): void {
    this.vendorQueryData.vendorNbr = '';
    this.vendorQueryData.vendorName = '';
    this.isVendorSearchQuerySubmitted = false;
    this.getAllVendors();

  };
  /**
  *  This method adds new vendor details
  */
  public goToAddVendor() {
    const link = ['/addVendor'];
    this.router.navigate(link);

  }

  /**
   *  This method updates vendor details
   */
  public goToUpdateVendorDetials(id) {
    const link = ['/vendors/updateVendor', id.vendorNbr];
    this.router.navigate(link);

  }
  /**
 *  This method deletes vendor details
 */
  public deletevendor(vendor: IVendor, event: any): void {
    event.stopPropagation();
    try {
      this.vendorService.deleteVendor(vendor)
        .then(response => {
          this.vendorsList = this.vendorsList.filter(vendors => vendors !== vendor);
        });
      this.getAllVendors();
    } catch (error) {
      console.error('error occured in deleting vendor' + error)
    }
    finally {
      this.getAllVendors();
    }

  }

  public delete() {
    this.vendorDeleteResponse = false;
  }

  /**
     * View Vendor
     */

  public gotoViewVendorDetails(viewObj: any) {
    this.vendorListView = viewObj;
    this.vendorviewPopup.show();
  }
  /**
   * This method navigates the screen to home Page (dashboard)
   */
  public goToHome() {
    const link = ['/dashboard'];
    this.router.navigate(link);
  }

  /**
    * This Method gets vendor Number based on select drop down
    */
  public vendorNumbersListChanged(e: any): void {
    this.vendorQueryData.vendor = e.value;
  }

}
