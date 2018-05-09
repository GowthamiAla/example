import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class WidgetAddComponent implements AfterViewInit {
    public userRole: UserRole[];
    public widget = new Widget(null, '', '', this.userRole);
    public widgetError;
    public widgetRolesSelections: Array<string> = [];
    public widgetUserRolesOptions: Array<userRoles> = [];
    widgetContentStatus = false;

    constructor(private widgetService: WidgetService, private router: Router, private location: Location) {
        this.getAllUserRoles();
    }


    /*
    * This method adds the widget
    */
    ngAfterViewInit() {
        $('#widgetUserRoleMultiple').on('change', (eventValues) => {
            this.widgetRolesSelections = $(eventValues.target).val();
            if (this.widgetRolesSelections === null) {
                this.widgetRolesSelections = [];
            }
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


    // roleData = new Array();
    public addWidget(widgetName, widgetRoles) {
        const roleData = new Array();
        if (widgetRoles) {
            widgetRoles.forEach(element => {
                this.widgetUserRolesOptions.forEach(user => {
                    if (user.name === element) {
                        roleData.push({ 'name': user.name, 'id': user.id })
                    }
                })
            });
        }
        try {
            const data = {
                'name': widgetName,
                'content': '',
                'role': roleData
            }
            this.widgetContentStatus = false;
            this.widgetService.addWidget(data).subscribe(
                josndata => {
                    if (josndata.error == null) {
                        this.widgetError = '';
                        const link = ['/admin/widget/list', { data: 'ASuccess' }];
                        this.router.navigate(link);
                    } else {
                        this.widgetError = josndata.error.message
                        setTimeout(() => {
                            this.widgetError = '';
                        }, 4000);
                    }

                },
                error => {
                    this.widgetContentStatus = true;
                });



        } catch (error) {
            console.log('widget add failed', error);
            this.widgetContentStatus = true;
        }

    }
    /*
      * This method takes back to previous page
      */
    public goBack() {
        const link = ['/admin/widget/list'];
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
