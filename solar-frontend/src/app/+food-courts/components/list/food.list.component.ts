
import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
//noinspection TypeScriptCheckImport
// import { Ng2MessagePopupComponent, Ng2PopupComponent } from 'ng2-popup';
import { IFood } from '../../models/food';
import { Food } from '../../models/food.data';
import { FoodService } from '../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';

/**
 * This is the root component of Food module. It gets all Food data
 */

@Component({
    template: require('./food.list.component.html'),
    providers: [FoodService],
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
export class FoodListComponent implements OnInit {

    public foodDeleteResponse: any;
    public activePageTitle: string;
    public error: string;
    public foodList: IFood[];
    public food: IFood;
    public pseudoServer = [];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "name";
    public sortOrder = "asc";
    public currentPage : number;

//@ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
    message: string;
    constructor(private foodService: FoodService, private router: Router, private _flashMessagesService: FlashMessagesService) {
        this.foodDeleteResponse = '';
    }

    ngOnInit() {
        this.activePageTitle = 'FoodCourts';
        this.getAllFoodCourts();
    }


    /**
    * This method gets all food details
    */
    public getAllFoodCourts(): void {

        console.info("Getting all food list started");
        try {
            this.foodService.getFood().toPromise().then((foodCourts) => {
                // this.pseudoServer = foodCourts;
                // this.load(1);
                this.foodList=foodCourts;
            });
        } catch (error) {
            console.error("Getting all food list started failed " + error);
        }
    }

    public getAllFoodCourtsAfterDelete(): void {

        console.info("Getting all food list started");
        try {
            this.foodService.getFood().toPromise().then((foodCourts) => {
                // this.pseudoServer = foodCourts;
                // this.load(this.currentPage);
                this.foodList=foodCourts;

            });
        } catch (error) {
            console.error("Getting all food list started failed " + error);
        }
    }

    // public onPageChange(event) {
    //     this.rowsOnPage = event.rowsOnPage;
    //     this.load(event.activePage);
    // }

    // public load(page: number) {
    //     this.currentPage = page;
    //     page = page - 1;
    //     this.amountOfRows = this.pseudoServer.length;
    //     let start = page * this.rowsOnPage;
    //     this.foodList = this.pseudoServer.slice(start, start + this.rowsOnPage);

    // }

    /**
    * This method a dealer based on ID
    */
    getFoodData(id: any) {
        console.info("Getting food by Id started ");
        try {
            for (let food of this.foodList) {
                if (food.id == id) {
                    this.food = food;
                }
            }
            return this.food;
        }
        catch (error) {
            console.error("Getting food by Id failed " + error);
        }
    }

    /**
    *  This method adds new food details
    */
    public goToAddFood() {
        let link = ['/food/addFood'];
        this.router.navigate(link);
    }

    /**
     *  This method updates food details
     */
    public goToUpdateFoodDetials(foodId: string) {
        let link = ['/food/updateFoodCourt', foodId];
        this.router.navigate(link);
    }

    /**
   *  This method deletes food details
   */
    // openPopup(size, food) {
    //     this.popup.open(Ng2MessagePopupComponent, {
    //         classNames: size,
    //         message: "Are you sure want to delete ",
    //         buttons: {
    //             OK: () => {
    //                 console.info("deleting  food details started");

    //                 this.foodService
    //                     .deleteFood(food)
    //                     .then(response => {
    //                         if (response.message == "Success") {
    //                             this._flashMessagesService.show('Food Court Deleted Successfully', { cssClass: 'alert-success' })
    //                             this.foodDeleteResponse = response.message
    //                             this.getAllFoodCourts();
    //                         } else {
    //                             this._flashMessagesService.show('Error in Food Court Creation', { cssClass: 'alert-danger' })
    //                         }
    //                     })
    //                     .catch(error => this.error = error);
    //                      this.popup.close();
    //             },
    //             CANCEL: () => {
    //                 this.popup.close();
    //             }
    //         }
    //     });
    // }

 public delete() {
    this.foodDeleteResponse = false;

  }
    /**
      * This method navigates the screen to home Page (dashboard)
      */
    public goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }

}
