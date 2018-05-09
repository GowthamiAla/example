import { ILocation } from './location';

/**
 * This is Dealer model class to store dealer data
 */

export class Location  {
   constructor(
       public locNbr: string,
       public contactPerson:string,
       public locAddrName: string,
       public address: string,
       public city: string,
       public state: string,
       public country: string,
       public zipCode: string,
       public email: string,
       public phoneNumber: string,
       public latitude: string,
        public longitude: string,
       public createdTS:string,
       public lastUpdatedTS:string,


     ) { }
}
