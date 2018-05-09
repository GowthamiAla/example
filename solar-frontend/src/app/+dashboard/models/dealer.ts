import {IVin } from './vin';

export interface IDealer {
  dealerNumber: string;
  dealerName: string;
  city: string;
  contactName: string;
  status: string;
  seq: string;
  vinCount: number;
  longtitude: string;
  latitude: string;
  vinList: IVin[];
}
