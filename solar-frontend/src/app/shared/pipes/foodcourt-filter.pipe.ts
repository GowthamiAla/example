import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "foodDataFilter"
})
export class FoodCourtFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row=>((row.name.toLowerCase().indexOf(query.toLowerCase())> -1)||
            (row.address.toLowerCase().indexOf(query.toLowerCase())> -1)))
        }

        return array;
    }
}


