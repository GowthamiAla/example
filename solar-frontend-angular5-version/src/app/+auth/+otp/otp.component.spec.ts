
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { OtpModule } from './otp.module';
import { OtpComponent } from './otp.component';
import { Observable } from 'rxjs/Observable';
import { LayoutService } from '../../shared/layout/layout.service';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from '../auth.service';
import { AppModule } from './../../app.module';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
describe('Otp Component', () => {
    let component: OtpComponent;
    let fixture: ComponentFixture<OtpComponent>
    let authServiceMockStub: AuthServiceStub;
    let FormControl: FormControl;

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, OtpModule],
            providers: [
                { provide: ActivatedRoute, useValue: { 'params': Observable.of([{ 'data': 'Success' }]) } },
                { provide: AuthService, useClass: AuthServiceStub }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(OtpComponent);
        component = fixture.componentInstance
    }));


    // it('MatchPassword()', () => {
    //     let otp = component.complexForm.controls['otp'].setValue(123456)
    //     let password = component.complexForm.controls['password'].setValue('Test@123');
    //     let retypePassword = component.complexForm.controls['retypePassword'].setValue('Test@123');
    //     component.MatchPassword(FormControl)
    //     expect(component.password).toEqual(component.retypePassword)
    // })



    it('Should create component', () => {
        expect(component).toBeTruthy();
    })

    it('Otp form invalid when page loaded ', () => {
        expect(component.complexForm.valid).toBeFalsy();
    })

    it('Otp field validity', () => {
        let errors = {};
        let otp = component.complexForm.controls['otp'];
        expect(otp.valid).toBeFalsy();
        // otp field is required
        errors = otp.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set otp something correct
        otp.setValue("123456");
        errors = otp.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();


        // Set otp something Wrong
        /**
         * length only 6 letters
         */
        otp.setValue("1234567890");
        errors = otp.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();
    })

    it('Password field validity', () => {
        let errors = {};
        let password = component.complexForm.controls['password'];
        expect(password.valid).toBeFalsy();
        // otp field is required
        errors = password.errors || {};
        expect(errors['required']).toBeTruthy();

        /**
         --> Set otp something correct
         * required correct
         * patten wrong
         */
        password.setValue("Test");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();

        /**
         -->Set otp something correct
         * patten and required correct
         */
        password.setValue("Test@123");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    })

    it('Otp Form Validations With valid details', (done) => {
        let otp = component.complexForm.controls['otp'].setValue(123456)
        let password = component.complexForm.controls['password'].setValue('Test@123');
        let retypePassword = component.complexForm.controls['retypePassword'].setValue('Test@123');
        expect(password).toEqual(retypePassword)

        authServiceMockStub = fixture.debugElement.injector.get(AuthService);
        const spy = spyOn(authServiceMockStub, 'userOTP').and.returnValue(Observable.of(mockUserOtpData));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.register(event);
        setTimeout(() => {
            expect(component.otpResponse).toBe(mockUserOtpData);
            expect(component.otpResponse.data.roles[0].name).toBe('ADMIN');
            expect(navigateSpy).toHaveBeenCalledWith(['/login', { data: 'Success' }]);
            done();
        }, 2000)
    })


    it('Basic User logged-in as In valid user permissions return wrong user ', (done) => {
        let otp = component.complexForm.controls['otp'].setValue(123456)
        let password = component.complexForm.controls['password'].setValue('Test@123');
        let retypePassword = component.complexForm.controls['retypePassword'].setValue('Test@123');
        expect(password).toEqual(retypePassword)

        authServiceMockStub = fixture.debugElement.injector.get(AuthService);
        const spy = spyOn(authServiceMockStub, 'userOTP').and.returnValue(Observable.of(mockAnonymousUserOtpData));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.register(event);
        setTimeout(() => {
            expect(component.otpResponse).toBe(mockAnonymousUserOtpData);
            expect(component.otpResponse.data.roles[0].name).toBe('DRIVER');
            done();
        }, 2000)
    })


    it('password and conform password Should not match then form is invalid', () => {
        let otpp = component.complexForm.controls['otp'].setValue(123456)
        let password = component.complexForm.controls['password'].setValue('Test@123');
        let retypePassword = component.complexForm.controls['retypePassword'].setValue('Tesst@123');
        //console.log(component.complexForm.valid)
        expect(component.password).not.toEqual(component.retypePassword)
    })


    it('Passing wrong otp', () => {
        let otp = component.complexForm.controls['otp'].setValue(1234956)
        let password = component.complexForm.controls['password'].setValue('Test@123');
        let retypePassword = component.complexForm.controls['retypePassword'].setValue('Test@123');
        expect(password).toEqual(retypePassword)

        authServiceMockStub = fixture.debugElement.injector.get(AuthService);
        const spy = spyOn(authServiceMockStub, 'userOTP').and.returnValue(Observable.of(mockUserOtpDataErrorData));
        component.register(event);
        expect(component.otpResponse).toEqual(mockUserOtpDataErrorData)
    })
})



let mockUserOtpDataErrorData = {
    "data": null,
    "error": {
        "context": null,
        "code": "SCUS020",
        "message": "Error in setting password"
    },
    "code": -1
}

let mockUserOtpData = {
    "data":
    {
        "id": 109,
        "name": "ramu",
        "email": "rvishwanatham@metanoiasolutions.net",
        "phone": "8096018363",
        "active": true,
        "roles": [{
            "id": 1,
            "name": "ADMIN"
        }],
        "error": null,
        "code": 0
    }

};
let mockAnonymousUserOtpData = {
    "data":
    {
        "id": 109,
        "name": "ramu",
        "email": "rvishwanatham@metanoiasolutions.net",
        "phone": "8096018363",
        "active": true,
        "roles": [{
            "id": 1,
            "name": "DRIVER"
        }],
        "error": null,
        "code": 0
    }

};
class AuthServiceStub {
    public userOTP(otp: number, password: string) {
        return Observable.of(mockUserOtpData);
    }
}


// it('MatchPassword()', () => {
//     let otp = component.complexForm.controls['otp'].setValue(123456)
//     let password = component.complexForm.controls['password'].setValue('Test@123');
//     let retypePassword = component.complexForm.controls['retypePassword'].setValue('Test@123');
//     component.MatchPassword(FormControl)
//     expect(component.password).toEqual(component.retypePassword)
// })






//https://dzone.com/articles/writing-and-testing-custom-angular-validators-the