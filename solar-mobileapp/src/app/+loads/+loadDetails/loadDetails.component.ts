import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadServices } from '../loads.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';

declare let cordova: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'load-details',
    templateUrl: './loadDetails.component.html',
    styles: [`
    .widgetBody{
        padding-top:20px !important;
    }.load-subtitle > b {
            color: #3276b1;
           }
         .load-title {
           margin-left:1%;
          }
         .load-view{
            margin-left:1%;
          }
         .load-header{
            background-color:rgb(76,79,83);
            color:white
          }
          .load.panel-footer {
            background-color:white
          }`]
})

export class LoadDetailsComponent {
    public loadDetailsData: any;
    public distanceValue: any;
    public loadDetailsdataError: any;
    loadAccepted = false;
    loadSelected = false;
    public locateCurrentAddress: any;
    constructor(private router: Router, private loadservice: LoadServices, private route: ActivatedRoute, private _location: Location) { }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        // call to location corordinates
        this.geoLocation();

        this.loadAccepted = false;
        this.loadSelected = false;
        const loadAcceptedNumber = localStorage.getItem('loadAcceptedNumber');
        if (loadAcceptedNumber) {
            this.loadSelected = true;
        }
        // get the load details data
        this.route.params.forEach((params: Params) => {
            if (params['id'] !== undefined) {
                const loadNumber = params['id'];
                // get load details from service
                this.loadDetails(loadNumber);
                if (loadNumber === loadAcceptedNumber) {
                    this.loadAccepted = true;
                }
            } else {
                console.log('Driver has not selected any load');
            }

        })


        document.addEventListener('deviceready', () => {
            cordova.plugins.locationAccuracy.canRequest((canRequest) => {
                if (canRequest) {
                    cordova.plugins.locationAccuracy.request((success) => {
                        console.log('Successfully requested accuracy: ' + success.message);
                        // call to location corordinates
                        this.geoLocation();

                    }, (error) => {
                        navigator['app'].exitApp();
                        console.error('Accuracy request failed: error code=' + error.code + '; error message=' + error.message);
                        if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                            // tslint:disable-next-line:max-line-length
                            if (window.confirm('Failed to automatically set Location Mode to "High Accuracy". Would you like to switch to the Location Settings page and do this manually?')) {
                                cordova.plugins.diagnostic.switchToLocationSettings();
                            }
                        }
                    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                }
            }, (error) => {
                console.log('Failed to popup location on button');
            });
        })

    }

    geoLocation() {
        console.log('Geo location function called');
        // html5 current location
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(this.getCurrentLocation.bind(this),
            this.locationError.bind(this), { enableHighAccuracy: true });
        }
    }
    // success callback for navigation
    getCurrentLocation = (position) => {
        const lotLatLng = {
            lat: 39.053720,
            lng: -121.517768
        };

        console.log('location cordontates called')
    }

    // error callback for navigation
    locationError = () => {
        console.log('location found error');
        alert('Please Enable Location Services');
    }

    loadDetails(loadNumber: any) {
        this.loadservice.getLoadDetails(loadNumber).subscribe(
            data => {
                if (data) {
                    this.loadDetailsData = data;
                    this.getTimeandDistanceValues(this.loadDetailsData.originLocNbr.latitude,
                        this.loadDetailsData.originLocNbr.longitude, this.loadDetailsData.destLocNbr.latitude,
                        this.loadDetailsData.destLocNbr.longitude);
                } else if (data.error) {
                    console.log('Unable to get user details');
                }
            },
            error => {
                console.log('Error')
                this.loadDetailsdataError = error;
            });
    }

    // accept load
    loadAccept(loadNumber: any) {
        const checkLoadAccepted = localStorage.getItem('loadAcceptedNumber');
        // check load already accepted if already accepted throws alert
        if (!checkLoadAccepted) {
            this.loadservice.setLoadAccept(loadNumber, 4).subscribe(
                data => {
                    this.loadDetailsData = data;
                    localStorage.setItem('loadAcceptedNumber', loadNumber);
                    this.updateDriverCoordinates();
                },
                error => {
                    console.log('Error')
                    this.loadDetailsdataError = error;
                });
        } else {
            alert('You have already accepted another load ');
        }
    }

    // update driver cororidnates when accept the load
    updateDriverCoordinates() {
        this.locateCurrentAddress = {
            lat: this.loadDetailsData.originLocNbr.latitude,
            lng: this.loadDetailsData.originLocNbr.longitude
        };
        this.loadservice.sendDriverCoordinates(this.loadDetailsData.originLocNbr.latitude,
            this.loadDetailsData.originLocNbr.longitude,
            localStorage.getItem('driverData')).subscribe(
            data => { },
            error => {
                console.log('Error')
                this.loadDetailsdataError = error;
            });
    }


    // decline laod
    loadCancel() {
        // this.router.navigate(['/loads']);
        this._location.back();
    }

    // navigate to map page
    onNavigateMap() {
        this.router.navigate(['/maps'])
    }


    getTimeandDistanceValues(pLat, pLng, dLat, dLng) {
        this.loadservice.getTimeandDistance(pLat, pLng, dLat, dLng).subscribe(response => {
            this.distanceValue = response.rows[0].elements[0].distance.text;
        },
            error => {
                this.distanceValue = '-';
                return '-'
            });
    }
}

