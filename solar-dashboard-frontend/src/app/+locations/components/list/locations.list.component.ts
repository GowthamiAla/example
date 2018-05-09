import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { LocationService } from '../../services/location.services';
import { ILocation } from '../../models/location';
import * as $ from 'jquery';
// import { Ng2MessagePopupComponent, Ng2PopupComponent } from 'ng2-popup';


import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { endponitConfig } from '../../../../environments/endpoints';
import { ModalDirective } from 'ngx-bootstrap';
/**
 * This is the root component of dealers module. It gets all dealers data
 */

@Component({
    templateUrl: './locations.list.component.html',
    providers: [LocationService, FormBuilder],
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
export class LocationsListComponent implements OnInit {

    public locationDeleteResponse: any;
    driverQueryData: any = { city: '', state: '' };
    isLocationSearchQuerySubmitted: boolean;
    public activePageTitle: string;
    // @ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
    message: string;
    public locationsList: ILocation[];
    public location: ILocation;
    public error: String;
    public pseudoServer = [];
    public filterQuery = '';
    public rowsOnPage = 10;
    public sortBy = 'locNbr';
    public sortOrder = 'asc';
    public serviceErrorResponse;
    public serviceErrorData;

    public driverHeaders: Headers;
    public locationDeleteSuccess;
    public locationDeleteFailure;
    public locationView;

    @ViewChild('locationviewPopup') public locationviewPopup: ModalDirective;

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
            this.http.get(endponitConfig.LOCATIONS_API_ENDPOINT + 'getAllLocations', { headers: this.driverHeaders })
                .map(this.extractData)
                .catch(error => {
                    // In a real world app, we might use a remote logging infrastructure
                    // We'd also dig deeper into the error to get a better message
                    let errMsg = (error.message) ? error.message :
                        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                    console.error(errMsg); // log to console instead
                    if (error.status == 404) {
                        // error = error.json();
                        //  this.serviceErrorResponse = error.exception;
                        this.serviceErrorData = true;
                        Observable.throw(error.json())
                    } else {
                        // this.navigateToLogin( this.errorMessage)
                        localStorage.setItem('status', '401')
                        // 401 unauthorized response so log user out of client
                        window.location.href = '/#/error';
                        return Observable.throw(errMsg);
                    }
                })
                .subscribe((data) => {
                    callback({
                        aaData: data,
                    })
                })
        },
        columns: [
            { data: 'locNbr', responsivePriority: 1 }, { data: 'locAddrName', responsivePriority: 2 },
            { data: 'city', responsivePriority: 4 }, { data: 'address', responsivePriority: 5 }, {
                data: null,
                orderable: false,
                className: 'editcenter',
                // defaultContent: '<a  class="editor_edit">Edit</a>',
                defaultContent:
                    '<a class="editor_edit"> <i class="fa fa-edit"></i></a> /<a class=" editor_view" ><i class="fa fa-eye" (click)="mypopup()"></i></a>/ <a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
                responsivePriority: 3
            }
        ],
        rowCallback: (row: Node, data: any | Object, index: number) => {

            const self = this;
            // Unbind first in order to avoid any duplicate handler
            // (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', row).unbind('click');

            $('a.editor_edit', row).bind('click', () => {
                // self.editUser(data);
                self.goToUpdateLocationDetials(data)
            });
            $('a.editor_view', row).bind('click', () => {
                self.gotoViewLocationDetails(data);
            });

            $('a.editor_remove', row).bind('click', () => {
                this.locationService
                    .deleteLocation(data)
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
                            this.locationDeleteSuccess = response.data
                            setTimeout(() => {
                                this.locationDeleteSuccess = '';
                            }, 2000);
                        } else {
                            this.locationDeleteFailure = response.error.message
                            setTimeout(() => {
                                this.locationDeleteFailure = '';
                            }, 2000);

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

    public showChildModal(): void {
        this.locationviewPopup.show();
    }

    constructor(private locationService: LocationService, private router: Router, private http: Http) {
        this.activePageTitle = 'Locations';
        this.isLocationSearchQuerySubmitted = false;
        this.locationDeleteResponse = '';

        this.driverHeaders = new Headers();
        this.driverHeaders.append('Content-Type', 'application/json');
        // this.driverHeaders.set('X-Auth-Token', localStorage.getItem('token'));
        this.driverHeaders.append('Authorization', localStorage.getItem('Authentication'));
    }

    openPopup(size, dealer) {

    }




    ngOnInit() {
        // this.getAllDealers();
    }
    /**
     * This method gets all dealers data
   */
    private getAllLocations(): void {
        try {
            this.locationService.getAllLocations().toPromise().then((cars) => {
                // this.pseudoServer = cars;
                // this.load(1);
                this.locationsList = cars;
            });
        } catch (error) {
            console.error('Getting  all dealers  failed');
        }
    }

    // public onPageChange(event) {
    //     this.rowsOnPage = event.rowsOnPage;
    //     this.load(event.activePage);
    // }

    // public load(page: number) {
    //     page = page - 1;
    //     this.amountOfRows = this.pseudoServer.length;
    //     let start = page * this.rowsOnPage;
    //     this.dealersList = this.pseudoServer.slice(start, start + this.rowsOnPage);
    // }

    /**
    * This method a dealer based on ID
    */
    getLocationData(id: string) {
        try {
            for (const location of this.locationsList) {
                if (location.locNbr == id) {
                    this.location = location;
                }
            }
            return this.location;
        } catch (error) {
            console.error('Getting location by Id failed' + error);
        }
    }

    /**
    *  This method updates dealer details
    */
    public goToUpdateLocationDetials(locNbr) {
        const link = ['/locations/updateLocation', locNbr.locNbr];
        this.router.navigate(link);
    }



    /**
  *  This method gets all filtered locations details
  */

    public LocationQuerySubmit(): void {
        if (this.driverQueryData.city == '' && this.driverQueryData.state == '') {
            this.isLocationSearchQuerySubmitted = true;
        } else {
            try {
                this.locationService.getFilterLocationsData(this.driverQueryData.city,
                    this.driverQueryData.state).toPromise().then((locations) => {
                        // this.pseudoServer = dealers;
                        // this.load(1);
                        this.locationsList = locations;
                    });
            } catch (error) {
                console.error('Getting  filtered locations complete in DealerListComponent');
            }
            this.isLocationSearchQuerySubmitted = false;
        }
    };

    public DealerQueryReset(): void {
        this.driverQueryData.city = '';
        this.driverQueryData.state = '';
        this.isLocationSearchQuerySubmitted = false;
        this.getAllLocations();
    };
    public delete() {
        this.locationDeleteResponse = false;

    }

    /*view popup function*/

    public gotoViewLocationDetails(viewObj: any) {
        this.locationView = viewObj;
        this.locationviewPopup.show();
    }
    /**
    * This method navigates the screen to home Page (dashboard)
    */
    public goToHome() {
        const link = ['/dashboard'];
        this.router.navigate(link);
    }
    public goToHomeBAck() {
        const link = ['/dashboard'];
        this.router.navigate(link);
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
}
