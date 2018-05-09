import { ILoad } from './load';

/**
 *This is model user class to store driver data
 */

export class Load implements ILoad {
    // public apptNbr: string;
    // public driver: driver;
    // public originLocNbr: originLocation;
    // public destLocNbr: destinationLocation;
    // public trlrNbr: truck;
    // public vndNbr: vendor;
    // public apptTypNbr: appoinment;
    // public cartons: number;
    // public highValueLoad: number;
    // public highPriorityLoad: number;

    public apptNbr: any;
    public driver: any;
    public originLocNbr: any;
    public destLocNbr: any;
    public trlrNbr: any;
    public vndNbr: any;
    public apptTypNbr: any;
    public cartons: any;
    public highValueLoad: any;
    public highPriorityLoad: any;
}


export class driver {
    public firstName: string;
}

export class originLocation {
    public locAddrName: string;
}

export class destinationLocation {
    public locAddrName: string;
}

export class truck {
    public truckNbr: number;
}

export class vendor {
    public vendorName: string;
}

export class appoinment {
    public id: number; public type: string;
}

