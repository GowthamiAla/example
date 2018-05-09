import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DriversModule } from '../../drivers.module';
import { DriverUpdateComponent } from './driver.update.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { DriverService } from '../../services/driver.service';
import { AppModule } from '../../../app.module';
import { timeInterval } from 'rxjs/operator/timeInterval';
import { timeout } from 'q';


describe('Update driver Component', () => {
    let component: DriverUpdateComponent;
    let fixture: ComponentFixture<DriverUpdateComponent>;
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
                { provide: ActivatedRoute, useValue: { 'params': Observable.of([{ 'id': 22 }]) } },
                { provide: DriverService, useValue: driversServicedatastub },
                { provide: Location, useValue: locationMock },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverUpdateComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([DriverService], (injectService: DriverService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });


    it('On ngOnInit get the driver and vendors list', ((done) => {
        fixture = TestBed.createComponent(DriverUpdateComponent);
        component = fixture.componentInstance;
        driversServicedatastub = fixture.debugElement.injector.get(DriverService);

        const spyDriversData = spyOn(driversServicedatastub, 'getDriverDetailsByID').and.returnValue(Promise.resolve(mockgetDriverResponse.data));
        fixture.detectChanges();
        setTimeout(() => {
            expect(component.driver).toEqual(mockgetDriverResponse.data);
        }, 2000)



        const spyVendorsList = spyOn(driversServicedatastub, 'getVendorsInfo').and.returnValue(Observable.of(mockVendorsData));
        setTimeout(() => {
            expect(component.vendorsList).toEqual(mockVendorsData);
            done();
        }, 3000)

    }));

    it('Update Driver form is invalid when page loaded', () => {
        expect(component.complexForm.valid).toBeFalsy();
    });

    it('Update Driver email field validity', () => {
        expect(component.driver.email).toBeFalsy();

        component.driver.email = 'test@gmail.com';
        expect(component.driver.email).toBeTruthy();

    })

    it('Update Driver Phone number field validity', () => {
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

    it('Update Driver First name field validity', () => {
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

    it('Update Driver Last name field validity', () => {
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


    it('Update Driver License number field validity', () => {
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

    it('Update Driver Last name field validity', () => {
        let errors = {};
        let vendor = component.complexForm.controls['vendorNum'];
        expect(vendor.valid).toBeFalsy();
        vendor.setValue(mockVendorsData[0].vendorNbr);
        expect(vendor.valid).toBeTruthy();
    })

    it('Update Driver Date of birth field validity', () => {
        expect(component.selectedDate).toBeFalsy();

        component.selectedDate = mockDatePickerResponse;
        expect(component.selectedDate).toBeTruthy();

        component.driver.dateOfBirth = mockDatePickerResponse.jsdate;
        expect(component.driver.dateOfBirth).toBeTruthy();
    })

    it('Update Driver Driver license expiry date field validity', () => {
        expect(component.selectedLicenseExpiryDate).toBeFalsy();

        component.selectedLicenseExpiryDate = mockDatePickerResponse;
        expect(component.selectedLicenseExpiryDate).toBeTruthy();

        component.driver.licenseExpiryDate = mockDatePickerResponse.jsdate;
        expect(component.driver.licenseExpiryDate).toBeTruthy();
    })


    it('Checking Update Driver Form Validity', () => {

        component.complexForm.controls['licenseNumber'].setValue('ABCD4567890XYZ');
        component.complexForm.controls['phoneNumber'].setValue(1234567890);
        component.complexForm.controls['firstName'].setValue('test');
        component.complexForm.controls['lastName'].setValue('test');
        component.complexForm.controls['vendorNum'].setValue(mockVendorsData[0].vendorNbr);
        expect(component.complexForm.valid).toBeTruthy();
    })

    it('Submit the Update Driver details sucessfully and drivers list called', (done) => {

        component.complexForm.controls['licenseNumber'].setValue('ABCD4567890XYZ');
        component.complexForm.controls['phoneNumber'].setValue(1234567890);
        component.complexForm.controls['firstName'].setValue('test');
        component.complexForm.controls['lastName'].setValue('test');
        component.complexForm.controls['vendorNum'].setValue(mockVendorsData[0].vendorNbr);

        expect(component.complexForm.valid).toBeTruthy();
        component.driver.id = '22';
        component.driver.user = mockgetDriverResponse.data.user;
        component.driver.lastName = mockgetDriverResponse.data.lastName;
        component.driver.firstName = "test";
        component.driver.email = 'test@gmail.com';
        component.driver.selectedDate = mockDatePickerResponse;
        component.driver.phoneNumber = mockgetDriverResponse.data.phoneNumber;
        component.driver.licenseNumber = 'ABCD4567890XYZ';
        component.driver.vendorId = mockVendorsData[0].vendorNbr;
        component.driver.selectedLicenseExpiryDate = mockDatePickerResponse;
        component.driver.latitude = mockgetDriverResponse.data.latitude;
        component.driver.longitude = mockgetDriverResponse.data.longitude;
        component.driver.password = mockgetDriverResponse.data.password;

        driversServicedatastub = fixture.debugElement.injector.get(DriverService);
        const spyUpdateDriversData = spyOn(driversServicedatastub, 'updateDriver').and.returnValue(Promise.resolve(mockgetDriverResponse));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.submitForm(component.complexForm.value);

        setTimeout(() => {
            expect(mockgetDriverResponse.data).toBeDefined();
        }, 1000)
        setTimeout(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/drivers']);
            done();
        }, 4500)

    })

    it('Back button go back to drivers page', () => {
        fixture = TestBed.createComponent(DriverUpdateComponent);
        component = fixture.componentInstance;

        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.goBack();
        expect(navigateSpy).toHaveBeenCalledWith(['/drivers']);
    });



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

let mockgetDriverResponse = {
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
        "password": "$2a$10$AQbzUe3c93rMI0H./crIbeUrgyiiek7YyRA2FGcuEaanv2a9u26ea",
        "latitude": 29.70949934155617,
        "longitude": -95.33777739062498,
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
    public getDriverDetailsByID(id) {
        return Promise.resolve(mockgetDriverResponse.data);
    }
    public updateDriver(driver) {
        return Promise.resolve(mockgetDriverResponse);
    }
  

}