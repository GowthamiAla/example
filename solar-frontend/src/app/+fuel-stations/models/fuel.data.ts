import { IFuel } from './fuel';

/**
 *This is model fuel class to store driver data
 */

export class Fuel implements IFuel {

  constructor(
  public  id: number,
  public  name: string,
  public  address: string,
  public  latitude: number,
  public  longitude: number,
  public  type: number) {

  }

}
