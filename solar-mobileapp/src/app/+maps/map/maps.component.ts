import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ViewEncapsulation, ViewChild, ElementRef, } from '@angular/core';
import { GoogleAPIService, MapStyleService } from '../shared';
import { fadeInTop } from '../shared/animations/router.animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { LoadServices } from '../../+loads/loads.service';
import * as moment from 'moment';
declare var google: any;
declare var MarkerClusterer: any;
declare let cordova: any;


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'maps',
    templateUrl: './maps.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./maps-component.css']
})

export class ClusterMapsComponent implements OnInit {

    public timeandDate: any;
    public timeandDateError: any;
    public enableCompleteLoadButton: any;
    public travellingDistance: any;
    public travellingTime: any;
    public travellingDate: any;
    public activeStyle: any;
    public map: any;
    public directionsService;
    public directionsDisplay;
    public markerClustering;
    public locationMarker;
    public geocoder;
    public locateDriverCurrentAddress: any;
    public DriverloadData: any;
    LocationMarkerinfowindow: any;
    public DriverdrirectionEnabled = false;
    public navigationDropdown: boolean;
    public DriverLocationDetails: any;
    public DriverLocationErrorDetails: any;
    public weatherResponse: any;
    public weatherLoader = true;
    public clustermarkers: any;
    public loadDetails: any = [];
    public loadDeatailsError;
    public driverDistanceInfoWindow;
    // final filter object storage for cluster
    public filterClusterData: any = {};

    // weather modal
    @ViewChild('weatherDetailsModal') public weatherDetailsModal: ModalDirective;
    @ViewChild('showLoadCompleteAlert') public showLoadCompleteAlert: ModalDirective;

    // map themes
    public styles = [
        { key: 'colorful', name: 'Colorful', url: '/greyscale.json' },
    ];

    public showChildModal(): void {
        this.weatherDetailsModal.show();
    }

    public showCompleteLoadPopup() {
        this.showLoadCompleteAlert.show();
    }

    public hideChildModal(): void {
        this.weatherDetailsModal.hide();
    }


    constructor(private el: ElementRef, private loadservice: LoadServices,
        private apiService: GoogleAPIService, private cdRef: ChangeDetectorRef,
        private styleService: MapStyleService, private route: ActivatedRoute, private router: Router) {
    }


    ngOnInit() {
        // hiding the weather and completed load button
        this.enableCompleteLoadButton = false;
        this.DriverdrirectionEnabled = false;
        this.requestNativeLocationAccess();

        this.getLoadDetails();
    }

    requestNativeLocationAccess() {
        document.addEventListener('deviceready', () => {
            console.log('maps device ready');
            // cordova.plugins.locationAccuracy.canRequest((canRequest) => {
            //     console.log('canRequest called' + canRequest);
            //     if (canRequest) {
            cordova.plugins.locationAccuracy.request((success) => {
                console.log('Successfully requested accuracy: ' + success.message);
                this.geoLocation();
                this.getLoadDetails();
            }, (error) => {
                navigator['app'].exitApp();
                if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                    if (window.confirm('Failed to automatically set Location Mode to "High Accuracy"' +
                        +' Would you like to switch to the Location Settings page and do this manually?')) {
                        cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            // } else {
            //     alert('canrequest failed');
            // }
            // }, (error) => {
            //     console.log('Failed to popup location on button');
            // });

        })
    }

    // get all laods service
    getLoadDetails() {
        const driverId = localStorage.getItem('driverData');
        this.loadservice.getAllLoads(driverId).subscribe(
            data => {
                if (data.data != null) {
                    this.geoLocation();
                    const loadAcceptedDetails: any = [];
                    this.loadDetails = data.data;
                    localStorage.setItem('loadDetails', JSON.stringify(data.data));
                    for (let i = 0; i < data.data.length; i++) {
                        if (data.data[i].apptStatNbr.id === 4) {
                            loadAcceptedDetails.push(data.data[i].apptNbr);
                        }
                    }
                    localStorage.setItem('loadAcceptedNumber', loadAcceptedDetails);
                } else {
                    this.loadDeatailsError = data.error.message;
                }
            },
            error => {
                this.loadDeatailsError = error;
                console.log(JSON.stringify(error))
                // alert('Unable to get load details');

            });

    }
    // get current position coroordinates
    geoLocation() {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(this.getCurrentLocation.bind(this),
                this.locationError.bind(this), { enableHighAccuracy: true });
        }
    }

    // success callback
    getCurrentLocation = (position) => {
        // temporary us co-ordinates
        const lotLatLng = {
            lat: 39.053720,
            lng: -121.517768
        };

        // orginal to get current position
        // var lotLatLng = {
        //     lat: position.coords.latitude,
        //     lng: position.coords.longitude
        // };
        this.locateDriverCurrentAddress = lotLatLng;
        this.loadMap(lotLatLng);
        console.log('get current position called');
    }
    // error call back
    locationError = () => {
        alert('Please Enable Location Services');
    }


    // load map
    loadMap(currentCoordinates) {
        this.activeStyle = this.styles[0];

        // Loading the amp Service
        this.apiService.loadAPI.then((google) => {
            console.log('google api loaded');
            // library API

            this.geocoder = new google.maps.Geocoder();

            // loading map theme
            this.fetchStyle(this.activeStyle);

            // map track to current location
            this.map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: currentCoordinates,
                zoom: 13
            });

            // if load number is present navigate to map else clustring map is shown
            const loadAcceptedNumber = localStorage.getItem('loadAcceptedNumber');
            const allLoadsData: any = JSON.parse(localStorage.getItem('loadDetails'));
            if (loadAcceptedNumber) {
                for (let i = 0; i < allLoadsData.length; i++) {
                    if (allLoadsData[i].apptNbr === loadAcceptedNumber) {
                        this.DriverloadData = allLoadsData[i];
                        const dcStartLocation = {
                            'lat': this.DriverloadData.originLocNbr.latitude,
                            'lng': this.DriverloadData.originLocNbr.longitude
                        }
                        const dcEndLocation = {
                            'lat': this.DriverloadData.destLocNbr.latitude,
                            'lng': this.DriverloadData.destLocNbr.longitude
                        }
                        const driverLocation = {
                            'lat': this.DriverloadData.driver.latitude,
                            'lng': this.DriverloadData.driver.longitude
                        }
                        this.startNavigateMap(dcStartLocation, dcEndLocation,
                            currentCoordinates, driverLocation, this.DriverloadData.geomiles, this.DriverloadData.destLocNbr);
                        console.log('calling navigation map function');
                        break;
                    }
                }
            } else {
                this.clusturingMapDispatureLocations(allLoadsData, this.locateDriverCurrentAddress);
                console.log('calling clustering function');
            }
        })
    }


    // clustering map
    clusturingMapDispatureLocations(loadDetailsData, driverLocation) {
        console.log('cluster function called')
        const Dispaturelocations: any = [];
        const self = this;

        // //adding the dispature locations to array
        // for (let i = 0; i < loadDetailsData.length; i++) {
        //     Dispaturelocations.push(loadDetailsData[i]);
        // }

        // filter to unique locations
        const uniqueData = [];
        const uniqueLocations = [];
        for (let i = 0; i < loadDetailsData.length; i++) {
            if (uniqueData.indexOf(loadDetailsData[i].originLocNbr.locNbr) === -1) {
                uniqueLocations.push(loadDetailsData[i].originLocNbr)
                uniqueData.push(loadDetailsData[i].originLocNbr.locNbr);
            }
        }



        uniqueLocations.forEach(function (obj) {
            const TripNumbers = [];
            loadDetailsData.forEach(function (obj2) {
                if (obj.locNbr === obj2.originLocNbr.locNbr) {
                    const tripNum = {
                        'apptNbr': obj2.apptNbr
                    }
                    TripNumbers.push(tripNum)
                }
                obj.tripnumbers = TripNumbers;
            })
        });


        // pushing locations to cluster
        uniqueLocations.forEach(function (location) {
            Dispaturelocations.push(location);
        })


        let clickedLocObject;
        this.LocationMarkerinfowindow = new google.maps.InfoWindow();
        // adding the dispature locations markers
        this.clustermarkers = Dispaturelocations.map((location, i) => {
            console.log('cluster marker called')
            const Dcmarker = new google.maps.Marker({
                position: new google.maps.LatLng(location.latitude, location.longitude)
            });

            // set marker zoom position
            this.map.setZoom(3);
            this.map.setCenter(new google.maps.LatLng(42.552413, -104.269675));

            // opening the info window for location marker
            google.maps.event.addListener(Dcmarker, 'click', (currentLocationmarkerEvent) => {
                let loadHtml: any = '';
                // set load numbers to content window
                location.tripnumbers.forEach(function (num, index) {
                    loadHtml += '<a id="navigateToLoads' + index + '"><div><strong class="padding-5">'
                        + num.apptNbr + ' </strong></div></a>'
                })

                // set content
                this.LocationMarkerinfowindow.setContent('<div><strong><a class="padding-5">' + location.locAddrName + '</a>' +
                    '<br> <strong class="padding-5">Load Numbers:</strong>' +
                    '<br>' + loadHtml +
                    '</div>');
                this.LocationMarkerinfowindow.open(this.map, Dcmarker);
                clickedLocObject = location;
            });
            return Dcmarker;
        });
        // adding the click event to load number in info window loation marker in cluster
        google.maps.event.addListener(this.LocationMarkerinfowindow, 'domready', () => {
            clickedLocObject.tripnumbers.forEach(function (num, index) {
                document.getElementById('navigateToLoads' + index).addEventListener('click', (e) => {
                    const link = ['/loads/loadDetails', num.apptNbr];
                    self.router.navigate(link);
                });
            });
        })

        // Add a marker clusterer to manage the markers.
        const markerCluster = new MarkerClusterer(this.map, this.clustermarkers,
            { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

        // truck marker
        const truckLocationMarker = new google.maps.Marker({
            position: driverLocation,
            map: this.map,
            draggable: false,
            icon: './assets/img/truck-icon.png',
        });
    }

    // route display
    startNavigateMap(dcSatrtLocation, dcEndLocation, currentCoordinates, driverLocation, geomiles, destinationData) {
        console.log(JSON.stringify(dcEndLocation))
        this.DriverdrirectionEnabled = true;
        this.directionsService = new google.maps.DirectionsService();
        this.driverDistanceInfoWindow = new google.maps.InfoWindow();
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            map: this.map,
            suppressMarkers: true,
        });


        // truck marker
        const truckLocationMarker = new google.maps.Marker({
            position: driverLocation,
            map: this.map,
            draggable: true,
            icon: './assets/img/truck-icon.png',
        });

        // //calling on it to get driver details
        this.UpdateDriverLocation(driverLocation.lat, driverLocation.lng, dcEndLocation.lat,
            dcEndLocation.lng, geomiles, destinationData.user.id);
        this.locateDriverCurrentAddress = driverLocation;

        // dragged river location
        google.maps.event.addListener(truckLocationMarker, 'dragend', (event) => {
            this.map.setZoom(8);
            this.map.setCenter(truckLocationMarker.getPosition());
            this.locateDriverCurrentAddress = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            }
            this.UpdateDriverLocation(event.latLng.lat(), event.latLng.lng(),
                dcEndLocation.lat, dcEndLocation.lng, geomiles, destinationData.user.id);
            driverLocation.lat = event.latLng.lat();
            driverLocation.lng = event.latLng.lng();
        });

        // truck marker click to get loation details again
        google.maps.event.addListener(truckLocationMarker, 'click', (event) => {
            this.UpdateDriverLocation(driverLocation.lat, driverLocation.lng,
                dcEndLocation.lat, dcEndLocation.lng, geomiles, destinationData.user.id);
            this.driverDistanceInfoWindow.open(this.map, truckLocationMarker);
        });

        // start and end icons
        const icons = {
            start: {
                url: './assets/img/startLocationMarker.png',
                origin: new google.maps.Point(0, -30),
            },
            end: {
                url: './assets/img/endLocationMarker.png',
                origin: new google.maps.Point(0, -30),
            },
        };

        // route map function
        this.directionsService.route({
            origin: new google.maps.LatLng(dcSatrtLocation.lat, dcSatrtLocation.lng),
            destination: new google.maps.LatLng(dcEndLocation.lat, dcEndLocation.lng),
            travelMode: 'DRIVING',
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
                const leg = response.routes[0].legs[0];
                this.makeMarkerValue(leg.start_location, icons.start, 'Start');
                this.makeMarkerValue(leg.end_location, icons.end, 'Lot Location');
                this.geofenceArea(dcEndLocation.lat, dcEndLocation.lng, geomiles);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    // geo fence area circle
    geofenceArea(dcEndLocationLat, dcEndLocationLng, geomiles) {
        const cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            center: new google.maps.LatLng(dcEndLocationLat, dcEndLocationLng),
            radius: (1609.3 * (+geomiles))
        });
    }

    // route start and end location marker class
    makeMarkerValue = (position, icon, title) => {
     new google.maps.Marker({ position: position, map: this.map, icon: icon, title: title });
    }


    UpdateDriverLocation(currentLat, currentLng, destinationlat, destinationlng, geomiles, destinationManagerId) {
        const driverObject = {
            'loadNum': this.DriverloadData.apptNbr,
            'driver': this.DriverloadData.driver.user.name,
            'location': this.DriverloadData.destLocNbr.address + ',' + this.DriverloadData.destLocNbr.city
        }
        // updating the driver coordinates
        this.loadservice.sendLocationDetails(currentLat, currentLng, destinationlat, destinationlng,
            geomiles, destinationManagerId, driverObject).subscribe(
            data => {
                // if (data['_body']) {
                //     //enabling the complete load button
                //     this.enableCompleteLoadButton = true;
                // } else {
                //     this.enableCompleteLoadButton = false;
                // }
            },
            error => {
                console.log('gefence service Error')
                this.DriverLocationErrorDetails = error;
            });

        // updating the driver coordinates
        this.loadservice.sendDriverCoordinates(currentLat, currentLng, this.DriverloadData.driver.id).subscribe(
            data => {
                console.log('driver coordinates updated');
            },
            error => {
                console.log('gefence service Error')
                this.DriverLocationErrorDetails = error;
            });

        // gettting the time and distance data
        this.loadservice.getTimeandDistance(currentLat, currentLng, destinationlat, destinationlng).subscribe(
            data => {
                this.travellingDistance = data.rows[0].elements[0].distance.text;
                this.travellingTime = data.rows[0].elements[0].duration.text;
                const seconds = data.rows[0].elements[0].duration.value;
                const finalDateInMiliSeconds = new Date().getTime() + (seconds * 1000);
                this.travellingDate = moment(finalDateInMiliSeconds).format('ddd, MMM Do YYYY, h:mm a');
                this.driverDistanceInfoWindow.setContent('<div><strong>Time: ' + this.travellingTime +
                    '</strong></div><br><div><strong>Distance:' + this.travellingDistance +
                    '</strong></div><br><div><strong>ETA: ' + this.travellingDate + '</strong></div>');
                // driverDistanceInfoWindow.open(this.map, truckLocationMarker);
                if (data.rows[0].elements[0].distance.value < 8047) {
                    this.showCompleteLoadPopup();
                }
            },
            error => {
                console.log('timeandDate service Error')
                this.DriverLocationErrorDetails = error;
            });

    }


    // complete load
    setCompleteLoad() {
        this.loadservice.setLoadAccept(this.DriverloadData.apptNbr, 5).subscribe(
            data => {
                localStorage.removeItem('loadAcceptedNumber');
                this.enableCompleteLoadButton = false;
                this.router.navigate(['/loads']);
            },
            error => {
                console.log('Error')

            });
    }


    // weather report function
    weatherReport() {
        this.weatherDetailsModal.show();
        this.weatherLoader = true;
        this.loadservice.getWeatherReport(this.locateDriverCurrentAddress.lat, this.locateDriverCurrentAddress.lng).subscribe(
            data => {
                if (data != null) {
                    this.weatherResponse = data;
                    const tempF = this.weatherResponse.temp;
                    const tempC = (tempF - 32) * 5 / 9;
                    let windDirection;
                    this.weatherResponse.tempC = Math.round(tempC);
                    const windDirectionAngle = this.weatherResponse.windd,
                        windSpeed = this.weatherResponse.winds,
                        gust = this.weatherResponse.gust;
                    const that = this;
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
                    } else if (windSpeed === '0' && windDirectionAngle === 'NA') {
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
                    const dewp = (dewpF - 32) * 5 / 9;
                    const dewpC = Math.round(dewp);
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
                    this.DriverLocationErrorDetails = 'Unable to get weather details';
                    console.log('Unable to get user details');
                }
            },
            error => {
                console.log('Error')
                this.weatherLoader = false;
                this.DriverLocationErrorDetails = error;
            });

    }

    // set map theme
    fetchStyle(style) {
        this.styleService.fetchStyle(style).subscribe((styleDef) => {
            this.map.mapTypes.set(style.key,
                new google.maps.StyledMapType(styleDef,
                    { name: style.name })
            );
            this.map.setMapTypeId(style.key);
        })
    }


}

