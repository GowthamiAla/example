import { Component, Type, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ILoad } from '../../models/load';
import { Load } from '../../models/load.data';
import { LoadsService } from '../../services/load.service';
import { FlashMessagesService } from 'angular2-flash-messages';

//import { Select2OptionData } from 'ng2-select2';

declare var $;

/**
 * This component adds new Load
 */
@Component({
    template: require('./load.add.component.html'),
    providers: [LoadsService]
})

export class LoadAddComponent {

    public loadAddSuccess;
    public loadAddFailure;

    public driverNameListData;
    public dealerNameListData;
    public driversOptions;
    public dealerOptions;
    public skiDropsMismatched: boolean;

    @Output() close = new EventEmitter();
    isMatchedConfirmPassword: boolean;
    public activePageTitle: string;
    public loadAddResponse: String;
    public error: String;
    navigated = true; // true if navigated here
    private load: ILoad = new Load('', '', '', '', '', '', '', null, null, null, null, '');

    complexForm: FormGroup;
    formValidate: boolean;

    loadNum: AbstractControl;

    skidDrops: AbstractControl;

    trkNum: AbstractControl;

    constructor(private router: Router, private loadService: LoadsService, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {
        this.skiDropsMismatched = true;

        this.driversOptions = {
            theme: 'classic',
            closeOnSelect: true,
        }
        this.dealerOptions = {
            multiple: true,
            theme: 'classic',
            closeOnSelect: true,
            placeholder: {
                id: '-1', // the value of the option
                text: "Select a Dealer"
            }

        }

        this.activePageTitle = "Add Load";
        this.load.loadHighValue = 0;
        this.load.loadHighPriority = 0;

        this.isMatchedConfirmPassword = false;
        this.formValidate = false;
        this.complexForm = fb.group({
            'loadNum': [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],

            'skidDrops': [null, Validators.compose([Validators.required, Validators.pattern('^[1-9]*$')])],

            'trkNum': [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern('[a-z A-Z 0-9]+')])]

        })
        this.loadNum = this.complexForm.controls['loadNum'];

        this.skidDrops = this.complexForm.controls['skidDrops'];

        this.trkNum = this.complexForm.controls['trkNum'];


    }


    ngOnInit() {

        this.driverNameDetails();
        this.dealerNameDetails();
        $.ajaxSetup({ headers: { "X-Auth-Token": localStorage.getItem('token') } })


    }
    public driverNameDetails() {
        this.loadService.getDriverNameList().subscribe(response => {
            let driverNameDetailsList = new Array(response.length);
            for (let i = 0; i < response.length; i++) {
                if (i == 0) {
                    driverNameDetailsList[i] = {
                        id: '0',
                        text: 'Select a Driver'
                    };
                } else {
                    driverNameDetailsList[i] = {
                        id: response[i].empID,
                        text: response[i].firstName
                    };
                }
            }
            this.driverNameListData = driverNameDetailsList.slice(0);
        }, error => console.error(error),
            () => console.info('Getting  driverMailId complete in LoadAddComponent'));
    }
    public dealerNameDetails() {
        this.loadService.getDealerNameList().subscribe(response => {
            let dealerNameDetailsList = new Array(response.length);
            for (let i = 0; i < response.length; i++) {
                dealerNameDetailsList[i] = {
                    id: response[i].dealerCd + '_' + response[i].shipId + '_' + response[i].affil,
                    text: response[i].desc
                };
            }
            this.dealerNameListData = dealerNameDetailsList.slice(0);
        }, error => console.error(error),
            () => console.info('Getting  driverMailId complete in LoadAddComponent'));
    }


    /**
    * This method gets driverMailId.
    */
    public onSelectedDriverMailId(item) {
        if (item != 0) {
            this.load.empID = item;
            this.loadService.getDriverMilIdDetails(item).subscribe(response => {
                this.load.driverMailId = response;
            }, error => console.error(error),
                () => console.info('Getting  driverMailId complete in LoadAddComponent'));
        }
    }

    /**
        * This method gets dealerAddress
        */
    public onSelectedDealerAddress(item) {
        if (item != 0) {
            this.loadService.getDealerAddresses(item).subscribe(response => {
                this.load.dealerAddress = response;
                this.load.dealercds = item;
            }, error => console.error(error),
                () => console.info('Getting dealerAddress completed in LoadAddComponent'));
        }
    }

    onDealersDeselected(item) {
        console.info('Deselected: ' + item.value + ', ' + item.label);
    }

    public dealerModelChanged(value: any): void {
        if (this.load.dealercds != null) {
            if (this.load.dealercds.length != Number(this.load.skidDrops)) {
                this.skiDropsMismatched = false;
            }
            else
                this.skiDropsMismatched = true;
        }
    }
    /**
    * This method sets submitted property to true to hide form in view .
    */
    submitForm(value: any) {
        if (this.load.dealercds != null) {
            if (this.load.dealercds.length != Number(this.load.skidDrops)) {
                this.skiDropsMismatched = false;
            } else
                this.skiDropsMismatched = true;
        }

        if (this.complexForm.valid == true && this.load.loadNum != '' && this.load.empID != '' && this.load.skidDrops != '' && this.load.dealercds != null && this.load.trkNum != null && this.load.dealercds.length == Number(this.load.skidDrops)) {
            this.load.empID = this.load.empID.toString();
            this.load.skidDrops = this.load.skidDrops.toString();
            console.info("add dealer form submission started.....");
            this.load.loadHighValue = Number(this.load.loadHighValue);
            this.load.loadHighPriority = Number(this.load.loadHighPriority);
            this.loadService
                .validateTruckNo(this.load)
                .then(response => {
                    if (response.status == "SUCCESS") {
                        this.loadService.addLoad(this.load).then(response => {
                            if (response.status == "SUCCESS") {

                                this.loadAddSuccess = response.message;

                                this.loadAddResponse = response.message
                                let that = this;
                                setTimeout(() => {
                                    this.loadAddSuccess = '';
                                    that.router.navigate(['/loads']);
                                }, 2000);
                            } else {
                                this.loadAddFailure = response.message
                                let that = this;
                                setTimeout(() => {
                                    this.loadAddFailure = '';
                                }, 2000);


                            }
                        })
                            .catch(error => this.error = error);
                    } else {

                         this.loadAddFailure='Truck Number Already Exists';
                    }
                })
        }
        else {
            console.info("add load form submission failure.....");
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }
    /**
     * This method navigates screen to previous page
     */
    goBack(): void {
        this.close.emit();
        if (this.navigated) { window.history.back(); }

    }
    /**
   * This method navigates screen to dash board page
   */
    goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
    }


    /**
      * This Method gets   VIN Number based on select drop down
      */
    public driverChanged(e: any): void {
        this.onSelectedDriverMailId(e.value)

    }

    ngAfterViewInit() {
        $('#driversList').on('change', (eventValues) => {
            let widgetRolesSelections = $(eventValues.target).val();
            this.onSelectedDriverMailId(widgetRolesSelections)
            console.log(widgetRolesSelections);
        });



        $('#dealersList').on('change', (eventValues) => {
            let widgetRolesSelections = $(eventValues.target).val();

            if (widgetRolesSelections != null) {
                if (this.load.skidDrops != widgetRolesSelections.length) {
                    this.skiDropsMismatched = false;
                } else {
                    this.skiDropsMismatched = true;
                }

                this.onSelectedDealerAddress(widgetRolesSelections)
            }


            // this.onSelectedDriverMailId(widgetRolesSelections)
            console.log(widgetRolesSelections);
        });
    }

    /**
       * This Method gets   loadNumber based on select drop down
       */
    public dealerChanged(e: any): void {
        if (e.value != null) {
            if (this.load.skidDrops != e.value.length) {
                this.skiDropsMismatched = false;
            } else {
                this.skiDropsMismatched = true;
            }

            this.onSelectedDealerAddress(e.value)
        }

    }





}
