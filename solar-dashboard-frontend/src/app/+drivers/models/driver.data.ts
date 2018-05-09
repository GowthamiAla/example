import { IDriver } from './driver';

/**
 *This is model driver class to store driver data
 */

export class Driver implements IDriver {


  constructor(

    public id: string,
    public user: any,
    public dateOfBirth: Date,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phoneNumber: string,
    public password: string,
    public latitude: number,
    public longitude: number,
    public licenseNumber: string,
    public licenseExpiryDate: Date,
    public vendor: any

  ) {

  }

}
