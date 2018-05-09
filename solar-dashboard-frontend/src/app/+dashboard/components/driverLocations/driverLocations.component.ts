import { Component, Type, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardDriverService } from '../../services/driverLocations.services';
import { CurrentLoad } from '../../models/dashboard.data';
import { Observable } from 'rxjs/Observable';
import { $WebSocket } from 'angular2-websocket/angular2-websocket'
import { WeatherComponent } from '../weather/weather.component';
import { ModalDirective } from 'ngx-bootstrap';

import * as moment from 'moment';
declare var L: any;
declare var $;


import { endponitConfig } from '../../../../environments/endpoints';

@Component({
    templateUrl: './driverLocations.html',
    providers: [DashboardDriverService, WeatherComponent],
    encapsulation: ViewEncapsulation.None,
    styles: [`
   .weather-parameters > b{
   font-family: Verdana;
   font-size: 14px;
   line-height: 2.1;
      }
      .weather-parameters > span {
   font-family: Verdana;
   font-size: 14px;
   line-height: 2.1;
      }
    .loader {
     border: 16px solid #f3f3f3;
     border-radius: 50%;
     border-top: 16px solid #3498db;
     width: 60px;
     height: 60px;
     left:42%;
    -webkit-animation: spin 2s linear infinite;
     animation: spin 2s linear infinite;
    }

    .weather-img{
        padding:6%;
    }

@-webkit-keyframes spin {
 0% { -webkit-transform: rotate(0deg); }
 100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
}`]
})
export class DriverLocationsComponent implements OnInit, OnDestroy {
    public load: CurrentLoad[];
    public getloadsdetails: any = 123;
    public loaddetails: any; // CurrentLoad = new CurrentLoad('', '', '', '', '', '');
    public map;
    public marker;
    public dealerImage = '././assets/img/map/dealer_icon.png';
    public driverImage = '././assets/img/map/PickupInspector.png';
    public pickupInspectorImage = 'resources/theme/img/map/truck-icon.png';
    public weatherIcon = '././assets/img/map/weather.png';
    public pcpUpInSP_lat = '33.881315';
    public pcpUpInSP_lang = '-84.255382';
    public pcpUpInspName = 'Terminal Manager';
    public directions = L.mapbox.directions();
    public myLayer;
    public directionsLayer;
    public routes;
    public origin = [];
    loadListQueryArray: Array<any> = [];
    public loadNumberList = [{ value: '', label: '' }];
    public drivermarker = [];
    public dealermarker = [];
    public waypointmarker = [];
    public weatherDriverlat = '';
    public weatherDriverlng = '';
    public weatherResponse: any;
    public weatherLoader;
    public weatherErrorResponse;
    public clearIntervalData;
    public loadErrorData;
    public loadErrorStatus;
    public getLoadserrorResponse;
    public clearIntervalListData;
    loadQueryData: any = { loadNumber: '' };

    // add event popover event declaration
    @ViewChild('weatherDetailsModal') public weatherDetailsModal: ModalDirective;
    public showChildModal(): void {
        this.weatherDetailsModal.show();
    }

    public hideChildModal(): void {
        this.weatherDetailsModal.hide();
    }
    constructor(private el: ElementRef, private dashboardService: DashboardDriverService,
        private router: Router, private weatherComponent: WeatherComponent) { }
    ngOnInit() {
        L.mapbox.accessToken = 'pk.eyJ1Ijoia2NlYTk5IiwiYSI6ImNpeGcwZGV3cTAwMGIyb253Z3g5bmJpMnIifQ.B0pZrnhEOmaPwHmmQH1nyw';
        this.map = L.mapbox.map('map', 'mapbox.streets', {
            zoomControl: true,
            minZoom: 2,
            maxZoom: 6
        }).setView([39.428893, -103.397667], 4);

        this.getAcceptedLoads();
        this.clearIntervalListData = window.setInterval(() => {
            this.getAcceptedLoads();
        }, 100 * endponitConfig.AUTO_REFRESH_SERVICE_TIME);
    }




    public getloadDetailsbyLoadnum(loadNum): void {
        this.getLoadDetailsById(this.loadQueryData.loadNumber);
        // tracking the driver location for every 30 seconds
        this.clearIntervalData = window.setInterval(() => {
            this.updateLoadDetailsById(this.loadQueryData.loadNumber);
        }, 1000 * endponitConfig.AUTO_REFRESH_SERVICE_TIME);
    }

    getLoadDetailsById(loadNum) {
        // get loads by id
        this.dashboardService.getloadsbyloadnumber(loadNum).then(response => {
            this.loaddetails = response;
            // set map
            this.setMapDirections(response);
            // driver marker
            this.driverMarker(response);
            this.getTimeandDistanceData(this.loaddetails.driver.latitude,
                this.loaddetails.driver.longitude, this.loaddetails.destLocNbr.latitude, this.loaddetails.destLocNbr.longitude);
        },
            error => error);
    }

    // for updating the driver locations and latlong values
    updateLoadDetailsById(loadNum) {
        // get loads by id
        this.dashboardService.getloadsbyloadnumber(loadNum).then(response => {
            this.loaddetails = response;
            // driver marker
            this.driverMarker(response);
            this.getTimeandDistanceData(this.loaddetails.driver.latitude,
                this.loaddetails.driver.longitude, this.loaddetails.destLocNbr.latitude, this.loaddetails.destLocNbr.longitude);
        },
            error => error);
    }

    private getAcceptedLoads(): void {
        this.dashboardService.getAcceptedloadNumbers().subscribe(response => {
            this.loadErrorData = false;
            this.getLoadserrorResponse = '';
            this.loadListQueryArray = response.data;
        },
            error => {
                error;
                if (error.status == 404) {
                    this.getLoadserrorResponse = error.exception;
                    this.loadErrorData = true;
                } else {
                    this.router.navigate(['/error']);
                }
            });
    }

    // get time and distance
    getTimeandDistanceData(orginLat, originLng, destLat, destLng) {
        this.dashboardService.getdistanceandTime(orginLat, originLng, destLat, destLng).subscribe(response => {
            this.loaddetails.setEstimateTime = response.rows[0].elements[0].duration.text;
            const seconds = response.rows[0].elements[0].duration.value;
            const finalDateInMiliSeconds = new Date().getTime() + (seconds * 1000);
            this.loaddetails.setEstimateArrivalTime = new Date(finalDateInMiliSeconds);
            this.loaddetails.setEstimateDest = response.rows[0].elements[0].distance.text;
        },
            error => {
                error;
            })
    }

    // laod map data
    setMapDirections(loadData) {
        // let direction = L.mapbox.directions();
        this.map.remove();
        this.directions = new L.mapbox.directions();

        this.map = L.mapbox.map('map', 'mapbox.streets', {
            zoomControl: true,
            minZoom: 2,
            maxZoom: 20
        }).setView([loadData.driver.latitude, loadData.driver.longitude], 7);

        this.directionsLayer = L.mapbox.directions.layer(this.directions)
            .addTo(this.map);
        const directionsErrorsControl = L.mapbox.directions.errorsControl('errors', this.directions)
            .addTo(this.map);

        let directionsRoutesControl = L.mapbox.directions.routesControl('routes', this.directions)
            .addTo(this.map);


        this.directions.setOrigin(L.latLng(loadData.originLocNbr.latitude, loadData.originLocNbr.longitude));
        this.directions.setDestination(L.latLng(loadData.destLocNbr.latitude, loadData.destLocNbr.longitude));
        this.directions.query();


        const directionsLayer = L.mapbox.directions.layer(this.directions, { 'readonly': true }).addTo(this.map);
        directionsRoutesControl = L.mapbox.directions.routesControl('routes', this.directions)
            .addTo(this.map);
    }

    // driver marker update
    driverMarker(loadData) {
        if (this.drivermarker !== [] || this.dealermarker !== [] || this.waypointmarker !== []) {
            this.map.removeLayer(this.drivermarker);
        }
        let drivermarker = '';
        drivermarker = L.icon({
            iconUrl: '../../../../assets/img/map/truck-icon.png',
            iconAnchor: [0, 0]
        });
        this.drivermarker = L.marker([loadData.driver.latitude, loadData.driver.longitude], { icon: drivermarker })
            .bindPopup('Driver : ' + loadData.driver.firstName + ' ' + loadData.driver.lastName)
            .addTo(this.map);
    }


    // get weather details

    public viewWeather(driverLat, driverLng) {
        this.weatherLoader = true;
        this.weatherComponent.getWeatherReport(driverLat, driverLng).subscribe(data => {
            if (data != null) {
                this.weatherResponse = data;
                const tempF = this.weatherResponse.temp;
                const tempC = (tempF - 32) * 5 / 9;
                this.weatherResponse.tempC = Math.round(tempC);
                let windDirection;
                const windDirectionAngle = this.weatherResponse.windd,
                    windSpeed = this.weatherResponse.winds, gust = this.weatherResponse.gust;
                if ((windDirectionAngle >= 0 && windDirectionAngle < 22.5)) {
                    windDirection = 'N'
                } else if (windDirectionAngle === 22.5) {
                    windDirection = 'NNE'
                } else if ((windDirectionAngle > 22.5 && windDirectionAngle < 67.5)) {
                    windDirection = 'NE'
                } else if (windDirectionAngle === 67.5) {
                    windDirection = 'ENE'
                } else if ((windDirectionAngle > 67.5 && windDirectionAngle < 112.5)) {
                    windDirection = 'E'
                } else if (windDirectionAngle === 112.5) {
                    windDirection = 'ESE'
                } else if ((windDirectionAngle > 112.5 && windDirectionAngle < 157.5)) {
                    windDirection = 'SE'
                } else if (windDirectionAngle === 157.5) {
                    windDirection = 'SSE'
                } else if ((windDirectionAngle > 157.5 && windDirectionAngle < 202.5)) {
                    windDirection = 'S'
                } else if (windDirectionAngle === 202.5) {
                    windDirection = 'SSW'
                } else if ((windDirectionAngle > 202.5 && windDirectionAngle < 247.5)) {
                    windDirection = 'SW'
                } else if (windDirectionAngle === 247.5) {
                    windDirection = 'WSW'
                } else if ((windDirectionAngle > 247.5 && windDirectionAngle < 292.5)) {
                    windDirection = 'W'
                } else if (windDirectionAngle === 292.5) {
                    windDirection = 'WNW'
                } else if ((windDirectionAngle > 292.5 && windDirectionAngle < 337.5)) {
                    windDirection = 'NW'
                } else if (windDirectionAngle === 337.5) {
                    windDirection = 'NNW'
                } else if ((windDirectionAngle > 337.5 && windDirectionAngle <= 360)) {
                    windDirection = 'N'
                }
                if (windSpeed === '0' && windDirectionAngle === '0') {
                    this.weatherResponse.wind_speed = 'calm';
                } else if (windSpeed === 0 && windDirectionAngle === 'NA') {
                    this.weatherResponse.wind_speed = 'NA';
                } else {
                    if (gust === '0' || gust === 'NA') {
                        this.weatherResponse.wind_speed = windDirection + ' ' + this.weatherResponse.winds + ' MPH';
                    } else {
                        this.weatherResponse.wind_speed = windDirection + ' ' + this.weatherResponse.winds + ' G ' + gust + ' MPH';
                    }
                }
                const altimeter = this.weatherResponse.altimeter;
                if (altimeter === '0') {
                    this.weatherResponse.barometer = this.weatherResponse.slp;
                } else {
                    this.weatherResponse.barometer = this.weatherResponse.slp + ' in (' + this.weatherResponse.altimeter + ' mb)';
                }
                const dewpF = this.weatherResponse.dewp;
                let dewpC = (dewpF - 32) * 5 / 9;
                dewpC = Math.round(dewpC);
                this.weatherResponse.dewPOintInDeg = dewpC;
                const humidity = this.weatherResponse.relh;
                let heatIndexF, heatIndexC;
                if (tempF > 80 && humidity > 40 && dewpF > 60) {

                    heatIndexF = -42.379
                        + 2.04901523 * tempF
                        + 10.14333127 * humidity
                        - .22475541 * tempF * humidity
                        - .00683783 * tempF * tempF
                        - .05481717 * humidity * humidity
                        + .00122874 * tempF * tempF * humidity
                        + .00085282 * tempF * humidity * humidity
                        - .00000199 * tempF * tempF * humidity * humidity;

                    heatIndexF = Math.round(heatIndexF);
                    heatIndexC = (heatIndexF - 32) * 5 / 9;
                    heatIndexC = Math.round(heatIndexC);

                    this.weatherResponse.heatIndexF = heatIndexF;
                    this.weatherResponse.heatIndexC = heatIndexC;
                }
                this.weatherLoader = false;


            } else {
                this.weatherLoader = false;
                this.weatherResponse = null;
                // this.DriverLocationErrorDetails = 'Unable to get weather details';
                console.log('Unable to get user details');
            }
        }, error => {
            this.weatherLoader = false;
            this.weatherErrorResponse = <any>error;
        });
        this.weatherDetailsModal.show();

    }

    ngOnDestroy() {
        window.clearInterval(this.clearIntervalData);
        window.clearInterval(this.clearIntervalListData);
    }


}
