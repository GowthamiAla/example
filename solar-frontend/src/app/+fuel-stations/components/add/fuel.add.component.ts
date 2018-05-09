import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';


import { IFuel } from '../../models/fuel';
import { Fuel } from '../../models/fuel.data';
import { FuelService } from '../../services/fuel.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { endponitConfig } from '../../../../environments/endpoints';


/** Global declarions for accessing google and $ value **/
declare var $: any;
declare var check: any;
declare var L: any;
/**
 * This component adds the new user details
 */

@Component({

    template: require('./fuel.add.component.html'),
    providers: [FuelService]
})
export class FuelAddComponent implements OnInit {

    public activePageTitle: string;
    @Output() close = new EventEmitter();
    public fuelAddressList: any[];
    isMatchedConfirmPassword: boolean;
    navigated = true; // true if navigated here
    private fuel: IFuel = new Fuel(null, "", "", null, null, null);
    public fuelList: IFuel[];
    public map;
    public marker;
    public fuelAddResponse: String;
    public error:String;
    complexForm: FormGroup;
    formValidate: boolean;
    fuelName: AbstractControl;
    address: AbstractControl;
    latitude: AbstractControl;
    longitude: AbstractControl;
    constructor(private router: Router, private fuelService: FuelService, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {
        this.fuelAddResponse = '';
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
    /* Maps
        */
    ngOnInit() {

        this.activePageTitle = 'Add Fuel Station'
        L.mapbox.accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
        this.map = L.mapbox.map('update_addressMap', 'mapbox.streets').setView([33.891315, -84.255382], 9);
        var newMarkerGroup = new L.LayerGroup();
        var newMarker;
        this.map.doubleClickZoom.disable();
        this.map.on('click', (e, fuel) => {
            var latitude = e.latlng.lat;
            var longitude = e.latlng.lng;

            if (newMarker != undefined) {
                this.map.removeLayer(newMarker);
            }
            newMarker = new L.marker(e.latlng).addTo(this.map);
            newMarker.on('click', (e, fuel) => {
                $('#add_fuelstation_Modal').modal('show');
                $('.add_fuelstation').on('click', fuel => {
                    $('#add_fuelstation_Modal').modal('hide');
                    this.fuel.latitude = e.latlng.lat;
                    this.fuel.longitude = e.latlng.lng;

                });
            });
        });
    }

    onchange(eventChange: any, food: any) {
        food.latitude = '';
        food.longitude = '';
        this.fuelService.getFuelAddress(food.address).subscribe(response => {
            this.fuelAddressList = new Array(response.features.length);
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
        console.info("fuel Item Selected.");
        this.fuelAddressList.length = null;
        this.fuel.address = fuelvalue.value;
        this.map.panTo(new L.LatLng(fuelvalue.lat, fuelvalue.lang));
    }

    /**
     * This method saves updated driver details
     */
    submitForm(value: IFuel) {
        if (this.complexForm.valid == true && this.fuel.name != '' && this.fuel.address != '' && this.fuel.latitude != null && this.fuel.longitude != null) {
            console.info("Fueal Station added started ");
            
                this.fuelService.addFuel(this.fuel).then(response => {
                if (response.message == "Success") {
                    this._flashMessagesService.show('Fuel Station Created Successfully', { cssClass: 'alert-success' })
                    this.fuelAddResponse = response.message
                    let that = this;
                    setTimeout(function () {
                        that.router.navigate(['/fuel']);
                    }, 1000);
                } else {
                    this._flashMessagesService.show('Error in Fuel Station Creation', { cssClass: 'alert-danger' })
                }
            })
                .catch(error => this.error = error);                       
        }
        else {
            console.info("added fuel form submission failure.....");
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }
    /**
     * This method navigates screen to previous page
   */
    goBack(): void {
        let link = ['/fuel'];
        this.router.navigate(link);
    }
    /**
   * This method navigates screen to dash board page
   */
    goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }
}
