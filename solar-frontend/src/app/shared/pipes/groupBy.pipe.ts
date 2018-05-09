import { Pipe, PipeTransform } from '@angular/core';
import {INotifications} from '../Model/notifications';
import { AppSettings } from '../../pages/shared/appSettings';

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
    transform(value: Date) {
        AppSettings.currentDate = value;
        if(AppSettings.currentDate == AppSettings.previousDate){
        }else{
          AppSettings.previousDate = value;
          return value;
        }
    }  
}
