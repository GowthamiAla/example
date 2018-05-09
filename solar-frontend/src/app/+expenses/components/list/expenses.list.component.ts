
import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { IExpenses } from '../../models/expenses';
import { Expenses } from '../../models/expenses.data';
import { ExpensesService } from '../../services/expenses.service';
import { IDriver } from '../../models/driver';
import { Driver } from '../../models/driver.data';

import { endponitConfig } from '../../../../environments/endpoints';




/**
 * This is the root component of expense module. It gets all expense data
 */

@Component({
  template: require('./expenses.list.component.html'),
  providers: [ExpensesService],
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
export class ExpensesListComponent implements OnInit {
  public expenseslist: IExpenses[];
  public expense: Expenses;
  public driversList: IDriver[];
  public isnewvalue: boolean;
  public pseudoServer = [];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "driverName";
  public sortOrder = "asc";
  public amountOfRows = 0;
  public activePageTitle: string;
  public driverNamesList = [{ value: '', label: '' }];
  driverListArray: Array<any> = [];
  private driver: IDriver = new Driver("", new Date(), "", "", "", "", "", "", "");

  

  constructor(private expensesService: ExpensesService, private http: Http) {

    this.activePageTitle = "Expenses";
    this.isnewvalue = false;

   
  }

  //@ViewChild(Ng2PopupComponent) popup: Ng2PopupComponent;
  ngOnInit() {
    this.getAllDrivers();
  }
  /**
  * This method gets all expenses details
  */

  

  public getAllExpenses(item): void {
    console.log(item.value);
    console.info("Getting all expense list started");
    try {
      this.expensesService.getExpenses(item.value).then((expenses) => {
        setTimeout(() => {
          this.pseudoServer = expenses;
          this.load(1);
        }, 2000);
      });
    } catch (error) {
      console.error("Getting all expense list failed");
    }
  }

  public onPageChange(event) {
    this.rowsOnPage = event.rowsOnPage;
    this.load(event.activePage);
  }

  public load(page: number) {
    page = page - 1;
    this.amountOfRows = this.pseudoServer.length;
    let start = page * this.rowsOnPage;
    this.expenseslist = this.pseudoServer.slice(start, start + this.rowsOnPage);

  }


  public goToConvertImage(id: any) {
    console.info("Getting expense image ");
    for (let expense of this.expenseslist) {
      if (expense.id == id) {
        this.expense = expense;
      }
    }
    if (this.expense.bill == null) {
      this.isnewvalue = false;
    } else {
      this.isnewvalue = true;
      return this.expense;
    }
  }


  /**
  * This method gets all driver details
  */
  private getAllDrivers(): void {
    this.expensesService.getDrivers().subscribe(drivers => {
      this.driverListArray = drivers;
      let driverNamesList = new Array(this.driverListArray.length);
      console.log(drivers)
      for (let i = 0; i < this.driverListArray.length; i++) {
        driverNamesList[i] = {
          value: this.driverListArray[i].empID,
          label: this.driverListArray[i].firstName + " " + this.driverListArray[i].lastName
        };
      }
      this.driverNamesList = driverNamesList.slice(0);
    });

  }
}