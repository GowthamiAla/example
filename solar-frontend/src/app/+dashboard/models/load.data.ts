import { ILoad } from './load';
import { IDealer} from './dealer';

/**
 *This is model user class to store driver data
 */

export class Load implements ILoad {

    constructor(
        public loadNum: string,
        public trkNum: string,
        public driverId: string,
        public driverName: string,
        public driverLat: string,
        public driverLong: string,
        public loadStatus: string,
        public loadHighValue: number,
        public loadHighPriority: number,
        public dealerList:IDealer[]

    ) {

    }

}
