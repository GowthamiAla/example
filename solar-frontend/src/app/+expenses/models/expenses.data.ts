import { IExpenses } from './expenses';

/**
 *This is model food class to store driver data
 */

export class Expenses implements IExpenses {

  constructor(
    public id: string,
    public driver_id: string,
    public driverName: string,
    public loadNum: number,
    public expenseType: number,
    public amount: number,
    public startDate: Date,
    public endDate: Date,
    public billDate: string,
    public bill: number
  ) {

  }

}


