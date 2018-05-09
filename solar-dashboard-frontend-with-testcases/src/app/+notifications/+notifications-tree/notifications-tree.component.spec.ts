import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { NotificationModule } from '../notifications.module';
import { NotificationsTreeComponent, NotificationModel, ServiceeventModel, userRoles } from './notifications-tree.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../notifications.service';
import { AppModule } from '../../app.module';
import { AdminModule } from '../../+admin/admin.module';
import { setTimeout } from 'timers';

describe('Notifications tree Component', () => {
    let component: NotificationsTreeComponent;
    let fixture: ComponentFixture<NotificationsTreeComponent>;
    let moduleNames = [];
    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, AdminModule, NotificationModule],
            declarations: [],
            providers: [
                { provide: NotificationService, useClass: notificationsServicedatastub },
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationsTreeComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([NotificationService], (injectService: NotificationService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('On ngOngit invoking channels list,email templates,user roles list services', (done) => {
        fixture = TestBed.createComponent(NotificationsTreeComponent);
        component = fixture.componentInstance;
        let notificationsServicedatastub = fixture.debugElement.injector.get(NotificationService);
        const spy = spyOn(notificationsServicedatastub, 'getDefaultNotificationSettings').and.returnValue(Observable.of(defaultNotficationChannelList));
        const spyEmailTemplate = spyOn(notificationsServicedatastub, 'getEmailTemplates').and.returnValue(Observable.of(mockTemplatesResponse));
        const spyGetRoles = spyOn(notificationsServicedatastub, 'getAllRoles').and.returnValue(Observable.of(MockUserRoles));
        const spyChangeDef = spyOn((component as any).cd, 'detectChanges');
        component.ngOnInit();
        setTimeout(() => {
            expect(component.jsonData).toEqual(defaultNotficationChannelList.data);
            expect(component.templatesNames).toEqual(mockTemplatesResponse.data);
            expect(component.widgetUserRolesOptions).toEqual(MockUserRoles.data);
            done();
        }, 2000)
    })
    // it('Add Notification form is invalid when page loaded', () => {
    //     expect(component.complexForm.valid).toBeFalsy();
    // });

    it('Module property field validity', () => {
        let errors = {};
        let module = component.complexForm.controls['module'];
        expect(module.valid).toBeFalsy();

        // USername field is required
        errors = module.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set USername to something correct
        module.setValue("UserService");
        errors = module.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(module.valid).toBeTruthy();
    })


    it('code field validity', () => {
        let errors = {};
        let code = component.complexForm.controls['code'];
        expect(code.valid).toBeFalsy();

        // USername field is required
        errors = code.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set USername to something correct
        code.setValue("432");
        errors = code.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(code.valid).toBeTruthy();
    })

    it('event field validity', () => {
        let errors = {};
        let event = component.complexForm.controls['event'];
        expect(event.valid).toBeFalsy();

        // USername field is required
        errors = event.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set USername to something correct
        event.setValue("New User Registration");
        errors = event.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(event.valid).toBeTruthy();
    })
    it('Checking Add notifications Form Validity', () => {
        component.complexForm.controls['module'].setValue('UserService');
        component.complexForm.controls['event'].setValue('Neew User');
        component.complexForm.controls['code'].setValue('555');

        expect(component.complexForm.valid).toBeTruthy();
    })

    describe('Add New Notification Channel', () => {

        it('Add New channel button to display new form with empty fields', () => {
            component.AddorUpdateChannel('');
            //view input fileds to true
            expect(component.menuCollapse).toBeTruthy();

            //nall fields to be enabled
            expect(component.disableFields).toBeFalsy();

            //add button filed should be displayed to form
            expect(component.buttonEnable).toBeTruthy();
        })

        it('Add Button :To create a New channel with object', (done) => {

            fixture = TestBed.createComponent(NotificationsTreeComponent);
            component = fixture.componentInstance;
            let notificationsServicedatastub = fixture.debugElement.injector.get(NotificationService);
            const spy = spyOn(notificationsServicedatastub, 'addChannel').and.returnValue(Observable.of(UpdateEventService));
            const spyNotification = spyOn(notificationsServicedatastub, 'getDefaultNotificationSettings').and.returnValue(Observable.of(defaultNotficationChannelList));
            const spyChangeDef = spyOn((component as any).cd, 'detectChanges');

            let widgetRolesSelections = ["ADMIN", "USER"];
            component.notificationChannel.emailTemplate = { "id": 1, "name": "Email - New load", "type": "EMAIL", "content": "New load ${loadNum} is created" };
            component.notificationChannel.notificationTemplate = { "id": 4, "name": "Popup - New load", "type": "WEBSOCKET", "content": "New load ${loadNum} is created" }
            
            component.notificationChannelAdd(addNotificationChannelPostMockData, 'add', widgetRolesSelections);
            setTimeout(() => {
                expect(component.notificationAddorUpdateMessage).toEqual('Channel Created Successfully');
                done();
            }, 2000)
        })

        it('Cancel Button: Should hide the add form fields', () => {
            component.goBack();
            expect(component.menuCollapse).toBeFalsy();
        })



    })


    describe('Update Notification Channel', () => {
        it('Show Update channel details when click of event name in channel list tree', () => {

            //passing single object data
            component.AddorUpdateChannel(defaultNotficationChannelList.data[0]);
            //view input fileds to true
            expect(component.menuCollapse).toBeTruthy();

            //disabling module name,event code and event list
            expect(component.disableFields).toBeTruthy();

            //update button filed should be displayed to form
            expect(component.buttonEnable).toBeFalsy();

            //service event code is 400 for mock object expect disableUserRole should be false
            expect(component.disableUserRole).toBeFalsy();
        })

        it('Update Button: Should Update the notification chaneel details', (done) => {

            fixture = TestBed.createComponent(NotificationsTreeComponent);
            component = fixture.componentInstance;
            let notificationsServicedatastub = fixture.debugElement.injector.get(NotificationService);
            const spy = spyOn(notificationsServicedatastub, 'updateChannel').and.returnValue(Observable.of(UpdateEventService));
            const spyNotification = spyOn(notificationsServicedatastub, 'getDefaultNotificationSettings').and.returnValue(Observable.of(defaultNotficationChannelList));
            const spyChangeDef = spyOn((component as any).cd, 'detectChanges');
            
            let widgetRolesSelections = ["ADMIN", "USER"];
            component.notificationChannel.emailTemplate = { "id": 1, "name": "Email - New load", "type": "EMAIL", "content": "New load ${loadNum} is created" };
            component.notificationChannel.notificationTemplate = { "id": 4, "name": "Popup - New load", "type": "WEBSOCKET", "content": "New load ${loadNum} is created" }
            component.notificationChannelAdd(updateNotificationChannelPostMockData, 'update', widgetRolesSelections);

            setTimeout(() => {
                expect(component.notificationAddorUpdateMessage).toEqual('Channel Updated Successfully');
                done();
            }, 2000)
        })

        it('DeleteButton:Delete Notification channel list', () => {

            let notificationsServicedatastub = fixture.debugElement.injector.get(NotificationService);
            const spy = spyOn(notificationsServicedatastub, 'deleteChannel').and.returnValue(Observable.of(NotificationResponse));
            const spySettings = spyOn(notificationsServicedatastub, 'getDefaultNotificationSettings').and.returnValue(Observable.of(defaultNotficationChannelList));
            const spyChangeDef = spyOn((component as any).cd, 'detectChanges');

            component.userRolesArray = new userRoles(null, '');

            component.notificationChannelDelete(UpdateEventService.data);
            expect(component.notificationDeleteMessage).toBeDefined('Channel Deleted Successfully');
            expect(component.jsonData).toEqual(defaultNotficationChannelList.data);
        })

    })

})





let mockPostUpdateTemplate = {
    "id": 1,
    "name": "Email - New load",
    "type": "EMAIL",
    "content": "<p>New load ${loadNum} is created</p>"
}

let MockUserRoles = {
    "data": [{
        "id": 1,
        "name": "ADMIN"
    }, {
        "id": 2,
        "name": "DRIVER"
    }, {
        "id": 3,
        "name": "USER"
    }, {
        "id": 4,
        "name": "DCMANAGER"
    }],
    "error": null,
    "code": 0
}

let mockTemplatesResponse = {
    "data": [{
        "id": 1,
        "name": "Email - New load",
        "type": "EMAIL",
        "content": "<p>New load ${loadNum} is created</p>"
    }],
    "error": null,
    "code": 0
}

let defaultNotficationChannelList = {
    "data": [{
        "id": 1,
        "user": null,
        "email": true,
        "sms": false,
        "notificationCenter": true,
        "emailTemplate": {
            "id": 1,
            "name": "Email - New load",
            "type": "EMAIL",
            "content": "<p>New load ${loadNum} is created</p>"
        },
        "phoneTemplate": null,
        "notificationTemplate": {
            "id": 4,
            "name": "Popup - New load",
            "type": "WEBSOCKET",
            "content": "<p>New load ${loadNum} is created</p>"
        },
        "role": [{
            "id": 1,
            "name": "ADMIN"
        }],
        "serviceevent": {
            "id": 1,
            "code": "400",
            "event": "New load",
            "module": "LoadService"
        }
    }],
    "error": null,
    "code": 0
}

let UpdateEventService = {
    "data": {
        "id": 2,
        "user": null,
        "email": true,
        "sms": false,
        "notificationCenter": true,
        "emailTemplate": {
            "id": 2,
            "name": "Email - Load status",
            "type": "EMAIL",
            "content": "Load ${loadNum} is ${message} the driver ${driver}"
        },
        "phoneTemplate": null,
        "notificationTemplate": {
            "id": 5,
            "name": "Popup - Load status ",
            "type": "WEBSOCKET",
            "content": "Load ${loadNum} is ${message} the driver ${driver}"
        },
        "role": [{
            "id": 1,
            "name": "ADMIN"
        }, {
            "id": 4,
            "name": "DCMANAGER"
        }],
        "serviceevent": {
            "id": 2,
            "code": "401",
            "event": "Load status event for admin",
            "module": "LoadService"
        }
    },
    "error": null,
    "code": 0
}

let addNotificationChannelPostMockData = {
    "user": null,
    "serviceevent": {
        "code": "256",
        "event": "New User",
        "module": "User"
    },
    "email": true,
    "sms": false,
    "notificationCenter": true,
    "emailTemplate": {
        "id": 1,
        "name": "Email - New load",
        "type": "EMAIL",
        "content": "New load ${loadNum} is created"
    },
    "notificationTemplate": {
        "id": 4,
        "name": "Popup - New load",
        "type": "WEBSOCKET",
        "content": "New load ${loadNum} is created"
    }
}

let updateNotificationChannelPostMockData = {
    "id": 438,
    "user": null,
    "email": true,
    "sms": false,
    "notificationCenter": true,
    "emailTemplate": {
        "id": 2,
        "name": "Email - Load status",
        "type": "EMAIL",
        "content": "Load ${loadNum} is ${message}&nbsp; ${driver}"
    },
    "phoneTemplate": null,
    "notificationTemplate": {
        "id": 5,
        "name": "Popup - Load status ",
        "type": "WEBSOCKET",
        "content": "Load ${loadNum} is ${message} ${driver}"
    },
    "role": [{
        "id": 1,
        "name": "ADMIN"
    }],
    "serviceevent": {
        "id": 410,
        "code": "256",
        "event": "New User",
        "module": "User"
    }
}

let NotificationResponse = {
    "data": "Notification event setting is deleted",
    "error": null,
    "code": 0
}


class notificationsServicedatastub {
    public getDefaultNotificationSettings() {
        return Observable.of(defaultNotficationChannelList);
    }

    public getEmailTemplates() {
        return Observable.of(mockTemplatesResponse);
    }

    public getAllRoles() {
        return Observable.of(MockUserRoles);
    }

    public addChannel(channelsData) {
        return Observable.of(UpdateEventService);
    }

    public updateChannel(channelsData) {
        return Observable.of(UpdateEventService);
    }

    public deleteChannel(channelsData) {
        return Observable.of(NotificationResponse);
    }
}

