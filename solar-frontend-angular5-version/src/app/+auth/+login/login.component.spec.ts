
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { LoginModule } from './login.module';
import { LoginComponent } from './login.component';
import { Observable } from 'rxjs/Observable';
import { LayoutService } from '../../shared/layout/layout.service';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from '../auth.service';


describe('Login Component', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMockStub: authServiceStub;

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, LoginModule],
            providers: [
                { provide: ActivatedRoute, useValue: { 'params': Observable.of([{ 'data': 'Success' }]) } },
                { provide: AuthService, useClass: authServiceStub },
                { provide: LayoutService, useClass: layOutServiceStub },

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([LayoutService, AuthService], (injectService: LayoutService, injectauthService: AuthService) => {
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    // it('Checking OTP Notification', () => {
    //     fixture.detectChanges();
    //     console.log(component.otpNotification);
    //     expect(component.otpNotification).toBeDefined();
    // })
    describe('Basic Login-', () => {
        it('Basic User logged-in as Admin', (done) => {
            component.userLogin.username = 'john@metanoiasolutions.net';
            component.userLogin.password = 'Test@123';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const spy = spyOn(authServiceMockStub, 'login').and.returnValue(Observable.of(mockUserLoginData));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.login(event);
            setTimeout(() => {
                expect(component.loginResponse).toBe(mockUserLoginData);
                expect(component.loginResponse.data.roles[0].name).toBe('ADMIN');
                expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/analytics']);
                done();
            }, 2000)

        })


        it('Basic User logged-in as DCManager', (done) => {
            component.userLogin.username = 'john@metanoiasolutions.net';
            component.userLogin.password = 'Test@123';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const spy = spyOn(authServiceMockStub, 'login').and.returnValue(Observable.of(mockDCManagerLoginData));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.login(event);
            setTimeout(() => {
                expect(component.loginResponse).toBe(mockDCManagerLoginData);
                expect(component.loginResponse.data.roles[0].name).toBe('DCMANAGER');
                expect(navigateSpy).toHaveBeenCalledWith(['/dcmanagerloads']);
                done();
            }, 2000)

        })

        it('Basic User logged-in as In valid user permissions return wrong user', (done) => {
            component.userLogin.username = 'john@metanoiasolutions.net';
            component.userLogin.password = 'Test@123';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const spy = spyOn(authServiceMockStub, 'login').and.returnValue(Observable.of(mockAnonymousLoginData));
            //  let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.login(event);
            setTimeout(() => {
                expect(component.loginResponse).toBe(mockAnonymousLoginData);
                expect(component.loginResponse.data.roles[0].name).toBe('DRIVER');
                expect(component.loginErrorMessgae).toEqual('Please Enter Valid Login Credentials.');
                // expect(navigateSpy).toHaveBeenCalledWith(['/dcmanagerloads']);
                done();
            }, 2000)

        })
    })

    describe('User Authentication Login-', () => {
        it('Token Based logged-in as Admin', (done) => {
            component.userLogin.username = 'john@metanoiasolutions.net';
            component.userLogin.password = 'Test@123';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const userAuthenticationSpy = spyOn(authServiceMockStub, 'userAuthentication').and.returnValue(Observable.of(userAuthenticationResponse));
            const spy = spyOn(authServiceMockStub, 'getUserDetailsByEmail').and.returnValue(Observable.of(mockUserLoginData));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.userAuthentication(event);
            setTimeout(() => {
                expect(component.loginResponse).toBe(mockUserLoginData);
                expect(component.loginResponse.data.roles[0].name).toBe('ADMIN');
                expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/analytics']);
                done();
            }, 2000)

        })

        it('Token Based logged-in as DCManager', (done) => {
            component.userLogin.username = 'john@metanoiasolutions.net';
            component.userLogin.password = 'Test@123';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const userAuthenticationSpy = spyOn(authServiceMockStub, 'userAuthentication').and.returnValue(Observable.of(userAuthenticationResponse));
            const spy = spyOn(authServiceMockStub, 'getUserDetailsByEmail').and.returnValue(Observable.of(mockDCManagerLoginData));
            let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.userAuthentication(event);
            setTimeout(() => {
                expect(component.loginResponse).toBe(mockDCManagerLoginData);
                expect(component.loginResponse.data.roles[0].name).toBe('DCMANAGER');
                expect(navigateSpy).toHaveBeenCalledWith(['/dcmanagerloads']);
                done();
            }, 2000)

        })

        it('Token User logged-in as In valid user permissions return wrong user', (done) => {
            component.userLogin.username = 'john@metanoiasolutions.net';
            component.userLogin.password = 'Test@123';
            authServiceMockStub = fixture.debugElement.injector.get(AuthService);
            const userAuthenticationSpy = spyOn(authServiceMockStub, 'userAuthentication').and.returnValue(Observable.of(userAuthenticationResponse));
            const spy = spyOn(authServiceMockStub, 'login').and.returnValue(Observable.of(mockAnonymousLoginData));
            //  let navigateSpy = spyOn((<any>component).router, 'navigate');
            component.login(event);
            setTimeout(() => {
                expect(component.loginResponse).toBe(mockAnonymousLoginData);
                expect(component.loginResponse.data.roles[0].name).toBe('DRIVER');
                expect(component.loginErrorMessgae).toEqual('Please Enter Valid Login Credentials.');
                // expect(navigateSpy).toHaveBeenCalledWith(['/dcmanagerloads']);
                done();
            }, 2000)

        })
    })



})


class authServiceStub {
    public login(userName: string, password: string) {
        return Observable.of(mockUserLoginData);
    }

    public userAuthentication(userName: string, password: string) {
        return Observable.of(userAuthenticationResponse);
    }
    public getUserDetailsByEmail(userName: string) {
        return Observable.of(mockUserLoginData);
    }
}

class layOutServiceStub {
    store: any;
}

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

let mockDCManagerLoginData = {
    "data": {
        "id": 1,
        "name": "John",
        "email": "john@metanoiasolutions.net",
        "phone": "8096861024",
        "active": true,
        "roles": [{
            "id": 4,
            "name": "DCMANAGER"
        }]
    },
    "error": null,
    "code": 0
}

let mockAnonymousLoginData = {
    "data": {
        "id": 1,
        "name": "John",
        "email": "john@metanoiasolutions.net",
        "phone": "8096861024",
        "active": true,
        "roles": [{
            "id": 2,
            "name": "DRIVER"
        }]
    },
    "error": null,
    "code": 0
}

let userAuthenticationResponse = {
    "status": 200
}
