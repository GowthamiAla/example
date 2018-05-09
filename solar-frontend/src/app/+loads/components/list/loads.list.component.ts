import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LoadsService } from '../../services/load.service';
import { Router } from '@angular/router';
import { ILoad } from '../../models/load';
import 'rxjs/add/operator/toPromise';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import *as $ from 'jquery';
//import { Ng2MessagePopupComponent, Ng2PopupComponent } from 'ng2-popup';
import { FlashMessagesService } from 'angular2-flash-messages';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { DriverService } from '../../../+drivers/services/driver.service';


import { endponitConfig } from '../../../../environments/endpoints';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as moment from 'moment';
/**
 * This component gets all loads data.
 */
@Component({
    template: require('./loads.list.component.html'),
    providers: [LoadsService, FormBuilder, DriverService],
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

    .ng2-popup-overlay{
      display: flex;position: fixed;background-color: rgba(0, 0, 0, 0.2);top: 0px;left: 0px;bottom: 0px;right: 0px;width: 100%;height: 100%;justify-content: center;align-items: center;display: none;
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
    // @ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
    message: string;
    public loadDeleteResponse: any;
    public activePageTitle: string;
    public error: String;
    public allLoads: ILoad[];
    public loads: ILoad;
    public errorMessage: String;
    private startplaceholder: string = 'Select Start Date';
    private endplaceholder: string = 'Select End Date';
    public pseudoServer = [];
    loadStartEnddates: any = { startDate: '', endDate: '' };
    loadQueryData: any = { startDate: '', endDate: '', loadStatus: '', empID: '', vinNumber: '', loadNumber: '', highValue: '0', highPriority: '0' };
    dealerList: any = [{ city: '', contactName: '', dealerName: '', dealerNumber: '', latitude: '', longtitude: '', seq: '', status: '', vinCount: '' }];
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
    //collapse content
    public isCollapsedContent: boolean = false;
    public itemactive: boolean;
    isLoadSearchQuerySubmitted: boolean;
    upDownArrow: any;
    collapseExpand: boolean;
    loadListQueryArray: Array<any> = [];
    public loadNumberList = [{ value: '', label: '' }]
    vinsListQueryArray: Array<any> = [];
    public vinsNumberList = [{ value: '', label: '' }]
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "loadNum";
    public sortOrder = "asc";

    public loadsHeader: Headers;
    public loadDeleteSuccess;
    public loadDeleteFailure;

    constructor(private http: Http, private driverService: DriverService, private loadsService: LoadsService, private router: Router, private _flashMessagesService: FlashMessagesService) {
        this.activePageTitle = 'Loads';
        this.isLoadSearchQuerySubmitted = false;
        this.loadQueryData.highValue = 0;
        this.loadQueryData.highPriority = 0;
        this.loadDeleteResponse = '';


        this.loadsHeader = new Headers();
        this.loadsHeader.append('Content-Type', 'application/json');
        this.loadsHeader.set('X-Auth-Token', localStorage.getItem('token'));


    }



    options = {
        dom: "Bfrtip",
        ajax: (data, callback, settings) => {
            this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT + 'getLoads', { headers: this.loadsHeader })
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
            { data: 'loadNum', responsivePriority: 1 }, { data: 'driverName', responsivePriority: 2 }, { data: 'trkNum', responsivePriority: 3 }, {
                data: "startDate", render: (data, type, row) => {
                    if (data) {
                        data = moment(data).format('DD/MM/YYYY');
                        return data
                    } else {
                        return ''
                    }
                }, responsivePriority: 4
            }



            , {
                data: 'endDate', render: (data, type, row) => {
                    if (data) {
                        data = moment(data).format('DD/MM/YYYY');
                        return data
                    } else {
                        return ''
                    }
                }, responsivePriority: 5
            }, { data: 'loadStatus', responsivePriority: 6 }, {
                data: 'loadStatus',
                orderable: false,
                className: "editcenter",
                //  defaultContent: '<a  class="editor_edit">Edit</a>'
                defaultContent: `<a class=" editor_edit btn btn-warning" type="button" (click)="goToUpdateLoadDetial(load.loadNum)"><i class="fa fa-edit"></i></a>`,
                responsivePriority: 2,
                render: (data, type, row) => {
                    if (data == 5) {
                        return `                       
                        

                        <a class="editor_edit btn btn-warning" type="button" (click)="goToUpdateLoadDetial(load.loadNum)"><i class="fa fa-edit"></i></a>

                        <a class="editor_remove btn btn btn-danger" type="button" (click)="openPopup('small',load)"><i class="fa fa-trash-o"></i></a>
                        
                        <a class="editor_push btn btn btn-success" type="button" (click)="goToCompleteLoad(load)" style="display: inline-block;"><i class="fa fa-sign-out"></i></a>
                        
                        
                        
                        `

                    } else if (data == 0) {
                        return ` 
                        
                        <a class=" editor_edit btn btn-warning" type="button" (click)="goToUpdateLoadDetial(load.loadNum)"><i class="fa fa-edit"></i></a>

                        <a class="editor_remove btn btn btn-danger" type="button" (click)="openPopup('small',load)"><i class="fa fa-trash-o"></i></a>
                        
                        `
                    }
                    else if (data == 4) {
                        return ` 
                         <a class="editor_edit btn btn-warning" type="button" (click)="goToUpdateLoadDetial(load.loadNum)"><i class="fa fa-edit"></i></a>

                        <a class="editor_complete btn btn-info" type="button" (click)="goToUpdateLoadDetial(load.loadNum)"><i class="fa fa-check-square"></i></a>

                        
                        `
                    }
                }
            }
        ],




        rowCallback: (row: Node, data: any | Object, index: number) => {

            const self = this;
            // Unbind first in order to avoid any duplicate handler
            // (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', row).unbind('click');

            $('a.editor_edit', row).bind('click', () => {
                // self.editUser(data);
                self.goToUpdateLoadDetial(data)
            });

            $('a.editor_push', row).bind('click', () => {
                // self.editUser(data);
                self.goToCompleteLoad(data)
            });

            $('a.editor_complete', row).bind('click', () => {
                // self.editUser(data);
                alert("Load Successfully Delivered.....")
            });

            $('a.editor_remove', row).bind('click', () => {
                this.loadsService
                    .deleteLoad(data)
                    .subscribe(response => {
                        if (response.status == "SUCCESS") {
                            $('td', row).parents('tr').remove();

                            this.loadDeleteSuccess = response.message
                            setTimeout(() => {
                                this.loadDeleteSuccess = '';
                            }, 3000);

                            this.getAllLoadsList();
                        } else {
                            this.loadDeleteFailure = response.message;
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


    ngOnInit() {
        this.getAllLoadsList();
        this.getAllDrivers();

        $.ajaxSetup({ headers: { "X-Auth-Token": localStorage.getItem('token') } })
        this.loadNumberOptions = {
            placeholder: "Select Load Number",
            theme: 'classic',
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


        this.vinNumberOptions = {
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
   * This method gets all loads
   */
    public getAllLoadsList(): void {
        try {
            this.loadsService.getAllLoads().toPromise().then((load) => {
                this.allLoads = load;
            });
        }
        catch (error) {
            console.error("error occured in getting all load details" + error)
        }

        console.info('Getting  all loads complete')
    }

    /**
    * This method gets load details based on ID
    */
    public getLoadViewDetails(id: string) {
        console.info("Getting Loads data by Loadnumber Started");
        this.loadsService.getLoadDetailsByLoadNumForLoadPreview(id)
            .subscribe(load => {
                this.loads = load;
                this.dealerList = load.dealerList;
            },
            error => console.error(error),
            () => console.info('Getting Loads data by Loadnumber ended'));
    }

    /**
        * This method displays Load details in Pop-up model
        */
    public menuToggle(a: any) {
        if (this.upDownArrow !== a) {
            this.upDownArrow = a;
            for (let i = 0; i < this.dealerList.length; i++) {
                if (this.dealerList[i].dealerNumber == this.upDownArrow) {
                    this.vinList = this.dealerList[i].vinList;
                }
            }

        } else if (this.upDownArrow) {
            this.upDownArrow = false;
        }

    }
    public Collapse(a: any) {
        if (this.upDownArrow == a) {
            this.collapseExpand = true;
        }
        else {
            this.collapseExpand = false;
        }
    }

    /**
     * This method deletes a load
     */
    openPopup(size, load) {
        // this.popup.open(Ng2MessagePopupComponent, {
        //     classNames: size,
        //     message: "Are you sure want to delete ",
        //     buttons: {
        //         OK: () => {
        //             console.info("deleting  load details started");
        //             this.loadsService
        //                 .deleteLoad(load)
        //                 .then(response => {
        //                     if (response.status == "SUCCESS") {
        //                         this._flashMessagesService.show(response.message, { cssClass: 'alert-success' })
        //                         this.loadDeleteResponse = response.message
        //                         this.getAllLoadsList();
        //                     } else {
        //                         this._flashMessagesService.show(response.message, { cssClass: 'alert-danger' })
        //                     }
        //                 })
        //                 .catch(error => this.error = error);
        //             this.popup.close();
        //         },
        //         CANCEL: () => {
        //             this.popup.close();
        //         }
        //     }
        // });
    }

    /**
  *  This method gets all filtered loads details`
  */

    public LoadQuerySubmit(): void {
        let loadQueryDataEndDate;
        let loadQueryDataStartDate;
        if (this.loadStartEnddates.startDate != '') {
            let st_year = this.loadStartEnddates.startDate.date.year;
            let st_month = this.loadStartEnddates.startDate.date.month;
            let st_day = this.loadStartEnddates.startDate.date.day;
            loadQueryDataStartDate = st_year + '-' + st_month + '-' + st_day;

        } else loadQueryDataStartDate = ''

        if (this.loadStartEnddates.endDate != '') {
            let end_year = this.loadStartEnddates.endDate.date.year;
            let end_month = this.loadStartEnddates.endDate.date.month;
            let end_day = this.loadStartEnddates.endDate.date.day;
            loadQueryDataEndDate = end_year + '-' + end_month + '-' + end_day;
        }
        else
            loadQueryDataEndDate = '';
        if ((loadQueryDataStartDate == null || loadQueryDataStartDate == '') && (loadQueryDataEndDate == null || loadQueryDataEndDate == '') && this.loadQueryData.loadStatus == '' && this.loadQueryData.empID == '' && this.loadQueryData.vinNumber == '' && this.loadQueryData.loadNumber == '' &&
            this.loadQueryData.highValue == 0 && this.loadQueryData.highPriority == 0 && (this.loadQueryData.empID == undefined || this.loadQueryData.empID == '')) {

            this.isLoadSearchQuerySubmitted = true;
        } else {

            this.isLoadSearchQuerySubmitted = false;

            if (new Date(loadQueryDataStartDate) > new Date(loadQueryDataEndDate) || (loadQueryDataStartDate != '' && (loadQueryDataEndDate == '' || loadQueryDataEndDate == null))) {
                this.errorMessage = "End date should be greater than Start date";
            }
            else {
                this.errorMessage = "";
                console.info("Getting  filtered loads  started");
                try {
                    this.loadQueryData.startDate = loadQueryDataStartDate;
                    this.loadQueryData.endDate = loadQueryDataEndDate;
                    this.loadsService.getFilterLoadsData(this.loadQueryData).toPromise().then((loads) => {
                        this.allLoads = loads;
                    });
                }
                catch (error) {
                    console.error("error occured in Getting  filtered loads complete in LoadsListComponent" + error)
                }
            }
        }
    };

    public LoadQueryReset(): void {
        this.loadStartEnddates.startDate = '';
        this.loadStartEnddates.endDate = '';
        this.loadQueryData.loadStatus = '';
        this.loadQueryData.empID = '';
        this.loadQueryData.vinNumber = '';
        this.loadQueryData.loadNumber = '';
        this.loadQueryData.highValue = 0;
        this.loadQueryData.highPriority = 0;
        this.isLoadSearchQuerySubmitted = false;
        this.errorMessage = "";
        this.getAllLoadsList();

    };
    public delete() {
        this.loadDeleteResponse = false;

    }
    public goToUpdateLoadDetial(loadNum: any) {
        let link = ['/loads/updateLoad', loadNum.loadNum];
        this.router.navigate(link);

    }

    public goToAddLoad() {
        let link = ['/loads/addLoad'];
        this.router.navigate(link);
    }


    /**
     * This Method gets   VIN Number based on select drop down
     */
    public vinNumberChanged(e: any): void {
        this.loadQueryData.vinNumber = e.value;

    }
    /**
       * This Method gets   loadNumber based on select drop down
       */
    public loadNumberChanged(e: any): void {
        this.loadQueryData.loadNumber = e.value;
    }

    public goToCompleteLoad(load) {
        this.loadsService
            .completeLoadCreation(load)
            .then(response => {
                if (response.status == "Success") {
                    // this._flashMessagesService.show(response.message, { cssClass: 'alert-success' })
                    this.loadDeleteSuccess = response.message;
                    setTimeout(() => {
                        this.loadDeleteSuccess = ''
                    }, 3000);
                    this.getAllLoadsList();
                } else {
                    this.loadDeleteFailure = response.message;
                    setTimeout(() => {
                        this.loadDeleteFailure = ''
                    }, 3000);
                }
            })
            .catch(error => this.error = error);
    }

    /**
   * This method gets all driver details
   */
    private getAllDrivers(): void {
        this.driverService.getDrivers().subscribe(drivers => {
            this.driverListArray = drivers;
            let driverNamesList = new Array(this.driverListArray.length);
            console.info(drivers)
            for (let i = 0; i < this.driverListArray.length; i++) {
                driverNamesList[i] = {
                    value: this.driverListArray[i].empID,
                    label: this.driverListArray[i].firstName + " " + this.driverListArray[i].lastName
                };
            }
            this.driverNamesList = driverNamesList.slice(0);
            console.log(this.driverNamesList);
        });

    }

}
