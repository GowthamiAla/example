import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { DriverService } from './driver.service';
import { driver } from 'app/+dc_manager/+loads/models/load.data';
import { Observable } from 'rxjs/Observable';
import { addClassName } from 'app/shared/utils/dom-helpers';

const getDriverListResponse = {
    "data": [{
        "id": 22,
        "user": {
            "id": 64,
            "name": "Aaron",
            "email": "aaron@metanoiasolutions.net",
            "phone": "2602185194",
            "active": true,
            "roles": [{
                "id": 2,
                "name": "DRIVER"
            }]
        },
        "dateOfBirth": "1982-01-13T00:00:00+05:30",
        "firstName": "Aaron",
        "lastName": "Maisie",
        "email": "aaron@metanoiasolutions.net",
        "phoneNumber": "2602185194",
        "password": "$2a$10$Wj2sTGAdO8kWAWCXtZ2iHOC5Axd8s0TvC2xa0aimA09lYqiEbi8/m",
        "latitude": 29.70949934155617,
        "longitude": -95.33777739062498,
        "licenseNumber": "F25592150094",
        "licenseExpiryDate": "2030-01-13T00:00:00+05:30",
        "vendor": {
            "vendorNbr": "141401",
            "vendorName": "ROBINSON SALT SUPPLY INC.",
            "phoneNumber": "9909889908",
            "email": "robinson@gmail.com",
            "address": "Los Angeles",
            "state": "AK",
            "city": "CA",
            "country": "US",
            "zipCode": "234566"
        }
    }],
    "error": null,
    "code": 0
};

let AddDriverObject = {
    "user": {},
    "dateOfBirth": "1982-01-12T18:30:00Z",
    "firstName": "Aaron",
    "lastName": "Maisie",
    "email": "aaron@metanoiasolutions.net",
    "phoneNumber": "2602185194",
    "password": "$2a$10$4wFjqMsfdpGVw9.UxOhPyONDqRY85LK5Dln9t45fQ9pBHw7wluwhi",
    "latitude": 29.70949934155617,
    "longitude": -95.33777739062498,
    "licenseNumber": "F25592150094",
    "licenseExpiryDate": "2030-01-12T18:30:00Z",
    "vendor": {
        "vendorNbr": "141402"
    }
}

let UpdateDriverObject = {
    "id": "22",
    "user": {},
    "dateOfBirth": new Date("1982-01-12T18:30:00Z"),
    "firstName": "Aaron",
    "lastName": "Maisie",
    "email": "aaron@metanoiasolutions.net",
    "phoneNumber": "2602185194",
    "password": "$2a$10$4wFjqMsfdpGVw9.UxOhPyONDqRY85LK5Dln9t45fQ9pBHw7wluwhi",
    "latitude": 29.70949934155617,
    "longitude": -95.33777739062498,
    "licenseNumber": "F25592150094",
    "licenseExpiryDate":new Date("2030-01-12T18:30:00Z"),
    "vendor": {
        "vendorNbr": "141402"
    }
}

let addDriverResponse = {
    "data": {
        "id": 22,
        "user": {
            "id": 64,
            "name": "Aaron",
            "email": "aaron@metanoiasolutions.net",
            "phone": "2602185194",
            "active": true,
            "roles": [{
                "id": 2,
                "name": "DRIVER"
            }]
        },
        "dateOfBirth": "1982-01-12T18:30:00Z",
        "firstName": "Aaron",
        "lastName": "Maisie",
        "email": "aaron@metanoiasolutions.net",
        "phoneNumber": "2602185194",
        "password": "$2a$10$AQbzUe3c93rMI0H./crIbeUrgyiiek7YyRA2FGcuEaanv2a9u26ea",
        "latitude": 29.70949934155617,
        "longitude": -95.33777739062498,
        "licenseNumber": "F25592150094",
        "licenseExpiryDate": "2030-01-12T18:30:00Z",
        "vendor": {
            "vendorNbr": "141401",
            "vendorName": null,
            "phoneNumber": null,
            "email": null,
            "address": null,
            "state": null,
            "city": null,
            "country": null,
            "zipCode": null
        }
    },
    "error": null,
    "code": 0
}

let vendorDetails = {
    "data": [{
        "vendorNbr": "141401",
        "vendorName": "ROBINSON SALT SUPPLY INC.",
        "phoneNumber": "9909889908",
        "email": "robinson@gmail.com",
        "address": "Los Angeles",
        "state": "AK",
        "city": "CA",
        "country": "US",
        "zipCode": "234566"
    }]
}

let driverDeleteFakeResponse = {
    "data": null,
    "error": {
        "context": null,
        "code": "SCUS108",
        "message": "Driver can't be deleted as a load is assigned to the driver"
    },
    "code": -1
}

describe('Driver Service', () => {


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                DriverService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        }).compileComponents();


    });

    it('Instantiating Driver service when to inject service', inject([DriverService], (service: DriverService) => {
        expect(service instanceof DriverService).toBe(true);
    }));


    it('Instantiate service with "new" and with Http request', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new DriverService(http);
        expect(service instanceof DriverService).toBe(true, 'new service should be ok');
    }));


    it('Providing mock service data to mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        }));

    describe('Get Drivers list Service :', () => {
        let service: DriverService;
        let backend: MockBackend;
        let response: Response;
        let fakeDriverResponse;


        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new DriverService(http);
            fakeDriverResponse = getDriverListResponse;
            let options = new ResponseOptions({ status: 200, body: fakeDriverResponse });
            response = new Response(options);
        }));

        it('should have expected fake drivers list ', async(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getDrivers().do(drivers => {
                expect(drivers.length).toBe(fakeDriverResponse.data.length,
                    'should have expected no. of drivers');
            });
        })));

        it('should treat as http service error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({ status: 404 || 500 }));
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(resp));

            service.getDrivers()
                .do(drivers => {
                    fail('should not respond with drivers');
                })
                .catch(err => {
                    expect(err).toMatch(/status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                })
        })));
    })


    describe('Get Drivers details by Id :', () => {
        let service: DriverService;
        let backend: MockBackend;
        let response: Response;
        let fakeDriverResponse;


        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new DriverService(http);
            fakeDriverResponse = getDriverListResponse;
            let options = new ResponseOptions({ status: 200, body: fakeDriverResponse });
            response = new Response(options);
        }));

        it('should have expected fake drivers by Id ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            tick();
            let fakeGetDriverId = '22';
            service.getDriverDetailsByID(fakeGetDriverId).then(driver => {
                expect(driver.id).toBe(+fakeGetDriverId);
            });
        })));

    })

    describe('Add Drivers details :', () => {
        let service: DriverService;
        let backend: MockBackend;
        let response: Response;
        let fakeDriverResponse;


        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new DriverService(http);
            let options = new ResponseOptions({ status: 200, body: addDriverResponse });
            response = new Response(options);
        }));

        it('It must Add a fake driver', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            tick();
            // updating first with fake user name
            service.addDriver(AddDriverObject).then(driver => {
                expect(driver.data.email).toBe(AddDriverObject.email);
            });
        })));

    })


    describe('Update Drivers details by Id :', () => {
        let service: DriverService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new DriverService(http);
            let options = new ResponseOptions({ status: 200, body: addDriverResponse });
            response = new Response(options);
        }));

        it('should have  fake drivers by Id ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            tick();
            // updating first with fake user name
            service.updateDriver(UpdateDriverObject).then(driver => {
                expect(driver.data.email).toBe(UpdateDriverObject.email);
            });
        })));

    })

    describe('Get vendors details :', () => {
        let service: DriverService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new DriverService(http);
            let options = new ResponseOptions({ status: 200, body: vendorDetails });
            response = new Response(options);
        }));

        it('should have  fake vendors details ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            tick();
            // updating first with fake user name
            service.getVendorsInfo().do(vendors => {
                expect(vendors.vendorNbr).toBe(vendorDetails.data[0].vendorNbr);
            });
        })));

    })

    describe('Delete Driver By Id :', () => {
        let service: DriverService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new DriverService(http);
            let options = new ResponseOptions({ status: 200, body: driverDeleteFakeResponse });
            response = new Response(options);
        }));

        it('should delete the driver details ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            tick();
            // updating first with fake user name
            service.deletedriver(UpdateDriverObject).then(driver => {
                expect(driver.error.message).toBe(driverDeleteFakeResponse.error.message);
            });
        })));

    })

});

