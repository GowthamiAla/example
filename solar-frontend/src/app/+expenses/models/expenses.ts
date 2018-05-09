

/**
 * This is Food interface to give data type for drivers object
 */
export interface IExpenses {
  id: string;
  driver_id: string;
  driverName: string;
  loadNum: number;
  expenseType: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  billDate: string;
  bill: number;

}

