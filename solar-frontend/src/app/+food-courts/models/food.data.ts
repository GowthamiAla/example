import { IFood } from './food';

/**
 *This is model food class to store driver data
 */

export class Food implements IFood {

  constructor(
  public  id: number,
  public  name: string,
  public  address: string,
  public  latitude: number,
  public  longitude: number,
  public  type: number) {

  }

}
