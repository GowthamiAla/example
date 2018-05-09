import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoadServices } from '../loads.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'load-list',
    templateUrl: './loadList.component.html',
    styles: [` .widgetBody {
        padding-top: 20px !important;
    }

    .headerRibbon {
        color: #BBB!important;
    }

    .load-subtitle>b {
        color: #3276b1;
    }

    .load-title {
        margin-left: 1%;
    }

    .load-view {
        margin-left: 1%;
    }

    .footer-view-btn {
        color: rgb(203, 82, 48);
    }

    .load-header {
        background-color: rgb(76, 79, 83);
        color: white
    }

    @media (max-width: 970px) {
        .panel-footer {
            text-align: center
        }
    }

    .load.panel-footer {
        background-color: white
    }

    `]
})

export class LoadListComponent {
    public loadList: any;
    public loadListdataError: any;
    public loadAcceptedDetails: any = [];
    public timeandDistanceInfo: any;

    constructor(private route: Router, private loadservice: LoadServices) { }
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        // load data
        this.loadListDetails();
    }

    loadListDetails() {
        const driverId = localStorage.getItem('driverData');
        this.loadservice.getAllLoads(driverId).subscribe(
            data => {
                if (data.data !== null) {
                    this.loadList = data.data;
                    localStorage.setItem('loadDetails', JSON.stringify(this.loadList));
                    for (let i = 0; i < this.loadList.length; i++) {
                        if (this.loadList[i].apptStatNbr.id === 4) {
                            this.loadAcceptedDetails.push(data.data[i].apptNbr);
                        }
                    }
                    const loadAcceptedNumber = localStorage.setItem('loadAcceptedNumber', this.loadAcceptedDetails);
                } else {
                    this.loadListdataError = data.error.message;
                }
            },
            error => {
                console.log(JSON.stringify(error))
                this.loadListdataError = error;
            });
    }

    loadDetails(loadNumber: any) {
        this.route.navigate(['/loads/loadDetails', loadNumber])
    }

}
