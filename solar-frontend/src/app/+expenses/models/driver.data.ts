import { IDriver } from './driver';

/**
 *This is model driver class to store driver data
 */

export class Driver implements IDriver {


  constructor(
    public empID: string ,
    public bDate: Date,
    public firstName: string,
    public lastName: string,
    public middleName: string,
    public terminal: string,
    public email: string,
    public phoneNumber: string,
    public passWord: string) {

  }

}
