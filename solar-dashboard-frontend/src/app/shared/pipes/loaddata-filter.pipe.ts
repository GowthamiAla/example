import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "loadDataFilter"
})
export class LoadDataFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row=>((row.loadNum.toLowerCase().indexOf(query.toLowerCase())> -1)||
        (row.driverName.toLowerCase().indexOf(query.toLowerCase())> -1)||
            (row.trkNum.toLowerCase().indexOf(query.toLowerCase())> -1)||
            (row.loadStatus.toLowerCase().indexOf(query.toLowerCase())> -1)))
        }
        return array;
    }
}