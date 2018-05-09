
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { UserService } from './user.service';

describe('UserService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                UserService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        }).compileComponents();
    });


    it('Instantiating User service when to inject service', inject([UserService], (service: UserService) => {
        expect(service instanceof UserService).toBe(true);
    }));

    it('Instantiate service with "new" and with Http request', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new UserService(http);
        expect(service instanceof UserService).toBe(true, 'new service should be ok');
    }));

    it('Providing mock service data to mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        })
    );

    describe('Get All Users Service', () => {
        let service: UserService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new UserService(http);
            let options = new ResponseOptions({ body: getAllUsersFakeRes });
            response = new Response(options);
        }));

        it('should have expected fake users list', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getAllUsers().subscribe(usersData => {
                expect(usersData.length).toBe(getAllUsersFakeRes.data.length);
            });
        })));
    })

    describe('Get Users Details By Id:', () => {
        let service: UserService;
        let backend: MockBackend;
        let response: Response;
        let fakeUserResponse;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new UserService(http);
            fakeUserResponse = getSingleUserRes;
            let options = new ResponseOptions({ status: 200, body: fakeUserResponse });
            response = new Response(options);
        }));

        it('should have expected fake user by Id ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            let fakeUserId = '1';
            service.getUserDetailsByID(fakeUserId).then(userRes => {
                expect(userRes).toBe(fakeUserResponse.data[0])
                //console.log(userRes == fakeUserResponse.data[0]);
            });
        })));
    })

    describe('Add Users Details', () => {
        let addUserObj = {
            "name": "ramu",
            "email": "vramu475@gmail.com",
            "phone": "111111111112",
            "active": "",
            "roles": [{
                "name": "ADMIN"
            }]
        }

        let service: UserService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new UserService(http);
            let options = new ResponseOptions({ body: addUserRes });
            response = new Response(options);
        }));

        it('Submit the Add user details sucessfully', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.addUser(addUserObj).subscribe(userRes => {
                expect(userRes.data).toBe(addUserRes.data);
            });
        })));
    })


    describe('Update User Service', () => {

        let service: UserService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new UserService(http);
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


    describe('Delete User Service', () => {
        let service: UserService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new UserService(http);
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

    describe('Get All Users Roles Service', () => {
        let service: UserService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new UserService(http);
            let options = new ResponseOptions({ status: 200, body: usersRoleResponse });
            response = new Response(options);
        }));

        it('Should expected roles count to be matched ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getAllUserRoleTypes().subscribe(roles => {
                expect(roles).toBe(usersRoleResponse.data);
                expect(roles.length).toBe(usersRoleResponse.data.length);
            });
        })));
    })
})


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

let getAllUsersFakeRes = {
    "data": [
        { "id": 1, "name": "Lohitha", "email": "lginjupalli@metanoiasolutions.net", "phone": "8096861024", "active": true, "roles": [{ "id": 1, "name": "ADMIN" }] },
        { "id": 64, "name": "Aaron", "email": "aaron@metanoiasolutions.net", "phone": "2602185194", "active": true, "roles": [{ "id": 2, "name": "DRIVER" }] },
        { "id": 65, "name": "Chandler", "email": "chandler@metanoiasolutions.net", "phone": "9946999961", "active": true, "roles": [{ "id": 2, "name": "DRIVER" }] },
        { "id": 66, "name": "Charles", "email": "charles@metanoiasolutions.net", "phone": "9008188408", "active": true, "roles": [{ "id": 2, "name": "DRIVER" }] },],
    "error": null,
    "code": 0
}

let userDeletedata = {
    "data": "User deleted successfully",
    "error": null,
    "code": 0
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

let addUserRes = {
    "data": {
        "id": 528,
        "name": "ramu",
        "email": "vramu475@gmail.com",
        "phone": "111111111112",
        "active": true,
        "roles": [{
            "id": 1,
            "name": "ADMIN"
        }]
    },
    "error": null,
    "code": 0
}