import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IFood } from '../../models/food';
import { Food } from '../../models/food.data';
import { FoodService } from '../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { endponitConfig } from '../../../../environments/endpoints';


declare var $: any;
declare var check: any;
declare var L: any;

/**
 * This component adds the new user details
 */

@Component({
    template: require('./food.add.component.html'),
    providers: [FoodService]
})
export class FoodAddComponent implements OnInit {
    public foodAddressList: any[];
    public activePageTitle: string;
    public foodAddResponse: String;
    public error:String;
    @Output() close = new EventEmitter();
    isMatchedConfirmPassword: boolean;
    navigated = true; // true if navigated here
    public food: IFood = new Food(null, "", "", null, null, null);
    public foodList: IFood[];
    public map;
    public marker;
    complexForm: FormGroup;
    formValidate: boolean;
    foodName: AbstractControl;
    address: AbstractControl;
    latitude: AbstractControl;
    longitude: AbstractControl;

    constructor(private router: Router, private foodService: FoodService, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {

        this.isMatchedConfirmPassword = false;
        this.foodAddResponse = '';
        this.formValidate = false;
        this.complexForm = fb.group({
            'foodName': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ]+')])],
            'address': [null, Validators.compose([Validators.required])],
            'latitude': [null, Validators.compose([Validators.required])],
            'longitude': [null, Validators.compose([Validators.required])]
        })
        this.foodName = this.complexForm.controls['foodName'];
        this.address = this.complexForm.controls['address'];
        this.latitude = this.complexForm.controls['latitude'];
        this.longitude = this.complexForm.controls['longitude'];
    }

    /* Maps
    */

    ngOnInit() {
        this.activePageTitle = 'Add Food Court';
        L.mapbox.accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
        this.map = L.mapbox.map('update_addressMap', 'mapbox.streets').setView([33.891315, -84.255382], 9);
        var newMarkerGroup = new L.LayerGroup();
        var newMarker;
        this.map.doubleClickZoom.disable();
        this.map.on('click', (e, food) => {
            var latitude = e.latlng.lat;
            var longitude = e.latlng.lng;

            if (newMarker != undefined) {
                this.map.removeLayer(newMarker);
            }
            newMarker = new L.marker(e.latlng).addTo(this.map);
            newMarker.on('click', (e, food) => {
                $('#add_foodcourt_Modal').modal('show');
                $('.add_foodcourt').on('click', food => {
                    $('#add_foodcourt_Modal').modal('hide');
                    this.food.latitude = e.latlng.lat;
                    this.food.longitude = e.latlng.lng;
                });
            });
        });
    }
    onchange(eventChange: any, food: any) {
        food.latitude = '';
        food.longitude = '';
        this.foodService.getFoodAddress(food.address).subscribe(response => {
            this.foodAddressList = new Array(response.features.length);
            if (response.features.length != 0) {
                for (let i = 0; i < response.features.length; i++) {
                    this.foodAddressList[i] = {
                        value: response.features[i].place_name,
                        lat: response.features[i].center[1],
                        lang: response.features[i].center[0]
                    };
                }
            }
        });
    }
    /**
      * This method food Item Selected
      */
    public foodItemSelected(foodvalue: any) {
        console.info("food Item Selected");
        this.foodAddressList.length = null;
        this.food.address = foodvalue.value;
        this.map.panTo(new L.LatLng(foodvalue.lat, foodvalue.lang));
    }

    /**
     * This method saves updated driver details
     */
    submitForm(value: IFood) {
        if (this.complexForm.valid == true && this.food.name != '' && this.food.address != '' && this.food.latitude != null && this.food.longitude != null) {
            console.info("Food Court added started ");

            this.foodService.addFood(this.food).then(response => {
                if (response.message == "Success") {
                    this._flashMessagesService.show('Food Court Created Successfully', { cssClass: 'alert-success' })
                    this.foodAddResponse = response.message
                    let that = this;
                    setTimeout(function () {
                        that.router.navigate(['/food']);
                    }, 1000);
                } else {
                    this._flashMessagesService.show('Error in Food Court Creation', { cssClass: 'alert-danger' })
                }
            })
                .catch(error => this.error = error);
        }
        else {
            console.info("added food form submission failure.....");
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }
    /**
     * This method navigates screen to previous page
    */
    goBack(): void {
        let link = ['/food'];
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
