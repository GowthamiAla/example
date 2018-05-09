import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, format?: any): any {
    return moment(value).format(format);
  }

}


@Pipe({
  name: 'momentfromnow'
})
export class MomentPipeFromNow implements PipeTransform {
  transform(value: any, format?: any): any { return moment(value).calendar();
    


  }
}

@Pipe({
  name: 'momentdategrouped'
})
export class MomentDateGroupedPipe implements PipeTransform {

  transform(value: any, format?: any): any {
    return moment(value).format(format);
  }

}


