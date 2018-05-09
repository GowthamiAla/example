import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "expensesDataFilter"
})
export class ExpensesFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row=>((row.driverName.toLowerCase().indexOf(query.toLowerCase())> -1)||
            (row.loadNum.toLowerCase().indexOf(query.toLowerCase())> -1)||
            (row.expenseType.toLowerCase().indexOf(query.toLowerCase())> -1)||
            (row.amount.toLowerCase().indexOf(query.toLowerCase())> -1)||
            (row.billDate.toLowerCase().indexOf(query.toLowerCase())> -1)))
        }
        return array;
    }
}
