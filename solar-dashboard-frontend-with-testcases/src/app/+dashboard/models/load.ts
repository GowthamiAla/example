/**
 * A model class to hold load details
 */
import { IDealer} from './dealer';
export interface ILoad {
  loadNum: string;
  trkNum: string;
  driverId: string;
  driverName: string;
  driverLat: string;
  driverLong: string;
  loadStatus: string;
  loadHighValue: number;
  loadHighPriority: number;
  dealerList: IDealer[];
}
