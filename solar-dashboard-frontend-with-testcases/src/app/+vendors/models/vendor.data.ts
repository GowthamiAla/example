import { IVendor } from './vendor';

/**
 * This is vendor model class to store vendor data
 */

export class Vendor implements IVendor {

  constructor( 
    public vendorNbr:String,
	  public vendorName:String,
    public phoneNumber:String,
    public email:String,
    public address:String,
    public state:String,
    public city:String,
    public country:String,
    public zipCode:String,
    
    ) {

  }

}


