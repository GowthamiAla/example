import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { DealerService } from '../../services/dealer.services';
import { IDealer } from '../../models/dealer';
import *as $ from 'jquery';
//import { Ng2MessagePopupComponent, Ng2PopupComponent } from 'ng2-popup';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { endponitConfig } from '../../../../environments/endpoints';

/**
 * This is the root component of dealers module. It gets all dealers data
 */

@Component({
    template: require('./dealers.list.component.html'),
    providers: [DealerService, FormBuilder],
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
export class DealersListComponent implements OnInit {

    public dealerDeleteResponse: any;
    driverQueryData: any = { dealerCity: '', dealerState: '' };
    isDealreSearchQuerySubmitted: boolean;
    public activePageTitle: string;
    //@ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
    message: string;
    public dealersList: IDealer[];
    public dealer: IDealer;
    public error: String;
    public pseudoServer = [];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "dealerCd";
    public sortOrder = "asc";

    public driverHeaders: Headers;
    public dealerDeleteSuccess;
    public dealerDeleteFailure;
    constructor(private dealerService: DealerService, private router: Router, private _flashMessagesService: FlashMessagesService, private http: Http) {
        this.activePageTitle = 'Dealers';
        this.isDealreSearchQuerySubmitted = false;
        this.dealerDeleteResponse = '';

        this.driverHeaders = new Headers();
        this.driverHeaders.append('Content-Type', 'application/json');
        this.driverHeaders.set('X-Auth-Token', localStorage.getItem('token'));
    }

    openPopup(size, dealer) {
      
    }


    options = {
        dom: "Bfrtip",
        ajax: (data, callback, settings) => {
            this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDealers', { headers: this.driverHeaders })
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
            { data: 'dealerCd', responsivePriority: 1 }, { data: 'desc', responsivePriority: 2 }, { data: 'city', responsivePriority: 3 }, { data: 'state', responsivePriority: 4 }, { data: 'contact', responsivePriority: 5 }, {
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
                self.goToUpdateDealerDetials(data)
            });

            $('a.editor_remove', row).bind('click', () => {  
                    this.dealerService
                        .deleteDealer(data)
                        .then(response => {
                            if (response.status == "SUCCESS") {
                                $('td', row).parents('tr').remove();
                                this.dealerDeleteSuccess = response.message
                                setTimeout(() => {
                                    this.dealerDeleteSuccess = '';
                                    //  this.router.navigate(['/dealers']);
                                }, 2000);
                               // this.getAllDealers();
                              
                            } else {
                                this.dealerDeleteFailure = response.message
                                setTimeout(() => {
                                    this.dealerDeleteFailure = '';
                                }, 2000);
                                
                            }
                        })
                        .catch(error => this.error = error);
               
            });
            return row;
        },
    };

    ngOnInit() {
        //this.getAllDealers();
    }
    /**
     * This method gets all dealers data
   */
    private getAllDealers(): void {
        console.info("Getting  all dealers  started");
        try {
            this.dealerService.getAllDealers().toPromise().then((cars) => {
                // this.pseudoServer = cars;
                // this.load(1);
                this.dealersList = cars;
            });
        } catch (error) {
            console.error("Getting  all dealers  failed");
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
    getDealerData(id: string) {
        console.info("Getting dealer by Id started ");
        try {
            for (let dealer of this.dealersList) {
                if (dealer.dealerCd == id) {
                    this.dealer = dealer;
                }
            }
            return this.dealer;
        } catch (error) {
            console.error("Getting dealer by Id failed" + error);
        }
    }

    /**
    *  This method updates dealer details
    */
    public goToUpdateDealerDetials(dealerCd) {
        let link = ['/dealers/updateDealer', dealerCd.dealerCd];
        this.router.navigate(link);
    }

 

    /**
  *  This method gets all filtered dealers details
  */

    public DealerQuerySubmit(): void {
        if (this.driverQueryData.dealerCity == '' && this.driverQueryData.dealerState == '') {
            this.isDealreSearchQuerySubmitted = true;
        } else {
            console.info("Getting  filtered dealers  started");
            try {
                this.dealerService.getFilterDealersData(this.driverQueryData.dealerCity, this.driverQueryData.dealerState).toPromise().then((dealers) => {
                    // this.pseudoServer = dealers;
                    // this.load(1);
                    this.dealersList = dealers;
                });
            } catch (error) {
                console.error("Getting  filtered dealers complete in DealerListComponent");
            }
            this.isDealreSearchQuerySubmitted = false;
        }
    };

    public DealerQueryReset(): void {
        this.driverQueryData.dealerCity = '';
        this.driverQueryData.dealerState = '';
        this.isDealreSearchQuerySubmitted = false;
        this.getAllDealers();
    };
    public delete() {
        this.dealerDeleteResponse = false;

    }
    /**
    * This method navigates the screen to home Page (dashboard)
    */
    public goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }
    public goToHomeBAck() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }

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
}
