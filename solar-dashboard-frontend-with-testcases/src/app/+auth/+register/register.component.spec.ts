
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { RegisterModule } from './register.module';
import { RegisterComponent } from './register.component';
import { Observable } from 'rxjs/Observable';
import { LayoutService } from '../../shared/layout/layout.service';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from '../auth.service';
import { AppModule } from './../../app.module';

describe('Register Component', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceMockStub: AuthServiceStub;

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, RegisterModule],
            providers: [
                { provide: ActivatedRoute, useValue: { 'params': Observable.of([{ 'data': 'Success' }]) } },
                { provide: AuthService, useClass: AuthServiceStub }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
    }));


    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('registration form invalid when page loaded ', () => {
        expect(component.complexForm.valid).toBeFalsy();
    })

    it('valid details(name,phone,email)', () => {
        let name = component.complexForm.controls['name'].setValue('ranjith')
        let email = component.complexForm.controls['email'].setValue('ranjith@gmail.com');
        let phone = component.complexForm.controls['phone'].setValue(8096018362);
        expect(component.complexForm.valid).toBeTruthy();
    })

    it('Valid name,phoneNumber and invalid email form should be invalid', () => {
        let name = component.complexForm.controls['name'].setValue('ranjith')
        let email = component.complexForm.controls['email'].setValue('ranjith@gmailcom');
        let phone = component.complexForm.controls['phone'].setValue(8096018362);
        expect(component.complexForm.valid).toBeFalsy();
    })

    it('Valid name,email and invalid phoneNumber form should be invalid', () => {
        let name = component.complexForm.controls['name'].setValue('ranjith')
        let email = component.complexForm.controls['email'].setValue('ranjith@gmailcom');
        let phone = component.complexForm.controls['phone'].setValue(80960183628096018362);
        expect(component.complexForm.valid).toBeFalsy();
    })

    it('Name field validity', () => {
        let errors = {};
        let name = component.complexForm.controls['name'];
        expect(name.valid).toBeFalsy();

        // name field is required
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set name to something correct
        name.setValue("Test");
        errors = name.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(name.valid).toBeTruthy();
    })


    it('Email field validity', () => {
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

    it('Phone number field validity', () => {
        let errors = {};
        let phone = component.complexForm.controls['phone'];
        expect(phone.valid).toBeFalsy();
        // Phone number field is required
        errors = phone.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set Phone number to something correct
        phone.setValue("1234567890");
        errors = phone.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    })



    describe('registration  ', () => {
        it('User registration process (with valid details)', (done) => {
            let name = component.complexForm.controls['name'].setValue('ranjith')
            let email = component.complexForm.controls['email'].setValue('ranjith@gmail.com');
            let phone = component.complexForm.controls['phone'].setValue(8096018362);
            expect(component.complexForm.valid).toBeTruthy();

            component.userRegisterModel.name = "ranjith";
            component.userRegisterModel.email = "ranjith@gmail.com";
            component.userRegisterModel.phone = '8096018362';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const spy = spyOn(authServiceMockStub, 'userRegister').and.returnValue(Observable.of(mockUserRegisterData));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.register(event);
            setTimeout(() => {
                expect(component.registrationResponse).toBe(mockUserRegisterData);
                expect(navigateSpy).toHaveBeenCalledWith(['/otp', { data: 'Success' }]);
                done();
            }, 2000)
        })

        it('Passing registered mail id and diffrent phone number', (done) => {
            let name = component.complexForm.controls['name'].setValue('ranjith')
            let email = component.complexForm.controls['email'].setValue('ranjith@gmail.com');
            let phone = component.complexForm.controls['phone'].setValue(8096018361);
            expect(component.complexForm.valid).toBeTruthy();

            component.userRegisterModel.name = "ranjith";
            component.userRegisterModel.email = "ranjith@gmail.com";
            component.userRegisterModel.phone = '8096018361';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const spy = spyOn(authServiceMockStub, 'userRegister').and.returnValue(Observable.of(RegistredEmailResponce));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.register(event);
            setTimeout(() => {
                expect(component.registrationResponse).toBe(RegistredEmailResponce);
                done();
            }, 2000)
        })

        it('Passing registered phone number and diffrent mail id', (done) => {
            let name = component.complexForm.controls['name'].setValue('ranjith')
            let email = component.complexForm.controls['email'].setValue('ranjithKumar@gmail.com');
            let phone = component.complexForm.controls['phone'].setValue(8096018362);
            expect(component.complexForm.valid).toBeTruthy();

            component.userRegisterModel.name = "ranjith";
            component.userRegisterModel.email = "ranjithKumar@gmail.com";
            component.userRegisterModel.phone = '8096018362';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const spy = spyOn(authServiceMockStub, 'userRegister').and.returnValue(Observable.of(RegistredPhoneNumberRes));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.register(event);
            setTimeout(() => {
                expect(component.registrationResponse).toBe(RegistredPhoneNumberRes);
                done();
            }, 2000)
        })

        it('Passing registered phone number and mail id', (done) => {
            let name = component.complexForm.controls['name'].setValue('ranjith')
            let email = component.complexForm.controls['email'].setValue('ranjithKumar@gmail.com');
            let phone = component.complexForm.controls['phone'].setValue(8096018362);
            expect(component.complexForm.valid).toBeTruthy();

            component.userRegisterModel.name = "ranjith";
            component.userRegisterModel.email = "ranjith@gmail.com";
            component.userRegisterModel.phone = '8096018362';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const spy = spyOn(authServiceMockStub, 'userRegister').and.returnValue(Observable.of(RegistredEmailResponce));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.register(event);
            setTimeout(() => {
                expect(component.registrationResponse).toBe(RegistredEmailResponce);
                done();
            }, 2000)
        })
    })
})

let mockUserRegisterData =
    {
        "data": [
            {
                "id": 106,
                "name": "ranjith",
                "email": "ranjith@gmail.com",
                "phone": "8096018362",
                "active": false,
                "roles": [
                    {
                        "id": 3,
                        "name": "USER"
                    }
                ],
                "error": null,
                "code": 0
            }
        ]
    }


let RegistredPhoneNumberRes = {
    "data": null,
    "error": {
        "context": null,
        "code": "SCUS002",
        "message": "Phone number already exists"
    },
    "code": -1
}
//name not mandatory
//already registered user
let RegistredEmailResponce = {
    "data": null,
    "error": {
        "context": null,
        "code": "SCUS001",
        "message": "User already exists"
    },
    "code": -1
}


class AuthServiceStub {
    public userRegister(userData: any) {
        return Observable.of(mockUserRegisterData);
    }
}