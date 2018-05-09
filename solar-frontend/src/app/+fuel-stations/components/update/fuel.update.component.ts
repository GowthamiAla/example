import { Component, EventEmitter, Type, Input, OnInit, Output, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IFuel } from '../../models/fuel';
import { FuelService } from '../../services/fuel.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { endponitConfig } from '../../../../environments/endpoints';

/** Global declarions for accessing google and $ value **/
declare var $: any;
declare var check: any;
declare var L: any;

/**
 * This component deals with Fuel update operation
 */

@Component({
    template: require('./fuel.update.component.html'),
    providers: [FuelService, FormBuilder]
})
export class FuelUpdateComponent implements OnInit {
    public activePageTitle: string;
    public fuelAddressList: any[];
    public fuelList: IFuel[];
    public map;
    public fuelUpdatedResponse: String;
    @Input() fuel: IFuel;
    @Output() close = new EventEmitter();
    public counterChange = new EventEmitter();
    navigated = true;
    error: any;
    isMatchedConfirmPassword: boolean;
    complexForm: FormGroup;
    formValidate: boolean;
    fuelName: AbstractControl;
    address: AbstractControl;
    latitude: AbstractControl;
    longitude: AbstractControl;
    constructor(private fuelService: FuelService, private route: ActivatedRoute, private router: Router, fb: FormBuilder,private _flashMessagesService: FlashMessagesService) {
        this.activePageTitle = 'Update Fuel Station';
         this.fuelUpdatedResponse = '';
        this.isMatchedConfirmPassword = false;
        this.formValidate = false;
        this.complexForm = fb.group({
            'fuelName': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ]+')])],
            'address': [null, Validators.compose([Validators.required])],
            'latitude': [null, Validators.compose([Validators.required])],
            'longitude': [null, Validators.compose([Validators.required])]

        })
        this.fuelName = this.complexForm.controls['fuelName'];
        this.address = this.complexForm.controls['address'];
        this.latitude = this.complexForm.controls['latitude'];
        this.longitude = this.complexForm.controls['longitude'];

    }


    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            console.info("Getting food deails by Id started");
            if (params['Id'] !== undefined) {
                let Id: string = +params['Id'] + "";
                this.navigated = true;
                this.fuelService.getFuelDetailsByID(Id).then((fuel) => {
                    this.fuel = fuel;
                    L.mapbox.accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
                    this.map = L.mapbox.map('update_addressMap', 'mapbox.streets')
                        .setView([this.fuel.latitude, this.fuel.longitude], 12);
                    var marker = new L.Marker(new L.LatLng(this.fuel.latitude, this.fuel.longitude)).addTo(this.map);
                    var newMarkerGroup = new L.LayerGroup();
                    var newMarker;
                    this.map.doubleClickZoom.disable();
                    this.map.on('click', (e) => {
                        var latitude = e.latlng.lat;
                        var longitude = e.latlng.lng;
                        if (newMarker != undefined) {
                            this.map.removeLayer(newMarker);
                        }
                        newMarker = new L.marker(e.latlng).addTo(this.map);
                        newMarker.on('click', (e) => {
                            $('#add_fuelstation_Modal').modal('show');
                            $('.add_fuelstation').on('click', () => {
                                $('#add_fuelstation_Modal').modal('hide');
                                this.fuel.latitude = e.latlng.lat;
                                this.fuel.longitude = e.latlng.lng;
                                this.map.removeLayer(marker);
                            });
                        });
                    });
                });
                console.info("Getting food deails by Id ended");
            } else {
                this.navigated = false;
            }
        });
    }

    onchange(eventChange: any, food: any) {
        food.latitude = '';
        food.longitude = '';
        this.fuelService.getFuelAddress(food.address).subscribe(response => {
            this.fuelAddressList = new Array(response.features.length);
            console.log(response.features[0].place_name)
            if (response.features.length != 0) {
                for (let i = 0; i < response.features.length; i++) {
                    this.fuelAddressList[i] = {
                        value: response.features[i].place_name,
                        lat: response.features[i].center[1],
                        lang: response.features[i].center[0]
                    };
                }
            }
        });
    }

    public fuelItemSelected(fuelvalue: any) {
        console.info("fuel Item Selected ");
        this.fuelAddressList.length = null;
        this.fuel.address = fuelvalue.value;
        this.map.panTo(new L.LatLng(fuelvalue.lat, fuelvalue.lang));
    }

    /**
     * This method saves updated driver details
     */
    submitForm(value: any) {
        if (this.complexForm.valid == true && this.fuel.name != '' && this.fuel.address != '' && this.fuel.latitude != null && this.fuel.longitude != null) {
            console.info("Fuel Station update started ");
            this.fuelService
                .updateFuel(this.fuel)
                .then(response => {
                if (response.message == "Success") {
                    this._flashMessagesService.show('Fuel Station Updated Successfully', { cssClass: 'alert-success' })
                    this.fuelUpdatedResponse = response.message
                    let that = this;
                    setTimeout(function () {
                        that.router.navigate(['/fuel']);
                    }, 1000);
                } else {
                    this._flashMessagesService.show('Error in Fuel Station Updation', { cssClass: 'alert-danger' })
                }
            })
                .catch(error => this.error = error);
        }
        else {
            console.info("update fuel form submission failure.....");
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }


    /**
    * This method navigates the screen to back
    */
    public goBack(): void {
        let link = ['/fuel'];
        this.router.navigate(link);
    }
    /**
     * This method navigates the screen to home Page (dashboard)
     */
    public goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }


}
