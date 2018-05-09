import { ICar,ILoad } from './car';

/**
 * This is car model class to store cars data
 */

export class Car implements ICar {

  constructor( public id: string,
    public vin: string,
    public vinSeq: string,
    public yardId: string,
    public loadSeq: string,
    public divCd: string,
    public scac: string,
    public loadNum: string,
    public affil: string,
    public shipId: string,
    public dealerCd: string,
    public dealercds: Array<any>,
    public dealerAddress:String,
    public dealerName:String,
    public colorDesc: string,
    public vinDesc: string,
    public parkingSpot: string,
    public lotLocation: string ) {

  }

}


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
