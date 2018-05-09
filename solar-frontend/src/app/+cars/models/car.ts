/**
 * This is car interface to give data type for cars object
 */

export interface ICar {
  id: string;
  vin: string;
  vinSeq: string;
  yardId: string;
  loadSeq: string;
  divCd: string;
  scac: string;
  loadNum: string;
  affil: string;
  shipId: string;
  dealerCd: string;
  colorDesc: string;
  vinDesc: string;
  dealercds: Array<any>;
  dealerAddress:String;
  dealerName:String;
  parkingSpot: string;
  lotLocation: string;

}


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
