import { IChartsData } from './chartsData';

export class ChartsData implements IChartsData {
	constructor(
		public date: string,
		public driver: string,
		public loadNum: string,
		public dealer: string,
		public vin: string,
		public damaged: number,
		public dd: string,
		public month: string) { }
}
