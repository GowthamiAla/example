import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "vinDataFilter"
})
export class VinDataFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => (
                (row.vin.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                (row.loadNum.toLowerCase().indexOf(query.toLowerCase()) > -1) || (row.vinDesc.toLowerCase().indexOf(query.toLowerCase()) > -1)
            ))

        }
        return array;
    }
}