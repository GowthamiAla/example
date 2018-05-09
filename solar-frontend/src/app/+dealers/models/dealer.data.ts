import { IDealer } from './dealer';

/**
 * This is Dealer model class to store dealer data
 */

export class Dealer implements IDealer {
  constructor(
    public dealerCd: string,
    public city: string,
    public affil: string,
    public shipId: string,
    public desc: string,
    public zipCode: string,
    public phone: string,
    public phone2: string,
    public state: string,
    public email1: string,
    public email2: string,
    public contact: string,
    public longtitude: number,
    public latitude: number,
    public primaryEmailFlag: string,
    public primaryPhoneFlag: string,
    public primaryEmailFlag2: string,
    public primaryPhoneFlag2: string,
    public instruction: string,
    public instruction2: string,
    public address: string) { }
}
