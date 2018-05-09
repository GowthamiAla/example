import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { LoadsService } from '../../services/load.service';
import { ILoad } from '../../models/load';
import { Load } from '../../models/load.data';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
//import { Select2OptionData } from 'ng2-select2';
import { FlashMessagesService } from 'angular2-flash-messages';

declare var $;
/**
 * This component deals with loads update operation
 */
@Component({
    template: require('./load.update.component.html'),
    providers: [LoadsService]
})
export class LoadUpdateComponent implements OnInit {

    public loadUpdateSuccess;
    public loadUpdateFailure;

    public updateDriverNameListData;
    public updateDealerNameListData;
    public updateDriversOptions;
    public updateDealerOptions;
    public selectedDriverName: string;
    public selectedDealerName: string;
    public skiDropsMismatched: boolean;
    public selectedDealerList: Array<string> = [];
    public loadUpdateResponse: String;
    public error: String;
    public loadList: ILoad[];
    @Input() load: ILoad;
    @Output() close = new EventEmitter();

    isMatchedConfirmPassword: boolean;
    public activePageTitle: string;

    navigated = true;
    public driversList = [];
    public dealersList = [];
    complexForm: FormGroup;
    formValidate: boolean;

    loadNum: AbstractControl;

    skidDrops: AbstractControl;

    trkNum: AbstractControl;
    constructor(private router: Router, private route: ActivatedRoute, private loadSevrice: LoadsService, fb: FormBuilder, private _flashMessagesService: FlashMessagesService) {
        this.activePageTitle = "Update Load";
        this.loadUpdateResponse = '';
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

        this.updateDriversOptions = {
            closeOnSelect: true
        }

        this.updateDealerOptions = {
            multiple: true,

            closeOnSelect: true

        }

    }
    ngOnInit(): void {



        this.route.params.forEach((params: Params) => {
            console.info("Getting Load deails by Load Number started");
            if (params['loadNum'] !== undefined) {
                let loadNum: string = +params['loadNum'] + "";
                this.navigated = true;
                this.loadSevrice.getLoadDetailsByLoadNum(loadNum).toPromise().then(loads => {
                    this.load = loads;
                    this.driverNameDetails(loads.empID);

                    console.log("loads.dealerCdList" + loads.dealerCdList)
                    this.dealerNameDetails(loads.dealerCdList);



                    let dealerListArray = new Array(loads.dealerCdList.length);

                    for (let k = 0; k < loads.dealerCdList.length; k++) {


                        this.selectedDealerName = loads.dealerCdList[k];

                    }



                    console.info(JSON.stringify(this.load.dealerCdList))
                });
                console.info("Getting Load  deails by Loadnumber ended");
            } else {
                this.navigated = false;

            }
        });

    }




    public driverNameDetails(driverID: any) {
        this.loadSevrice.getDriverNameList().subscribe(response => {
            let driverNameDetailsList = new Array(response.length);
            for (let i = 0; i < response.length; i++) {
                driverNameDetailsList[i] = {
                    id: response[i].empID,
                    text: response[i].firstName
                };
                if (driverID == response[i].empID) {
                    this.selectedDriverName = response[i].empID;
                    let dummyData = [];
                    dummyData.push({
                        id: response[i].empID,
                        text: response[i].firstName
                    });
                    // dummyData.push(response[i].firstName)
                    $('#driversList').val(dummyData).trigger('change');

                    console.log("dummyData" + JSON.stringify(dummyData))


                    // $('#widgetUserRoleMultiple').on('change', (eventValues) => {
                    //     this.widgetRolesSelections = $(eventValues.target).val();
                    //     if (this.widgetRolesSelections === null) {
                    //         this.widgetRolesSelections = [];
                    //     }
                    //     console.log(this.widgetRolesSelections);
                    // });


                }

            }
            this.updateDriverNameListData = driverNameDetailsList.slice(0);
        }, error => console.error(error),
            () => console.info('Getting  driverMailId complete in LoadAddComponent'));
    }


    public dealerNameDetails(dealerCD: any[]) {
        let dealersList = [];
        this.loadSevrice.getDealerNameList().subscribe(response => {
            let dealerNameDetailsList = new Array(response.length);
            for (let i = 0; i < response.length; i++) {
                dealerNameDetailsList[i] = {
                    id: response[i].dealerCd + '_' + response[i].shipId + '_' + response[i].affil,
                    text: response[i].desc
                };
                for (let k = 0; k < dealerCD.length; k++) {
                    if (dealerCD[k] == response[i].dealerCd + '_' + response[i].shipId + '_' + response[i].affil) {
                        dealersList.push(response[i].dealerCd + '_' + response[i].shipId + '_' + response[i].affil);

                        $('#driversList').val(dealersList).trigger('change');


                    }
                }
            }

            this.updateDealerNameListData = dealerNameDetailsList.slice(0);
            this.selectedDealerList = dealersList;



        }, error => console.error(error),
            () => console.info('Getting  driverMailId complete in LoadAddComponent'));
    }

    /**
 * This method gets driverMailId.
 */
    public getDriverMailId(item) {
        this.loadSevrice.getDriverMilIdDetails(item).subscribe(response => {
            this.load.email = response;
        }, error => console.error(error),
            () => console.info('Getting  driverMailId complete in LoadUpdateComponent'));
    }

    public onSelectedDriverMailId(item) {
        if (item) {
            this.loadSevrice.getDriverMilIdDetails(item).subscribe(response => {
                this.load.email = response;
            }, error => console.error(error),
                () => console.info('Getting  driverMailId complete in LoadUpdateComponent'));
        }
    }
    /**
            * This method gets dealerAddress
            */
    public onSelectedDealerAddress(item) {
        if (item) {
            this.loadSevrice.getDealerAddresses(item).subscribe(response => {
                this.load.dealerAddress = response;

                this.load.dealercds = item;
            }, error => console.error(error),
                () => console.info('Getting dealerAddress completed in LoadUpdateComponent'));
        }
    }
    onDealersDeselected(item) {
        console.info('Deselected: ' + item.value + ', ' + item.label);
    }


    /**
    * This method sets submitted property to true to hide form in view .
    */
    submitForm(value: any) {

        if (this.complexForm.valid == true && this.load.loadNum != '' && this.load.empID != '' && this.load.skidDrops != '' && this.load.dealerCdList != null && this.load.trkNum != null && this.load.dealercds.length == Number(this.load.skidDrops)) {
            this.load.skidDrops = this.load.skidDrops.toString();
            this.load.empID = this.load.empID.toString();
            this.load.loadHighValue = Number(this.load.loadHighValue);
            this.load.loadHighPriority = Number(this.load.loadHighPriority);
            this.load.dealerCdList.concat(this.load.dealercds)
            for (let i = 0; i < this.load.dealercds.length; i++) {
                this.load.dealerCdList.push(this.load.dealercds[i])
            }
            this.load.dealerCdList = this.load.dealerCdList.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            })

            if (this.load.dealercds != null) {
                if (this.load.dealercds.length != Number(this.load.skidDrops)) {
                    this.skiDropsMismatched = false;
                } else
                    this.skiDropsMismatched = true;
            }
            console.info("update load form submission started.....");
            this.loadSevrice
                .validateTruckNo(this.load)
                .then(response => {
                    if (response.status == "SUCCESS") {
                        this.loadSevrice.updateLoad(this.load).then(response => {
                            if (response.status == "SUCCESS") {
                                this.loadSevrice = response.message
                                this.loadUpdateSuccess = response.message;

                                setTimeout(() => {
                                    this.loadUpdateSuccess = ''
                                    this.router.navigate(['/loads']);
                                }, 2000);
                            } else {
                                this.loadUpdateFailure = response.message;

                                setTimeout(() => {
                                    this.loadUpdateFailure = ''
                                }, 2000);
                            }
                        })
                            .catch(error => this.error = error);
                    } else {
                        this.loadUpdateFailure = "Truck Number Already Exists";
                    }
                })
        }
        else {
            console.info("update load form submission failure.....");
            this.formValidate = true;
            this.complexForm != this.complexForm;
        }
    }
    goBack(savedLoad: ILoad = null): void {
        this.close.emit(savedLoad);
        if (this.navigated) { window.history.back(); }

    }
    goToHome() {
        let link = ['/dashboard'];
        this.router.navigate(link);
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
      * This Method gets   VIN Number based on select drop down
      */
    public updateDriverChanged(e: any): void {
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
    public updateDealerChanged(e: any): void {
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
