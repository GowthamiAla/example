import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { DashboardsServices } from '../../services/dashboards.services';
import { ILoad } from '../../models/load';
import { WeatherComponent } from '../weather/weather.component';


import { endponitConfig } from '../../../../environments/endpoints';

declare var L: any;

@Component({
	template: require('./liveTracking.component.html'),
	encapsulation: ViewEncapsulation.None,
	providers: [DashboardsServices, WeatherComponent]
})

export class LiveTrackingComponent implements OnInit {

	public activePageTitle: string;
	public drivers: ILoad[];
	constructor(private router: Router, private dashboardsServices: DashboardsServices, private weatherComponent: WeatherComponent) {
		this.activePageTitle = 'Live Tracking';
	}

	ngOnInit() {
		this.renderLiveTrackingMap();
	}

	public renderLiveTrackingMap() {

		var classInstance = this;
		L.mapbox.accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
		var map = L.mapbox.map('map', 'mapbox.streets')
			.setView([33.891315, -84.255382], 13);
		//L.mapbox.map.

		this.dashboardsServices.getDriverMarkersDetails().subscribe(driverMarkersList => {
			this.drivers = driverMarkersList;
			console.log(this.drivers)
			for (let driver of this.drivers) {
				console.log("kjdfhgkhdfjg" + driver.driverLat)
				var myIcon;
				if (driver.loadHighPriority == 1) {
					myIcon = L.divIcon({
						className: 'highPriorityLoadMarker',
						iconSize: 20
					});
				} else if (driver.loadHighValue == 1) {
					myIcon = L.divIcon({
						className: 'highValueLoadMarker',
						iconSize: 20
					});
				} else {
					myIcon = L.divIcon({
						className: 'normalLoadMarker',
						iconSize: 20
					});
				}
				L.marker([driver.driverLat, driver.driverLong], { icon: myIcon })
					.on('mouseover', function (e) {
						var popup = L.popup()
							.setLatLng(e.latlng)
							.setContent('<html><b>DriverName : </b>' + driver.driverName +
							'<br><b>Load Number : </b>' + driver.loadNum + '</html>')
							.openOn(map);
					})
					.on('click', function (e) {
						classInstance.weatherComponent.displayWeatherInformation(driver.driverLat, driver.driverLong, driver.loadNum, driver.driverName);
					})
					.addTo(map);
			}
		});
	}
}

