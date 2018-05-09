
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { DriversModule } from '../../drivers.module';
import { DriverAddComponent } from './driver.add.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { DriverService } from '../../services/driver.service';
import { AppModule } from '../../../app.module';




describe('Add driver Component', () => {
    let component: DriverAddComponent;
    let fixture: ComponentFixture<DriverAddComponent>;
    let routerMock;
    let routerSpy: any;
    let location: Location;
    let router: Router;
    let driversServicedatastub: driversServicedatastub;
    let locationMock: any;

    let mockDatePickerResponse = {
        "date": {
            "year": 1970,
            "month": 1,
            "day": 1
        },
        "jsdate": "1969-12-31T18:30:00.000Z",
        "formatted": "01-01-1970",
        "epoc": -19800
    }
    beforeEach((() => {
        // routerMock = {
        //     navigate: jasmine.createSpy('navigate')
        // };

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, DriversModule],
            declarations: [],
            providers: [
                //  { provide: Router, useValue: routerMock },
                { provide: DriverService, useValue: driversServicedatastub },
                { provide: Location, useValue: locationMock },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverAddComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([DriverService], (injectService: DriverService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });



    it('On ngOnInit get the vendors list', async(() => {
        fixture = TestBed.createComponent(DriverAddComponent);
        component = fixture.componentInstance;
        driversServicedatastub = fixture.debugElement.injector.get(DriverService);
        const spy = spyOn(driversServicedatastub, 'getVendorsInfo').and.returnValue(Observable.of(mockVendorsData));
        fixture.detectChanges();
        expect(component.vendorsList).toEqual(mockVendorsData);
    }));

    it('Add Driver form is invalid when page loaded', () => {
        expect(component.complexForm.valid).toBeFalsy();
    });

    it('Add Driver email field validity', () => {
        let errors = {};
        let email = component.complexForm.controls['email'];
        expect(email.valid).toBeFalsy();

        // Email field is required
        errors = email.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set email to something wrong pattern
        email.setValue("test");
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();

        // Set email to something correct
        email.setValue("test@example.com");
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    })

    it('Add Driver Phone number field validity', () => {
        let errors = {};
        let phone = component.complexForm.controls['phoneNumber'];
        expect(phone.valid).toBeFalsy();
        // Email field is required
        errors = phone.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set email to something correct
        phone.setValue("1234567890");
        errors = phone.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    })

    it('Add Driver First name field validity', () => {
        let errors = {};
        let firstname = component.complexForm.controls['firstName'];
        expect(firstname.valid).toBeFalsy();

        // Email field is required
        errors = firstname.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set email to something correct
        firstname.setValue("Test");
        errors = firstname.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(firstname.valid).toBeTruthy();
    })

    it('Add Driver Last name field validity', () => {
        let errors = {};
        let lastname = component.complexForm.controls['lastName'];
        expect(lastname.valid).toBeTruthy();

        // Email field is required
        errors = lastname.errors || {};


        // Set email to something correct
        lastname.setValue("Test");
        errors = lastname.errors || {};
        expect(errors['pattern']).toBeFalsy();
        expect(lastname.valid).toBeTruthy();
    })


    it('Add Driver License number field validity', () => {
        let errors = {};
        let license = component.complexForm.controls['licenseNumber'];

        expect(license.valid).toBeFalsy();

        // Email field is required
        errors = license.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set email to something correct
        license.setValue("ABCD4567890XYZ");
        errors = license.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(license.valid).toBeTruthy();
    })

    it('Add Driver Last name field validity', () => {
        let errors = {};
        let vendor = component.complexForm.controls['vendorNum'];
        expect(vendor.valid).toBeFalsy();
        vendor.setValue(mockVendorsData[0].vendorNbr);
        expect(vendor.valid).toBeTruthy();
    })

    it('Add Driver Date of birth field validity', () => {
        expect(component.dateBirth).toBeFalsy();

        component.dateBirth = mockDatePickerResponse;
        expect(component.dateBirth).toBeTruthy();
    })

    it('Add Driver Driver license expiry date field validity', () => {
        expect(component.licenseExpiry).toBeFalsy();

        component.licenseExpiry = mockDatePickerResponse;
        expect(component.licenseExpiry).toBeTruthy();

        component.driver.licenseExpiryDate = mockDatePickerResponse.jsdate;
        expect(component.driver.licenseExpiryDate).toBeTruthy();
    })

    it('Checking Add Driver Form Validity', () => {
        component.complexForm.controls['licenseNumber'].setValue('ABCD4567890XYZ');
        component.complexForm.controls['email'].setValue('test@example.com');
        component.complexForm.controls['phoneNumber'].setValue(1234567890);
        component.complexForm.controls['firstName'].setValue('test');
        component.complexForm.controls['lastName'].setValue('test');
        component.complexForm.controls['vendorNum'].setValue(mockVendorsData[0].vendorNbr);
        expect(component.complexForm.valid).toBeTruthy();
    })

    it('Submit the Add Driver details sucessfully', (done) => {

        component.complexForm.controls['licenseNumber'].setValue('ABCD4567890XYZ');
        component.complexForm.controls['email'].setValue('test@example.com');
        component.complexForm.controls['phoneNumber'].setValue(1234567890);
        component.complexForm.controls['firstName'].setValue('test');
        component.complexForm.controls['lastName'].setValue('test');
        component.complexForm.controls['vendorNum'].setValue(mockVendorsData[0].vendorNbr);
        expect(component.complexForm.valid).toBeTruthy();


        component.dateBirth = mockDatePickerResponse;
        component.driver.vendor = mockVendorsData[0].vendorNbr;
        component.licenseExpiry = mockDatePickerResponse;
        component.driver.firstName = 'test';
        component.driver.lastName = 'test';
        component.driver.email = 'test@example.com';
        component.driver.phoneNumber = "1234567890";
        component.driver.licenseNumber = 'ABCD4567890XYZ';


        driversServicedatastub = fixture.debugElement.injector.get(DriverService);
        const spy = spyOn(driversServicedatastub, 'addDriver').and.returnValue(Promise.resolve(mockAddDriverResponse));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.submitForm(component.complexForm.value);

        setTimeout(() => {
            expect(mockAddDriverResponse.data).toBeDefined();
        }, 1000)
        setTimeout(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/drivers']);
            done();
        }, 4500)

        // component.submitForm(component.complexForm.value);
        // component.complexForm.controls['phoneNumber'].setValue(mockAddDriverResponse.data.phoneNumber);
        // driversServicedatastub = fixture.debugElement.injector.get(DriverService);
        // const spy = spyOn(driversServicedatastub, 'addDriver').and.returnValue(Promise.resolve(mockAddDriverResponse));
        // expect(component.complexForm.controls['phoneNumber'].value).toBe(mockAddDriverResponse.data.phoneNumber);
    })


    it('Button cancel go back to drivers page', () => {
        component.navigated = true;
        spyOn(window.history, 'back');
        component.goBack();
        expect(window.history.back).toHaveBeenCalled();
    })

})


//mocking the driver  service
let mockVendorsData = [{
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

let mockAddDriverResponse = {
    "data": {
        "id": 22,
        "user": {
            "id": 64,
            "name": "Test",
            "email": "aaron@metanoiasolutions.net",
            "phone": "2602185194",
            "active": true,
            "roles": [{
                "id": 2,
                "name": "DRIVER"
            }]
        },
        "dateOfBirth": "1982-01-12T18:30:00Z",
        "firstName": "Test",
        "lastName": "Test",
        "email": "aaron@metanoiasolutions.net",
        "phoneNumber": "1234567890",
        "licenseNumber": "ABCD4567890XYZ",
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

class driversServicedatastub {
    public getVendorsInfo() {
        return Observable.of(mockVendorsData);
    }
    public addDriver(Driver) {
        return Promise.resolve(mockAddDriverResponse);
    }
}