import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { NotificationService } from './notifications.service';

describe('Notifications Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                NotificationService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        }).compileComponents();
    });


    it('Instantiating Notification service when to inject service', inject([NotificationService], (service: NotificationService) => {
        expect(service instanceof NotificationService).toBe(true);
    }));

    it('Instantiate service with "new" and with Http request', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new NotificationService(http);
        expect(service instanceof NotificationService).toBe(true, 'new service should be ok');
    }));

    it('Providing mock service data to mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        })
    );
    
    describe('Get Notification List service ', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ status: 200, body: fakeNotificationsListData });
            response = new Response(options);
        }));

        it('should have fake Notifications list', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getNotifications().subscribe(notificationList => {
                expect(notificationList.data.length).toBe(fakeNotificationsListData.data.length);
                expect(notificationList.data.length).toBe(2);
            });
        })));


        it('should treat as http service error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({ status: 404 || 500 }));
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(resp));
            service.getNotifications().catch(err => {
                expect(err).toMatch(/status/, 'should catch bad response status code');
                return Observable.of(null); // failure is the expected test result
            })
        })));
    })

    describe('Get Notification Channels List ', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ status: 200, body: fakeDefaultSetting });
            response = new Response(options);
        }));

        it('Should have expected default setting list', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getChannels().subscribe(notificationList => {
                expect(notificationList.data).toBe(fakeDefaultSetting.data);
            });
        })));
    })

    describe('Update Channels Service by channel data ', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ status: 200, body: channelResObj });
            response = new Response(options);
        }));

        it('Should updated channels by channel data', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.updateChannel(channelObj).subscribe(channels => {
                expect(channels.data).toBe(channelResObj.data);
            });
        })));
    })

    describe('Get All Users Roles Service', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ status: 200, body: usersRoleResponse });
            response = new Response(options);
        }));

        it('Should expected roles count to be matched ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getAllRoles().subscribe(roles => {
                expect(roles.data).toBe(usersRoleResponse.data);
                expect(roles.data.length).toBe(usersRoleResponse.data.length);
            });
        })));
    })

    describe('Get All Users Service', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ body: getAllUserResponse });
            response = new Response(options);
        }));

        it('should have expected fake users list', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getAllUsers().subscribe(usersData => {
                expect(usersData.length).toBe(getAllUserResponse.data.length);
            });
        })));
    })

    describe('Delete User Service', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ body: userDeletedata });
            response = new Response(options);
        }));

        it('should have delete User details', fakeAsync(inject([], () => {
            let userId = 9;
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.deleteUser(userId).subscribe(deleteData => {
                expect(deleteData.data).toBe(userDeletedata.data);
            });
        })));
    })

    describe('Update User Service', () => {

        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ body: updateUserRes });
            response = new Response(options);
        }));
        let updateObj = {
            "id": 64,
            "name": "Aaron",
            "email": "aaron@metanoiasolutions.net",
            "phone": "2602185195",
            "active": true,
            "roles": [{
                "id": 2,
                "name": "DRIVER"
            }]
        }

        it('should have delete channel details', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.updateUser(updateObj).subscribe(updateRes => {
                expect(updateRes.data).toBe(updateUserRes.data);
            });
        })));
    })

    describe('Get Email Templates Service', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ status: 200, body: templatesData });
            response = new Response(options);
        }));

        it('should have expected fake email templates list', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getEmailTemplates().subscribe(emailTemplates => {
                expect(emailTemplates.data).toBe(templatesData.data);
            });
        })));
    })

    describe('Delete Channel Service', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ body: channelDeletedata });
            response = new Response(options);
        }));

        it('should have delete channel details', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.deleteChannel(channelObj).subscribe(deleteData => {
                expect(deleteData.data).toBe(channelDeletedata.data);
            });
        })));
    })

    describe('Add Channels Service', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ status: 200, body: channelResObj });
            response = new Response(options);
        }));

        it('should add a fake channel', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.addChannel(channelObj).subscribe(channels => {
                expect(channels.data).toBe(channelResObj.data);
            });
        })));
    })

    describe('Default Channels setting Service', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            let options = new ResponseOptions({ status: 200, body: defaultsettingObj });
            response = new Response(options);
        }));

        it('Should have default channels setting', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getDefaultNotificationSettings().subscribe(settingResponse => {
                expect(settingResponse.data).toBe(defaultsettingObj.data);
            });
        })));
    })

    describe('Get Users Details By Id:', () => {
        let service: NotificationService;
        let backend: MockBackend;
        let response: Response;
        let fakeUserResponse;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new NotificationService(http);
            fakeUserResponse = getSingleUserRes;
            let options = new ResponseOptions({ status: 200, body: fakeUserResponse });
            response = new Response(options);
        }));

        it('should have expected fake user by Id ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            let fakeUserId = '1';
            service.getUserDetailsByID(fakeUserId).then(userRes => {
                expect(userRes).toBe(fakeUserResponse.data[0])
            });
        })));
    })
})

let getSingleUserRes = {
    "data": [{
        "id": 1,
        "name": "Lohitha",
        "email": "lginjupalli@metanoiasolutions.net",
        "phone": "8096861024",
        "active": true,
        "roles": [{
            "id": 1,
            "name": "ADMIN"
        }]
    }]
}


let fakeDefaultSetting = {
    "data": {
        "id": 52,
        "user": null,
        "email": true,
        "sms": false,
        "notificationCenter": false,
        "emailTemplate": {
            "id": 39,
            "name": "Add user",
            "type": "EMAIL",
            "content": "New user with name <b>${userName}</b> and email <b>${email}</b> is registered. "
        },
        "phoneTemplate": null,
        "notificationTemplate": {
            "id": 40,
            "name": "Popup-Add user",
            "type": "WEBSOCKET",
            "content": "New user with name <b>${userName}</b> and email <b>${email}</b> is registered. "
        },
        "role": [{
            "id": 1,
            "name": "ADMIN"
        }],
        "serviceevent": {
            "id": 30,
            "code": "201",
            "event": "New user registration",
            "module": "UserService"
        }
    },
}


let fakeNotificationsListData = {
    "data": [
        {
            "id": 2935,
            "user": {
                "id": 109,
                "name": "ramu",
                "email": "rvishwanatham@metanoiasolutions.net",
                "phone": "8096018363",
                "active": true,
                "roles": [{
                    "id": 1,
                    "name": "ADMIN"
                }]
            },
            "serviceevent": {
                "id": 2,
                "code": "401",
                "event": "Load status event for admin",
                "module": "LoadService"
            },
            "notificationContext": "Load 100023 is assigned to Charles",
            "lastUpdateTime": "2018-02-05T16:12:56+05:30",
            "readStatus": 0,
            "type": "WEBSOCKET"
        },
        {
            "id": 2945,
            "user": {
                "id": 109,
                "name": "ramu",
                "email": "rvishwanatham@metanoiasolutions.net",
                "phone": "8096018363",
                "active": true,
                "roles": [{
                    "id": 1,
                    "name": "ADMIN"
                }]
            },
            "serviceevent": {
                "id": 2,
                "code": "401",
                "event": "Load status event for admin",
                "module": "LoadService"
            },
            "notificationContext": "Load 5464 is assigned to Gage",
            "lastUpdateTime": "2018-02-05T16:13:14+05:30",
            "readStatus": 0,
            "type": "WEBSOCKET"
        }],
    "error": null,
    "code": 0
}


let userDeletedata = {
    "data": "User deleted successfully",
    "error": null,
    "code": 0
}

let channelObj = {
    "id": 1,
    "user": null,
    "email": true,
    "sms": false,
    "notificationCenter": true,
    "emailTemplate": {
        "id": 1,
        "name": "Email - New load",
        "type": "EMAIL",
        "content": "New load ${loadNum} is created"
    },
    "phoneTemplate": null,
    "notificationTemplate": {
        "id": 4,
        "name": "Popup - New load",
        "type": "WEBSOCKET",
        "content": "New load ${loadNum} is created"
    },
    "role": [
        {
            "name": "ADMIN",
            "id": 1
        }
    ],
    "serviceevent": {
        "id": 1,
        "code": "400",
        "event": "New load",
        "module": "LoadService"
    }
}


let channelResObj = {
    "data": {
        "id": 1,
        "user": null,
        "email": true,
        "sms": false,
        "notificationCenter": true,
        "emailTemplate": {
            "id": 1,
            "name": "Email - New load",
            "type": "EMAIL",
            "content": "New load ${loadNum} is created"
        },
        "phoneTemplate": null,
        "notificationTemplate": {
            "id": 4,
            "name": "Popup - New load",
            "type": "WEBSOCKET",
            "content": "New load ${loadNum} is created"
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
    },
    "error": null,
    "code": 0
}


let usersRoleResponse = {
    "data": [
        { "id": 1, "name": "ADMIN" },
        { "id": 2, "name": "DRIVER" },
        { "id": 3, "name": "USER" },
        { "id": 4, "name": "DCMANAGER" }
    ],
    "error": null,
    "code": 0
}


let getAllUserResponse = {
    "data": [
        { "id": 1, "name": "Lohitha", "email": "lginjupalli@metanoiasolutions.net", "phone": "8096861024", "active": true, "roles": [{ "id": 1, "name": "ADMIN" }] },
        { "id": 64, "name": "Aaron", "email": "aaron@metanoiasolutions.net", "phone": "2602185194", "active": true, "roles": [{ "id": 2, "name": "DRIVER" }] },
        { "id": 65, "name": "Chandler", "email": "chandler@metanoiasolutions.net", "phone": "9946999961", "active": true, "roles": [{ "id": 2, "name": "DRIVER" }] },
        { "id": 66, "name": "Charles", "email": "charles@metanoiasolutions.net", "phone": "9008188408", "active": true, "roles": [{ "id": 2, "name": "DRIVER" }] },],
    "error": null,
    "code": 0
}


let templatesData = {
    "data": [
        { "id": 1, "name": "Email - New load", "type": "EMAIL", "content": "New load ${loadNum} is created" },
        { "id": 2, "name": "Email - Load status", "type": "EMAIL", "content": "Load ${loadNum} is ${message}&nbsp; ${driver}" },
        { "id": 3, "name": "Email - Geofence", "type": "EMAIL", "content": "&nbsp;${driver} with load ${loadNum} has entered into ${location}" },
        { "id": 4, "name": "Popup - New load", "type": "WEBSOCKET", "content": "New load ${loadNum} is created" },
        { "id": 5, "name": "Popup - Load status ", "type": "WEBSOCKET", "content": "Load ${loadNum} is ${message} ${driver}" },
    ], "error": null, "code": 0
}

let channelDeletedata = {
    "data": "Notification event setting is deleted",
    "error": null,
    "code": 0
}


let defaultsettingObj = {
    "data": [
        {
            "id": 1, "user": null,
            "email": true,
            "sms": false,
            "notificationCenter": true,
            "emailTemplate": {
                "id": 1,
                "name": "Email - New load",
                "type": "EMAIL",
                "content": "New load ${loadNum} is created"
            },
            "phoneTemplate": null,
            "notificationTemplate": {
                "id": 4,
                "name": "Popup - New load",
                "type": "WEBSOCKET",
                "content": "New load ${loadNum} is created"
            },
            "role": [
                {
                    "id": 1,
                    "name": "ADMIN"
                }
            ],
            "serviceevent": {
                "id": 1,
                "code": "400",
                "event": "New load",
                "module": "LoadService"
            }
        },
        {
            "id": 2,
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
                "id": 4,
                "name": "DCMANAGER"
            }, {
                "id": 1,
                "name": "ADMIN"
            }],
            "serviceevent": {
                "id": 2,
                "code": "401",
                "event": "Load status event for admin",
                "module": "LoadService"
            }
        },
    ], "error": null, "code": 0
}


let updateUserRes = {
    "data": {
        "id": 64,
        "name": "Aaron",
        "email": "aaron@metanoiasolutions.net",
        "phone": "2602185195",
        "active": true,
        "roles": [{
            "id": 2,
            "name": "DRIVER"
        }]
    },
    "error": null,
    "code": 0
}