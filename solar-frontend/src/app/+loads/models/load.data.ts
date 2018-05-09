import { ILoad } from './load';

/**
 *This is model user class to store driver data
 */

export class Load implements ILoad {

    constructor(
        public loadNum: string,
        public empID: string,
        public driverName: string,
        public driverMailId: string,
        public email: string,
        public trkNum: string,
        public skidDrops: string,
        public loadHighValue: number,
        public loadHighPriority: number,
        public dealercds: Array<any>,
        public dealerCdList: Array<any>,        
        public dealerAddress: string

    ) {

    }

}
