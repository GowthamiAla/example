/**
 * A model class to hold load details
 */
export interface ILoad {
    loadNum: string;
    empID: string;
    driverName: string;
    driverMailId: string;
    email: string;
    trkNum: string;
    skidDrops: string;
    loadHighValue: number;
    loadHighPriority: number;
    dealercds: Array<any>;
    dealerCdList: Array<any>;
    dealerAddress: string;
}
