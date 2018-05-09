import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "locationDataFilter"
})
export class LocationDataFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => ((row.desc.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                (row.city.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                (row.state.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                (row.dealerCd.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                (row.contact.toLowerCase().indexOf(query.toLowerCase()) > -1)))
        }
        return array;
    }
}
