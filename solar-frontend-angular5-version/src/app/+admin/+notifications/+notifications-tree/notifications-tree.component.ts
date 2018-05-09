import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { NotificationService } from '../notifications.service'
import { endponitConfig } from '../../../environments/endpoints';
 import { Router } from '@angular/router';

import { ActivitiesService } from '../../../shared/layout/header/activities/activities.service';


import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';

import * as _ from 'lodash';
import { AfterContentInit, AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';


declare var $: any;

@Component({
    selector: 'notification-tree-views',
    templateUrl: './notifications-tree.component.html',
    providers: [NotificationService],
    styles: [`ul.asTree {
        list-style-type: none;
        padding: 0;
        margin: 0;
        text-indent: 1em;
    }

    ul.asTree ul {
        display: none;
        list-style-type: none;
    }

    ul.asTree li {
        /*lets us position the label's ::before*/
        position: relative;
    }

    ul.asTree label {
        cursor: pointer;
    }

    ul.asTree label:hover {
        box-shadow: 0 0 5px 0 rgba(128, 155, 200, 0.5) inset;
    }

    ul.asTree label::before {
        position: absolute;
        left: -1em;
        top: -2px;
    }

    ul.asTree input:checked+label::before {}

    ul.asTree input:checked+label+ul {
        display: block;
    }

    .tooglePosition {
        float: left;
    }

    `],
})
export class NotificationsTreeComponent implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked {
    public selectEmailTemplate = false;
    public selectNotificationTemplate = false;
    public channelLoginError;
    public stompClient;
    public menuCollapse: boolean;
    buttonEnable = false;
    grouped;
    moduleNames = [];
    templatesNames: EmailTemplateModel[];
    emailTemplate: EmailTemplateModel;
    notificationTemplate: NotificationTemplateModel;

    public userRolesArray: userRoles;

    public jsonData;
    public complexForm: FormGroup;
    public module: AbstractControl;
    public event: AbstractControl;
    public code: AbstractControl;
    public userRole: AbstractControl;
    notificationAddorUpdateMessage;
    notificationUpdateErrorMessage;
    notificationEventCodeCheck;
    notificationDeleteMessage;
    submitFailed;
    public disableFields;
    public disableUserRole;
    public serviceErrorResponse;
    public serviceErrorData;

    public widgetUserRolesOptions: Array<userRoles> = [];
    public widgetRolesSelections: Array<string> = [];

    // public emailTemplate = new EmailTemplateModel(0, 'select', 'select', 'select');
    public serviceEvent = new ServiceeventModel('', '', '');
    public notificationChannel = new NotificationModel(null, this.serviceEvent,
        true, false, true, this.emailTemplate, this.notificationTemplate, this.userRolesArray);

    constructor(private notificationService: NotificationService, 
        private router: Router, private activitiesService: ActivitiesService,
        private cd: ChangeDetectorRef, private fb: FormBuilder) {
        this.menuCollapse = false;
        this.complexForm = fb.group({
            module: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z\s]*$')])],
            event: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]+$')])],
            code: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{3,3}$')])],
            // userRole:[null,Validators.compose([Validators.required])]
        })
        this.module = this.complexForm.controls['module'];
        this.event = this.complexForm.controls['event'];
        this.code = this.complexForm.controls['code'];
        // this.userRole=this.complexForm.controls['userRole'];

        this.widgetUserRolesOptions = [
            {
                'id': 1,
                'name': 'ADMIN'
            },
            {
                'id': 3,
                'name': 'USER'
            }
        ]
    }

    public uniq(a) {
        return a.sort().filter((item, pos, ary) => {
            return !pos || item != ary[pos - 1];
        })
    }

    ngOnInit() {
        this.getChannelsList();
        this.emailTemplates();
        this.getAllUserRoles();
    }
    ngAfterViewChecked() {
        // explicit change detection to avoid "expression-has-changed-after-it-was-checked-error"
        this.cd.detectChanges();
    }

    ngAfterContentInit() { }
    emailTemplates() {
        this.notificationService.getEmailTemplates().subscribe(data => {
            this.templatesNames = data.data;
        }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
        })
    }

    getChannelsList() {
        this.notificationService.getDefaultNotificationSettings().subscribe(data => {
            this.cd.detectChanges();
            this.jsonData = data.data;
            this.grouped = _.groupBy(this.jsonData, (item: any) => {
                // if (item.serviceevent) {
                this.moduleNames.push(item.serviceevent.module);
                return item.serviceevent.module;
                // }
            });
            this.moduleNames = this.uniq(this.moduleNames)
            //  this.router.navigate(['notifications/notificationssettings'])
        }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
        })
    }

    byId(item1: EmailTemplateModel, item2: EmailTemplateModel) {
        // if (item1 != null && item2 != null) {
        //     return item1.id === item2.id;
        // }
        return item1 && item2 ? item1.id === item2.id : item1 === item2;
    }

    emailTemplateOnChange(a: any) {
        this.notificationChannel.emailTemplate = a;
        this.selectEmailTemplate = false;
        // this.selectNotificationTemplate = false;
    }

    notificationTemplateOnChange(b: any) {
        this.notificationChannel.notificationTemplate = b;
        // this.selectEmailTemplate = false;
        this.selectNotificationTemplate = false;
    }
    AddorUpdateChannel(a: any) {
        this.menuCollapse = true;
        this.selectEmailTemplate = false;
        this.selectNotificationTemplate = false;

        // this.notificationAddorUpdateMessage = '';
        //  this.notificationUpdateErrorMessage = '';
        if (a) {
            this.disableFields = true;
            $('#widgetUserRoleMultiple').val('').trigger('change');
            this.notificationChannel = a;
            a.role.forEach(roleData => {
                this.widgetRolesSelections.push(roleData.name);
            })
            $('#widgetUserRoleMultiple').val(this.widgetRolesSelections).trigger('change');
            this.buttonEnable = false;
            if (a.serviceevent.code === '501' || a.serviceevent.code === '401' || a.serviceevent.code === '402' || a.serviceevent.code === '410' || a.serviceevent.code === '411' || a.serviceevent.code === '500') {
                this.disableUserRole = true;
            } else {
                this.disableUserRole = false;
            }
        } else {
            this.disableFields = false;
            this.serviceEvent = new ServiceeventModel('', '', '');
            this.emailTemplate = new EmailTemplateModel(null, '', '', '');
            this.notificationTemplate = new NotificationTemplateModel(null, '', '', '');
            this.notificationChannel = new NotificationModel(null, this.serviceEvent,
                true, false, true, this.emailTemplate, this.notificationTemplate, this.userRolesArray);
            this.buttonEnable = true;
            $('#widgetUserRoleMultiple').val('').trigger('change');
        }
    }
    collapseMenu() {
        this.cd.detectChanges();
        this.menuCollapse = false;
        this.selectEmailTemplate = false;
        this.selectNotificationTemplate = false;
        this.notificationAddorUpdateMessage = '';
        this.notificationUpdateErrorMessage = '';
    }

    notificationChannelAdd(channelsData: any, addupdate: string, widgetRoles) {
        if (widgetRoles.length) {
            this.submitFailed = false;
            const roleData = new Array();
            if (widgetRoles) {
                widgetRoles.forEach(element => {
                    this.widgetUserRolesOptions.forEach(user => {
                        if (user.name == element) {
                            roleData.push({ 'name': user.name, 'id': user.id })
                        }
                    })
                });
            }
            this.selectEmailTemplate = false;
            this.selectNotificationTemplate = false;
            if (channelsData.serviceevent.code != '' && channelsData.serviceevent.module != '' && channelsData.serviceevent.event != '') {
                channelsData.emailTemplate = this.notificationChannel.emailTemplate;
                channelsData.notificationTemplate = this.notificationChannel.notificationTemplate;
                if (channelsData.emailTemplate.id == null) {
                    this.selectEmailTemplate = true;
                    // this.selectNotificationTemplate = true;
                }
                if (channelsData.notificationTemplate.id == null) {
                    // this.selectEmailTemplate = true;
                    this.selectNotificationTemplate = true;
                } else {
                    this.selectEmailTemplate = false;
                    this.selectNotificationTemplate = false;
                    if (addupdate == 'add') {
                        channelsData.role = roleData;
                        this.addchannel(channelsData)
                    }
                    if (addupdate == 'update') {
                        channelsData.role = roleData;
                        this.updatechannel(channelsData)
                    }
                }

            } else {
                this.channelLoginError = 'Add Module Code,Module Name and Event';
            }
        } else {
            this.submitFailed = true;
        }
    }

    addchannel(channelsData: any) {
        this.channelLoginError = '';
        this.notificationService.addChannel(channelsData).subscribe(data => {
            if (!data.error) {
                this.notificationAddorUpdateMessage = 'Channel Created Successfully'
                // this.notificationAddorUpdateMessage = 'Channel Updated Successfully'
                setTimeout(() => {
                    this.notificationAddorUpdateMessage = ''
                }, 3000);

                $('#widgetUserRoleMultiple').val('').trigger('change');
                this.widgetRolesSelections = [];

                this.getChannelsList();
                this.AddorUpdateChannel('')
                this.channelremove()
            } else {
                this.getChannelsList();
                this.notificationUpdateErrorMessage = data.error.message;
                setTimeout(() => {
                    this.notificationUpdateErrorMessage = ''
                }, 3000);

            }
        }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
            this.channelLoginError = error.message;
        })
    }
    updatechannel(channelsData: any) {
        this.channelLoginError = '';
        this.notificationService.updateChannel(channelsData).subscribe(data => {
            if (!data.error) {

                // this.notificationAddorUpdateMessage = 'Channel Created Successfully'
                this.notificationAddorUpdateMessage = 'Channel Updated Successfully'
                setTimeout(() => {
                    this.notificationAddorUpdateMessage = ''
                }, 3000);

                $('#widgetUserRoleMultiple').val('').trigger('change');
                this.widgetRolesSelections = [];

                this.getChannelsList();
                this.AddorUpdateChannel('')
                this.channelremove()
            } else {
                this.getChannelsList();
                this.notificationUpdateErrorMessage = data.error.message;
                setTimeout(() => {
                    this.notificationUpdateErrorMessage = ''
                }, 3000);

            }
        }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
            this.channelLoginError = error.message;
        })
    }

    channelremove() {
        this.moduleNames.forEach(dummy => {
            if (dummy) {
                const a = '#' + dummy + ' li'
                const count = $(a).length;
                if (count == 0) {
                    const element = document.getElementById('channel' + dummy);
                    $('#channel' + dummy).remove();
                    //  this.moduleNames.push(channelsData.serviceevent.module)
                    _.pull(this.moduleNames, dummy)
                    // this.AddorUpdateChannel('')

                }

            }
        })
    }


    refreshView() {
        //  window.location.reload()
    }

    goBack() {
        this.menuCollapse = false;
    }
    notificationChannelDelete(channelsData: any) {
        this.channelLoginError = '';
        const a = '#' + channelsData.serviceevent.module + ' li'
        const count = $(a).length;
        this.notificationService.deleteChannel(channelsData).subscribe(data => {
            this.cd.detectChanges();
            //  this.cd.markForCheck();
            this.getChannelsList();
            let element = document.getElementById('channel' + channelsData.serviceevent.module);
            if (count == 1) {
                element = document.getElementById('channel' + channelsData.serviceevent.module);
                element.parentNode.removeChild(element);
                element = document.getElementById('treechannel' + channelsData.serviceevent.module);
                element.parentNode.removeChild(element);
            }
            this.notificationDeleteMessage = 'Channel Deleted Successfully'
            this.AddorUpdateChannel('')
            setTimeout(() => {
                this.notificationDeleteMessage = ''
            }, 3000);
        }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
            this.channelLoginError = error.message;
        })
    }

    /*
      * This method get all user roles
      */
    public getAllUserRoles() {
        this.notificationService.getAllRoles().subscribe(data => {
            if (data.error == null) {
                this.widgetUserRolesOptions = data.data;
            }
        }, error => {

        })
    }

    ngAfterViewInit() {
        $('#widgetUserRoleMultiple').on('change', (eventValues) => {
            this.widgetRolesSelections = $(eventValues.target).val();
            if (this.widgetRolesSelections === null) {
                this.widgetRolesSelections = [];
            }
        });
    }
}


export class NotificationModel {
    constructor(
        public user: number,
        public serviceevent: ServiceeventModel,
        public email: boolean,
        public sms: boolean,
        public notificationCenter: boolean,
        public emailTemplate: EmailTemplateModel,
        public notificationTemplate: NotificationTemplateModel,
        public role: userRoles
    ) { }
}

export class ServiceeventModel {
    constructor(
        public code: string,
        public event: string,
        public module: string,
    ) { }
}

export class EmailTemplateModel {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public content: string,
    ) { }
}

export class NotificationTemplateModel {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public content: string,
    ) { }
}

export class SMSTemplateModel {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public content: string,
    ) { }
}


export class userRoles {
    constructor(
        public id: number,
        public name: string
    ) {
    }

}

@Pipe({
    name: 'ticketsGrouping',
    pure: false
})
export class TicketsGrouping implements PipeTransform {
    transform(items: any, conditions: { [field: string]: any }): Array<any> {
        if (items !== undefined) {
            return items.filter(item => {
                for (const field in conditions) {
                    if (item.serviceevent[field] !== conditions[field]) {
                        return false;
                    }
                }
                return true;
            });
        }
    }
}