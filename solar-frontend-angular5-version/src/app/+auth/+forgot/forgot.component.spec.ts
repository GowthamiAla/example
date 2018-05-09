
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { ForgotComponent } from './forgot.component'
import { ForgotModule } from './forgot.module';
import { AppModule } from './../../app.module';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../shared/utils/notification.service';

describe('Forgot password component', () => {

    let component: ForgotComponent;
    let fixture: ComponentFixture<ForgotComponent>
    let authServicedataStub: AuthServicedataStub;
    let alertNotificationServiceStub: NotificationService

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ForgotModule],
            providers: [
                { provide: AuthService, useClass: AuthServicedataStub },
                { provide: NotificationService, useClass: NotificationService }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ForgotComponent);
        component = fixture.componentInstance;
    }));

    beforeEach(inject([AuthService], (injectService: AuthService) => {
    }));

    it('should create a forgot Component', () => {
        expect(component).toBeTruthy();
    })
    it('On init component load form should be invalid', () => {
        expect(component.complexForm.valid).toBeFalsy();
    })


    it('valid email and password', () => {
        component.complexForm.controls['email'].setValue('test@example.com');
        component.complexForm.controls['phone'].setValue(1234567890);
        expect(component.complexForm.valid).toBeTruthy();
    })

    it('forgot password email field validity', () => {
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


    it('forgot password phoneNumber field validity', () => {
        let errors = {};
        let phone = component.complexForm.controls['phone'];
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


    it('submit details for getting OTP', (done) => {
        let email = component.complexForm.controls['email'].setValue('john@metanoiasolutions.net');
        let phone = component.complexForm.controls['phone'].setValue(8096018362);
        expect(component.complexForm.valid).toBeTruthy();

        authServicedataStub = fixture.debugElement.injector.get(AuthService);
        const spy = spyOn(authServicedataStub, 'userForgotPassword').and.returnValue(Observable.of(mockForgotData))
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.submit(component.complexForm.value);
        expect(component.forgotPasswordResponce).toBe(mockForgotData);
        expect(component.forgotPasswordResponce.data.email).toBe(email)
        expect(component.forgotPasswordResponce.data.phone).toBe(phone)
        expect(navigateSpy).toHaveBeenCalledWith(['/otp', { data: 'Success' }]);
        done();
    })

    it('submit details for getting OTP but passing wrong email and correct phone Number then returns wrong details', (done) => {
        let email = component.complexForm.controls['email'].setValue('john@gmail.com');
        let phone = component.complexForm.controls['phone'].setValue(8096018362);
        authServicedataStub = fixture.debugElement.injector.get(AuthService)
        const spy = spyOn(authServicedataStub, 'userForgotPassword').and.returnValue(Observable.of(emailError))
        component.submit(component.complexForm.value);
        expect(component.forgotPasswordResponce).toBe(emailError)
        expect(component.errorMessage).toBe('Please enter valid email and phone number')
        done();
    })

    it('submit details for getting OTP but passing wrong phone Number and correct email then returns wrong details', (done) => {
        let email = component.complexForm.controls['email'].setValue('john@metanoiasolutions.com');
        let phone = component.complexForm.controls['phone'].setValue(9888888888);
        authServicedataStub = fixture.debugElement.injector.get(AuthService)
        const spy = spyOn(authServicedataStub, 'userForgotPassword').and.returnValue(Observable.of(phoneNumberError))
        component.submit(component.complexForm.value);
        expect(component.forgotPasswordResponce).toBe(phoneNumberError)
        expect(component.errorMessage).toBe('Email and phone number are does not match')
        done();
    })
})

let mockForgotData = {
    "data": [
        {
            "id": 1,
            "name": "John",
            "email": "john@metanoiasolutions.net",
            "phone": "8096018362",
            "active": true,
            "roles": [
                {
                    "id": 1,
                    "name": "ADMIN"
                }
            ],
            "error": null,
            "code": 0
        }
    ]
}

let emailError = {
    "data": null,
    "error": {
        "context": null,
        "code": "SCUS024",
        "message": "Please enter valid email and phone number"
    },
    "code": -1
}

let phoneNumberError = {
    "data": null,
    "error": {
        "context": null,
        "code": "SCUS023",
        "message": "Email and phone number are does not match"
    },
    "code": -1
}
class AuthServicedataStub {

    public userForgotPassword(email: any, phone: any) {
        return Observable.of(mockForgotData)
    }
}
class AlertNotificationServiceStub {

}
