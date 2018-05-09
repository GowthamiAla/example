import { Component, OnInit } from '@angular/core';
import { Widget, UserRole } from '../model/widget';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { WidgetService } from '../service/widget.service';

declare var $: any;

/*
 This component adds the widget 
*/
@Component({
    selector: 'widget-add',
    templateUrl: './widget.add.component.html',

})
export class WidgetAddComponent {
    public userRole: UserRole[];
    public widget = new Widget(null, "", " ", this.userRole);
    public widgetError;
    public widgetUserRolesOptions: Array<userRoles> = [];
    constructor(private widgetService: WidgetService, private router: Router, private location: Location) {
        this.getAllUserRoles();
    }

    public widgetRolesSelections: Array<string> = [];
    /*
    * This method adds the widget
    */
    ngAfterViewInit() {
        $('#widgetUserRoleMultiple').on('change', (eventValues) => {
            this.widgetRolesSelections = $(eventValues.target).val();
            if (this.widgetRolesSelections === null) {
                this.widgetRolesSelections = [];
            }
            console.log(this.widgetRolesSelections);
        });
    }
    /*
       * This method get all user roles
       */
    public getAllUserRoles() {
        this.widgetService.getAllRoles().subscribe(data => {
            if (data.error == null) {
                this.widgetUserRolesOptions = data.data;
            }
        }, error => {

        })
    }

    widgetContentStatus: boolean = false;
    // roleData = new Array();
    public addWidget(widgetName, widgetRoles) {
        let roleData = new Array();
        if (widgetRoles) {
            widgetRoles.forEach(element => {
                this.widgetUserRolesOptions.forEach(user => {
                    if (user.name == element) {
                        roleData.push({ 'name': user.name, 'id': user.id })
                    }
                })
            });
        }
        try {
            let data = {
                "name": widgetName,
                "content": "",
                "role": roleData
            }
            this.widgetContentStatus = false;
            this.widgetService.addWidget(data).subscribe(
                data => {
                    if (data.error == null) {
                        this.widgetError = '';
                        let link = ['/admin/widget/list', { data: "ASuccess" }];
                        this.router.navigate(link);
                    } else {
                        this.widgetError = data.error.message
                        setTimeout(() => {
                            this.widgetError = '';
                        }, 4000);
                    }

                },
                error => {
                    console.log("Error : " + error);
                    this.widgetContentStatus = true;
                });



        } catch (error) {
            console.debug("widget add failed", error);
            this.widgetContentStatus = true;
        }

    }
    /*
      * This method takes back to previous page
      */
    public goBack() {
        let link = ['/admin/widget/list'];
        this.router.navigate(link);
    }

}

export class userRoles {
    constructor(
        public id: number,
        public name: string
    ) {
    }

}