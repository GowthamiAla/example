
import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
//noinspection TypeScriptCheckImport
// import { Ng2MessagePopupComponent, Ng2PopupComponent } from 'ng2-popup';

import { IFuel } from '../../models/fuel';
import { Fuel } from '../../models/fuel.data';
import { FuelService } from '../../services/fuel.service';
import { FlashMessagesService } from 'angular2-flash-messages';

/**
 * This is the root component of Fuel module. It gets all Fuel data
 */

@Component({
    template: require('./fuel.list.component.html'),
    providers: [FuelService],
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
export class FuelListComponent implements OnInit {

    public fuelDeleteResponse: any;
    public activePageTitle: string;
    public fuelList: IFuel[];
    public error: String;
    public fuel: IFuel;
    public pseudoServer = [];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "name";
    public sortOrder = "asc";
    public amountOfRows = 0;

 //   @ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
    message: string;
    constructor(private fuelService: FuelService, private router: Router, private _flashMessagesService: FlashMessagesService) {
        this.fuelDeleteResponse = '';
    }
    ngOnInit() {
        this.activePageTitle = 'Fuel Stations';
        this.getAllFuelStations();
    }
    /**
    * This method gets all fuel details
    */
    public getAllFuelStations(): void {
        console.info("Getting all fuel list started");
        try {
            this.fuelService.getFuel().toPromise().then((fuelStations) => {
                // this.pseudoServer = fuelStations;
                // this.load(1);
                this.fuelList=fuelStations;
            });
        } catch (error) {
            console.error("Getting all fuel list failed ");
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
    //     this.fuelList = this.pseudoServer.slice(start, start + this.rowsOnPage);

    // }

    /**
    * This method a dealer based on ID
    */
    getFuelData(id: any) {
        console.info("Getting dealer by Id started ");
        try {
            for (let fuel of this.fuelList) {
                if (fuel.id == id) {
                    this.fuel = fuel;
                }
            }
            console.info("Getting dealer by Id ended");
            return this.fuel;
        } catch (error) {
            console.error("Getting dealer by Id failed" + error);
        }
    }

    /**
    *  This method adds new fuel details
    */
    public goToAddFuel() {
        let link = ['/fuel/addFuel'];
        this.router.navigate(link);
    }

    /**
     *  This method updates fuel details
     */
    public goToUpdateFuelDetials(fuelId: string) {
        let link = ['/fuel/updateFuelStation', fuelId];
        this.router.navigate(link);
    }



    /**
   *  This method deletes fuel details
   */
    // openPopup(size, fuel) {
    //     //noinspection TypeScriptUnresolvedFunction
    //     this.popup.open(Ng2MessagePopupComponent, {
    //         classNames: size,
    //         message: "Are you sure want to delete ",
    //         buttons: {
    //             OK: () => {
    //                 console.info("deleting  fuel details started");
    //                 //  event.stopPropagation();
    //                 this.fuelService
    //                     .deleteFuel(fuel)
    //                     .then(response => {
    //                         if (response.message == "Success") {
    //                             this._flashMessagesService.show('Fuel Station Deleted Successfully', { cssClass: 'alert-success' })
    //                             this.fuelDeleteResponse = response.message
    //                             this.getAllFuelStations();
    //                         } else {
    //                             this._flashMessagesService.show('Error in Fuel Station Deletion', { cssClass: 'alert-danger' })
    //                         }
    //                     })
    //                     .catch(error => this.error = error);
    //                     this.popup.close();
    //             },
    //             CANCEL: () => {
    //                 //noinspection TypeScriptUnresolvedFunction
    //                 this.popup.close();
    //             }
    //         }
    //     });
    // }

     public delete() {
    this.fuelDeleteResponse = false;

  }

    /**
      * This method navigates the screen to home Page (dashboard)
      */
    public goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }

}
