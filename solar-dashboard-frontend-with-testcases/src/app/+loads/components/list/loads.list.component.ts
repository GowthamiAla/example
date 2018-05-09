import { Component, Type, OnInit, ViewEncapsulation, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { LoadsService } from '../../services/load.service';
import { Router } from '@angular/router';
import { ILoad } from '../../models/load';

import 'rxjs/add/operator/toPromise';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import * as $ from 'jquery';
// import { Ng2MessagePopupComponent, Ng2PopupComponent } from 'ng2-popup';

import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { DriverService } from '../../../+drivers/services/driver.service';
import { ModalDirective } from 'ngx-bootstrap';

import { endponitConfig } from '../../../../environments/endpoints';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as moment from 'moment';
/**
 * This component gets all loads data.
 */
@Component({
    templateUrl: './loads.list.component.html',
    providers: [LoadsService, FormBuilder, DriverService],
    encapsulation: ViewEncapsulation.None,
    styles: [`
    .popup-header,
    .popup-body,
    .popup-footer {
        padding: 15px;
        text-align: center;
    }

    .popup-header {
        font-weight: bold;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
    }

    .ng2-popup-overlay {
        display: flex;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.2);
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        display: none;
    }
  `]
})

export class LoadsListComponent {
    public loadNumberOptions;
    public vinNumberOptions;
    public driverNamesList = [{ value: '', label: '' }];
    driverListArray: Array<any> = [];
    private model: Object = { date: { year: 2018, month: 10, day: 9 } };
    public loadnumprefix = '';
    public loadListView;
    // @ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
    message: string;
    public loadDeleteResponse: any;
    public activePageTitle: string;
    public error: String;
    public allLoads: ILoad[];
    public loads: ILoad;
    public errorMessage: String;
    private startplaceholder = 'Select Start Date';
    private endplaceholder = 'Select End Date';
    public serviceErrorResponse;
    public serviceErrorData;
    public pseudoServer = [];
    loadStartEnddates: any = { startDate: '', endDate: '' };
    loadQueryData: any = {
        startDate: '', endDate: '', loadStatus: '', empID: '', vinNumber: '',
        loadNumber: '', highValue: '0', highPriority: '0'
    };
    dealerList: any = [{
        city: '', contactName: '', dealerName: '', dealerNumber: '',
        latitude: '', longtitude: '', seq: '', status: '', vinCount: ''
    }];
    vinList: any = [{
        id: '', vin: '', vinSeq: '', yardId: '', loadSeq: '', divCd: '', scac: '', loadNum: '', affil: '',
        shipId: '', dealerCd: '', colorDesc: '', vinDesc: '',
        lotLocation: '', parkingSpot: ''
    }]
    private myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'dd-mm-yyyy',
        showTodayBtn: false,
        showClearDateBtn: false,
        editableDateField: false,
        height: '30px',
        selectionTxtFontSize: '14px',
        indicateInvalidDate: true,
    };
    // collapse content
    public isCollapsedContent = false;
    public itemactive: boolean;
    isLoadSearchQuerySubmitted: boolean;
    upDownArrow: any;
    collapseExpand: boolean;
    loadListQueryArray: Array<any> = [];
    public loadNumberList = [{ value: '', label: '' }]
    vinsListQueryArray: Array<any> = [];
    public vinsNumberList = [{ value: '', label: '' }]
    public filterQuery = '';
    public rowsOnPage = 10;
    public sortBy = 'loadNum';
    public sortOrder = 'asc';

    public loadsHeader: Headers;
    public loadDeleteSuccess;
    public loadDeleteFailure;





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
            this.http.get(endponitConfig.LOAD_API_ENDPOINT + 'getAllLoadAppointments', { headers: this.loadsHeader })
                .map(this.extractData)
                .catch(error => {
                    // In a real world app, we might use a remote logging infrastructure
                    // We'd also dig deeper into the error to get a better message
                    const errMsg = (error.message) ? error.message :
                        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                    console.error(errMsg); // log to console instead
                    if (error.status == 404) {
                        error = error.json();
                        this.serviceErrorResponse = error.exception;
                        this.serviceErrorData = true;
                        return Observable.throw(error)
                    } else {
                        // this.navigateToLogin( this.errorMessage)
                        localStorage.setItem('status', '401')
                        // 401 unauthorized response so log user out of client
                        window.location.href = '/#/error';
                        return Observable.throw(errMsg);
                    }
                })
                .subscribe((dataa) => {
                    callback({
                        aaData: dataa,
                    })
                })
        },


        columns: [
            {
                data: 'apptNbr',
                responsivePriority: 1
            },
            {
                data: 'destLocNbr.locAddrName',
                responsivePriority: 2
            },
            {
                data: 'driver.firstName',
                responsivePriority: 3
            },

            // {
            //     data: "scheduledArrivalDate",
            //     render: (data, type, row) => {
            //         if (data) {
            //             data = moment(data).format('DD/MM/YYYY');
            //             return data
            //         } else {
            //             return ''
            //         }
            //     },
            //     responsivePriority: 3
            // },

            {
                data: 'vndNbr.vendorName',
                responsivePriority: 5
            },
            {
                data: 'apptStatNbr.status',
                responsivePriority: 6
            },
            {
                data: 'apptStatNbr',
                className: 'editcenter',
                responsivePriority: 2,
                orderable: false,
                render: (data, type, row) => {

                    if (data.id != 1) {
                        return `<a class=" editor_view" ><i class="fa fa-eye" (click)="mypopup()"></i></a>`
                    } else {
                        return `<a class=" editor_edit "  (click)="goToUpdateLoadDetial(load.loadNum)"><i class="fa fa-edit"></i>/</a>
                                <a class=" editor_view" ><i class="fa fa-eye" (click)="mypopup()"></i></a>
                                <a class=" editor_remove" >/<i class="fa fa-trash-o"></i></a>
                                <a class=" load_push" >/<i class="fa fa-arrow-right"></i></a>`
                    }
                }
            }
        ],


        rowCallback: (row: Node, data: any | Object, index: number) => {

            const self = this;
            $('td', row).unbind('click');

            $('a.editor_edit', row).bind('click', () => {
                // self.editUser(data);
                self.goToUpdateLoadDetial(data)
            });

            $('a.editor_view', row).bind('click', () => {
                self.gotoViewLoadDetails(data);
            });

            $('a.editor_complete', row).bind('click', () => {
                // self.editUser(data);
                // alert('Load Successfully Delivered.....')
            });

            $('a.load_push', row).bind('click', () => {
                // load push status code is 2
                this.loadsService.updateLoadStatus(data.apptNbr, 2).then(response => {
                    if (response != null) {
                        $('a.load_push', row).hide();
                        $('a.editor_edit', row).hide();
                        $('a.editor_remove', row).hide();
                        $('td:eq(4)', row).text('Load Assigned');
                        this.loadDeleteSuccess = 'Load details pushed successfully'
                        setTimeout(() => {
                            this.loadDeleteSuccess = '';
                        }, 1000);
                    } else {
                        this.loadDeleteFailure = response.error.message;
                    }

                }, error => {
                    this.serviceErrorResponse = error.exception;
                    this.serviceErrorData = true;
                })
            });

            $('a.editor_remove', row).bind('click', () => {
                this.loadsService
                    .deleteLoad(data)
                    .subscribe(response => {
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
                            this.loadDeleteSuccess = 'Load deleted successfully'
                            setTimeout(() => {
                                this.loadDeleteSuccess = '';
                            }, 1000);
                            //  this.getAllLoadsList();
                        } else {
                            // this.loadDeleteFailure = response.error.message;
                            this.loadDeleteFailure = response.error.message
                            setTimeout(() => {
                                this.loadDeleteFailure = '';
                            }, 3000)
                        }
                    },
                    error => { this.error = error })
            });
            return row;
        },
    };

    @ViewChild('loadviewPopup') public loadviewPopup: ModalDirective;
    public showChildModal(): void {
        this.loadviewPopup.show();
    }

    constructor(private http: Http, private cdr: ChangeDetectorRef, private driverService: DriverService,
        private loadsService: LoadsService, private router: Router, ) {
        this.activePageTitle = 'Loads';
        this.isLoadSearchQuerySubmitted = false;
        this.loadQueryData.highValue = 0;
        this.loadQueryData.highPriority = 0;
        this.loadDeleteResponse = '';


        this.loadsHeader = new Headers();
        this.loadsHeader.append('Content-Type', 'application/json');
        this.loadsHeader.append('Authorization', localStorage.getItem('Authentication'));


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
        this.getAllLoadsList();
        this.getAllDrivers();
    }

    /**
   * This method gets all loads
   */
    public getAllLoadsList(): void {
        try {
            this.loadsService.getAllLoads().toPromise().then((load) => {
                this.allLoads = load;
            });
        } catch (error) {
            console.error('error occured in getting all load details' + error)
        }
    }

    /**
     * View Load
     */

    public gotoViewLoadDetails(viewObj: any) {
        this.loadListView = viewObj;
        this.loadviewPopup.show();
    }

    /**
     * Update Load
     */
    public goToUpdateLoadDetial(loadNum: any) {
        const link = ['/loads/updateLoad', loadNum.apptNbr];
        this.router.navigate(link);
    }

    /**
     * back to load page
     */
    public goToAddLoad() {
        const link = ['/loads/addLoad'];
        this.router.navigate(link);
    }

    /**
   * This method gets all driver details
   */
    private getAllDrivers(): void {
        this.driverService.getDrivers().subscribe(drivers => {
            this.driverListArray = drivers;
            const driverNamesList = new Array(this.driverListArray.length);
            for (let i = 0; i < this.driverListArray.length; i++) {
                driverNamesList[i] = {
                    value: this.driverListArray[i].empID,
                    label: this.driverListArray[i].firstName + ' ' + this.driverListArray[i].lastName
                };
            }
            this.driverNamesList = driverNamesList.slice(0);
        });

    }

}
