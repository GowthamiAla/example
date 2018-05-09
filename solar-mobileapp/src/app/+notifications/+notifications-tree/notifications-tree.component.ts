import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '../notifications.service'
import { endponitConfig } from '../../../environments/endpoints'; import { Router } from '@angular/router';

import { ActivitiesService } from '../../shared/layout/header/activities/activities.service';

import { JsonApiService } from "../../core/api/json-api.service";
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';

import * as _ from 'lodash';


declare var $: any;

@FadeInTop()
@Component({
    selector: 'notification-tree-views',
    templateUrl: './notifications-tree.component.html',
    styles: [`ul.asTree {
    list-style-type:none;
    padding:0;
    margin:0;
    text-indent:1em;
}
ul.asTree ul{
    display:none;
    list-style-type:none;
}

ul.asTree li{/*lets us position the label's ::before*/
    position:relative;
}

ul.asTree label{
    cursor:pointer;
}
ul.asTree label:hover{
    box-shadow: 0 0 5px 0 rgba(128,155,200,0.5) inset;
}
ul.asTree label::before{

    position:absolute;
    left:-1em;
    top:-2px;
}
ul.asTree input:checked + label::before{
  
}

ul.asTree input:checked + label + ul{
    display:block;
}
.tooglePosition{
    float:left;
}`],
})
export class NotificationsTreeComponent implements OnInit {
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
    notificationTemplate: NotificationTemplateModel
    public jsonData;
    public complexForm: FormGroup;
    public module: AbstractControl;
    public event: AbstractControl;
    public code: AbstractControl;
    notificationAddorUpdateMessage;
    notificationUpdateErrorMessage;
    notificationEventCodeCheck;
    notificationDeleteMessage;

    // public emailTemplate = new EmailTemplateModel(0, 'select', 'select', 'select');
    public serviceEvent = new ServiceeventModel('', '', '');
    public notificationChannel = new NotificationModel(null, this.serviceEvent, true, false, true, this.emailTemplate, this.notificationTemplate);

    constructor(private notificationService: NotificationService, private jsonApiService: JsonApiService, private router: Router, private activitiesService: ActivitiesService,
        private cd: ChangeDetectorRef, private fb: FormBuilder) {
        this.menuCollapse = false;
        this.complexForm = fb.group({
            module: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z\s]*$')])],
            event: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]+$')])],
            code: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{3,3}$')])]
        })
        this.module = this.complexForm.controls['module'];
        this.event = this.complexForm.controls['event'];
        this.code = this.complexForm.controls['code'];
    }

    public uniq(a) {
        return a.sort().filter((item, pos, ary) => {
            return !pos || item != ary[pos - 1];
        })
    }

    ngOnInit() {
        this.getChannelsList();
        this.emailTemplates();
    }
    ngAfterViewChecked() {
        //explicit change detection to avoid "expression-has-changed-after-it-was-checked-error"
        this.cd.detectChanges();
    }

    ngAfterContentInit() { }
    emailTemplates() {
        this.notificationService.getEmailTemplates().subscribe(data => {
            this.templatesNames = data.data;
        }, error => {

        })
    }

    getChannelsList() {
        this.notificationService.getChannels().subscribe(data => {
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
            this.notificationChannel = a;
            this.buttonEnable = false;
        } else {
            this.serviceEvent = new ServiceeventModel('', '', '');
            this.emailTemplate = new EmailTemplateModel(null, '', '', '');
            this.notificationTemplate = new NotificationTemplateModel(null, '', '', '');
            this.notificationChannel = new NotificationModel(null, this.serviceEvent, true, false, true, this.emailTemplate, this.notificationTemplate);
            this.buttonEnable = true;
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

    notificationChannelUpdate(channelsData: any, addupdate: string) {
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
            }
            else {
                this.selectEmailTemplate = false;
                this.selectNotificationTemplate = false;

                this.channelLoginError = '';
                this.notificationService.addChannel(channelsData).subscribe(data => {
                    if (!data.error) {
                        if (addupdate == 'add') {
                            this.notificationAddorUpdateMessage = 'Channel Created Successfully'
                        } else if (addupdate == 'update') {
                            this.notificationAddorUpdateMessage = 'Channel Updated Successfully'
                        }
                        setTimeout(() => {
                            this.notificationAddorUpdateMessage = ''
                        }, 3000);
                        this.getChannelsList();
                        this.AddorUpdateChannel('')
                        //  this.moduleNames.push(channelsData.serviceevent.module)
                        // if (count == 0) {
                        this.moduleNames.forEach(dummy => {
                            if (dummy) {
                                let a = '#' + dummy + ' li'
                                let count = $(a).length;
                                if (count == 0) {
                                    var element = document.getElementById('channel' + dummy);
                                    $('#channel' + dummy).remove();
                                    //  this.moduleNames.push(channelsData.serviceevent.module)
                                    _.pull(this.moduleNames, dummy)
                                    // this.collapseMenu()
                                    // this.AddorUpdateChannel('')

                                }

                            }
                        })
                        // element.parentNode.removeChild(element);
                        //  }


                    } else {
                        this.getChannelsList();
                        this.notificationUpdateErrorMessage = data.error.message;
                        setTimeout(() => {
                            this.notificationUpdateErrorMessage = ''
                        }, 3000);

                    }
                }, error => {
                    this.channelLoginError = error.message;
                })
            }


        } else
            this.channelLoginError = 'Add Module Code,Module Name and Event';

    }
    refreshView() {
        //  window.location.reload()
    }
    notificationChannelDelete(channelsData: any) {
        this.channelLoginError = '';
        let a = '#' + channelsData.serviceevent.module + ' li'
        let count = $(a).length;
        this.notificationService.deleteChannel(channelsData).subscribe(data => {
            this.cd.detectChanges();
            //  this.cd.markForCheck();
            this.getChannelsList();
            var element = document.getElementById('channel' + channelsData.serviceevent.module);
            if (count == 1) {
                var element = document.getElementById('channel' + channelsData.serviceevent.module);
                element.parentNode.removeChild(element);
                var element = document.getElementById('treechannel' + channelsData.serviceevent.module);
                element.parentNode.removeChild(element);
            }
            this.notificationDeleteMessage = 'Channel Deleted Successfully'
            this.AddorUpdateChannel('')
            setTimeout(() => {
                this.notificationDeleteMessage = ''
            }, 3000);
        }, error => {
            this.channelLoginError = error.message;
        })
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
        public notificationTemplate: NotificationTemplateModel
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


@Pipe({
    name: 'ticketsGrouping',
    pure: false
})
export class TicketsGrouping implements PipeTransform {
    transform(items: any, conditions: { [field: string]: any }): Array<any> {
        if (items !== undefined) {
            return items.filter(item => {
                for (let field in conditions) {
                    if (item.serviceevent[field] !== conditions[field]) {
                        return false;
                    }
                }
                return true;
            });
        }
    }
}
