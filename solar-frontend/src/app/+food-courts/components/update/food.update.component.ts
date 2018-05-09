import { Component, EventEmitter, Type, Input, OnInit, Output, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { IFood } from '../../models/food';
import { Food } from '../../models/food.data';
import { FoodService } from '../../services/food.service';
import { ModalModule } from "ng2-modal";
import { FlashMessagesService } from 'angular2-flash-messages';
import { endponitConfig } from '../../../../environments/endpoints';

declare var $: any;
declare var check: any;
declare var L: any;

/**
 * This component deals with Food update operation
 */

@Component({
    template: require('./food.update.component.html'),
    providers: [FoodService, FormBuilder]
})
export class FoodUpdateComponent implements OnInit {
    public activePageTitle: string;
    public foodAddressList: any[];
    public foodList: IFood[];
    public foodAddResponse: String;

    public food: IFood;
    @Output() close = new EventEmitter();
    public counterChange = new EventEmitter();
    public map;
    navigated = true;
    error: any;
    isMatchedConfirmPassword: boolean;
    complexForm: FormGroup;
    formValidate: boolean;
    foodName: AbstractControl;
    address: AbstractControl;
    latitude: AbstractControl;
    longitude: AbstractControl;


    constructor(private foodService: FoodService, private route: ActivatedRoute, private router: Router, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {
        this.isMatchedConfirmPassword = false;
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

    ngOnInit() {
        this.activePageTitle = 'Update Food Court';
        this.route.params.forEach((params: Params) => {
            console.info("Getting food deails by Id started");
            if (params['Id'] !== undefined) {
                let Id: string = +params['Id'] + "";
                this.navigated = true;
                this.foodService.getFoodDetailsByID(Id).then((food) => {
                    this.food = food;
                    L.mapbox.accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
                    this.map = L.mapbox.map('update_addressMap', 'mapbox.streets')
                        .setView([this.food.latitude, this.food.longitude], 12);

                    var marker = new L.Marker(new L.LatLng(this.food.latitude, this.food.longitude)).addTo(this.map);
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
                            $('#add_foodcourt_Modal').modal('show');
                            $('.add_foodcourt').on('click', () => {
                                $('#add_foodcourt_Modal').modal('hide');
                                this.food.latitude = e.latlng.lat;
                                this.food.longitude = e.latlng.lng;
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
        this.foodService.getFoodAddress(food.address).subscribe(response => {
            this.foodAddressList = new Array(response.features.length);
            console.log(response.features[0].place_name)
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

    public foodItemSelected(foodvalue: any) {
        this.foodAddressList.length = null;
        this.food.address = foodvalue.value;
        this.map.panTo(new L.LatLng(foodvalue.lat, foodvalue.lang));
    }

    /**
     * This method saves updated driver details
     */
    submitForm(value: any) {
        if (this.complexForm.valid == true && this.food.name != '' && this.food.address != '' && this.food.latitude != null && this.food.longitude != null) {
            console.info("Food Station update started ");

            this.foodService
                .updateFood(this.food)
                .then(response => {
                    if (response.message == "Success") {
                        this._flashMessagesService.show('Food Court Updated Successfully', { cssClass: 'alert-success' })
                        this.foodAddResponse = response.message
                        let that = this;
                        setTimeout(function () {
                            that.router.navigate(['/food']);
                        }, 1000);
                    } else {
                        this._flashMessagesService.show('Error in Food Court Updation', { cssClass: 'alert-danger' })
                    }
                })
                .catch(error => this.error = error);
        }
        else {
            console.error("update Food form submission failure.....");
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }

    /**
    * This method navigates the screen to back
    */
    public goBack() {
        let link = ['/food'];
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
