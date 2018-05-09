import { IVin } from './vin';

/**
 *This is model driver class to store driver data
 */

export class Vin implements IVin {


  constructor(
    public id : number,
	public vin : string,
	public vinSeq : string,
	public yardId : string,
	public loadSeq : number,
	public divCd : string,
	public scac : string,
	public loadNum : string,
	public affil : string,
	public shipId : string,
	public dealerCd : string,
	public colorDesc : string,
	public vinDesc : string,
    public parkingSpot : string,
	public lotLocation : string, ){

    }
}
