import { IVin } from './vin';
import {IDealer} from './dealer';

export class Dealer implements IDealer {
  constructor(
	public dealerNumber : string,
	public dealerName : string,
	public city : string,
	public contactName : string,
	public status : string,
	public seq : string,
	public vinCount : number,
	public longtitude : string,
	public latitude : string,
	public vinList : IVin[] ){

    }
}
