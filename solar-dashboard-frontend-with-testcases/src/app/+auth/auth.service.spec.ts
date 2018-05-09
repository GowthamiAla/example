import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, Headers, Response, BaseRequestOptions, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AuthService } from './auth.service';


describe('Auth Service', () => {


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                AuthService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        }).compileComponents();


    });

    it('Instantiating Auth service when to inject service', inject([AuthService], (service: AuthService) => {
        expect(service instanceof AuthService).toBe(true);
    }));


    it('Instantiate service with "new" and with Http request', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new AuthService(http);
        expect(service instanceof AuthService).toBe(true, 'new service should be ok');
    }));


    it('Providing mock service data to mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        }));

    describe('login Service return the valid user :', () => {
        let service: AuthService;
        let backend: MockBackend;
        let response: Response;
        let fakeLoginResponse;


        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new AuthService(http);
            fakeLoginResponse = mockUserLoginData;
            let options = new ResponseOptions({ status: 200, body: fakeLoginResponse });
            response = new Response(options);
        }));

        it('should have expected fake user data ', async(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            let username = 'john@metanoiasolutions.net';
            let password = 'Test@123';

            service.login(username, password).do(loginData => {
                expect(loginData).toBe(mockUserLoginData);
            });
        })));

        it('log out method', () => {
            service.logout();
            expect(service.isLoggedIn).toBeFalsy();
        })

    })

    describe('User Details by Email id Service return the valid user :', () => {
        let service: AuthService;
        let backend: MockBackend;
        let response: Response;
        let fakeuserResponse;


        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new AuthService(http);
            fakeuserResponse = mockUserLoginData;
            let options = new ResponseOptions({ status: 200, body: fakeuserResponse });
            response = new Response(options);
        }));

        it('Get UserDetails By Email :should have expected fake user data ', async(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            let username = 'john@metanoiasolutions.net';

            service.getUserDetailsByEmail(username).do(userData => {
                expect(userData).toBe(mockUserLoginData);
            });
        })));
    })

    describe('User Authentication :', () => {
        let service: AuthService;
        let backend: MockBackend;
        let response: Response;
        let fakeuserAuthenticationResponse;


        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new AuthService(http);
            let mockHeaders = new Headers();
            mockHeaders.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huQG1ldGFub2lhc29sdXRpb25zLm5ldCIsImV4cCI6MTUxNzQ3MDA1MX0.8joCQErTndUekNv9FjPt9XhodnyfN7JnxP6WsPZcztvVNIlgbA1-akOE9O3w97ff3tpKJyXyIIqPWolJKw9o4w');
            let options = new ResponseOptions({ status: 200, headers: mockHeaders });
            response = new Response(options);
        }));

        it('User Authentication :should have expected fake Authentication response from header ', async(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            let username = 'john@metanoiasolutions.net';
            let password = 'Test@123';

            service.userAuthentication(username, password).do(userData => {
                expect(userData).toBe(userData);
            });
        })));
    })



})

let mockUserLoginData = {
    "data": {
        "id": 1,
        "name": "John",
        "email": "john@metanoiasolutions.net",
        "phone": "8096861024",
        "active": true,
        "roles": [{
            "id": 1,
            "name": "ADMIN"
        }]
    },
    "error": null,
    "code": 0
}