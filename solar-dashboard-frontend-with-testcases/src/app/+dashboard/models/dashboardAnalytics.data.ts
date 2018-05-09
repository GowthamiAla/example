import { IDashboardAnalytics } from './dashboardAnalytics';

export class DashboardAnalytics implements IDashboardAnalytics {
	constructor(
		public totalDrivers: number,
		public totalDealers: number,
		public totalVins: number,
		public totalNotifications: number,
		public geofenceNotifications: number) { }
}
