import { IDashboard } from './dashboard';

/**
 * This is Dealer model class to store dealer data
 */

export class CurrentLoad implements IDashboard {
  constructor(
    public driverName: string,
    public dealerName: string,
    public estimatedTime:string,
    public estimationDistance:string,
    public prevSkids:string,
    public CurrentSkids:string

) { }
}
