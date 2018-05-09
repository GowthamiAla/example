import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { UserModule } from '../users.module';
import { EditUserComponent } from './edit-user.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user.service';
import { AppModule } from '../../../app.module';
import { HeaderModule } from '../../../shared/layout/header/header.module';
import { ActivitiesService } from '../../../shared/layout/header/activities/activities.service';
import { EventsService } from '../../../+calendar/shared/events.service';
import { timeout } from 'q';
import { combineAll } from 'rxjs/operator/combineAll';


describe('Edit user Component', () => {
    let component: EditUserComponent;
    let fixture: ComponentFixture<EditUserComponent>;
    let routerMock;
    let routerSpy: any;

    //let usersServicedatastub: usersServicedatastub;



    beforeEach((() => {
        // routerMock = {
        //     navigate: jasmine.createSpy('navigate')
        // };userId

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, UserModule, HeaderModule],
            declarations: [],
            providers: [
                //  { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: { 'params': Observable.of({ 'userId': 10 }) } },
                { provide: UserService, useClass: usersServicedatastub },
                { provide: ActivitiesService, useClass: activitesStubData },
                { provide: EventsService, useClass: eventsStubData }

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditUserComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([UserService], (injectService: UserService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });


    it('On ngOnInit get the User details', ((done) => {
        fixture = TestBed.createComponent(EditUserComponent);
        component = fixture.componentInstance;
        let usersServicedatastub = fixture.debugElement.injector.get(UserService);

        const spyUsersData = spyOn(usersServicedatastub, 'getUserDetailsByID').and.returnValue(Promise.resolve(mockUserData.data));
        fixture.detectChanges();
            setTimeout(() => {
               done();
            expect(component.userDetails).toEqual(mockUserData.data);
            },2000)
    }));

    it('Update User form is invalid when page loaded', () => {
        expect(component.complexForm.valid).toBeFalsy();
    });

    it('Update User email field validity', () => {
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


    it('Update User Phone number field validity', () => {
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

    it('Update user Username field validity', () => {
        let errors = {};
        let username = component.complexForm.controls['username'];
        expect(username.valid).toBeFalsy();

        // username field is required
        errors = username.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set username to something correct
        username.setValue("Test");
        errors = username.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(username.valid).toBeTruthy();
    })

    it('update User Role field validity', () => {
        let errors = {};
        let role = component.complexForm.controls['roles'];
        expect(role.valid).toBeFalsy();
        role.setValue(mockRolesData.data[0].name);
        expect(role.valid).toBeTruthy();
    })


    it('Checking Update User Form Validity', () => {

        component.complexForm.controls['username'].setValue('john');
        component.complexForm.controls['phone'].setValue(1234567890);
        component.complexForm.controls['email'].setValue('aaron@metanoiasolutions.ne');
        component.complexForm.controls['roles'].setValue('ADMIN');

        expect(component.complexForm.valid).toBeTruthy();
    })

    it('Submit the Update User details sucessfully and users list called', (done) => {

        component.complexForm.controls['username'].setValue('john');
        component.complexForm.controls['phone'].setValue(1234567890);
        component.complexForm.controls['email'].setValue('aaron@metanoiasolutions.ne');
        component.complexForm.controls['roles'].setValue('ADMIN');



        expect(component.complexForm.valid).toBeTruthy();
        component.userDetails.id = '10';
        component.userDetails.username = mockUserData.data.username;
        component.userDetails.email = mockUserData.data.email;
        component.userDetails.phone = mockUserData.data.phone;
        component.userDetails.roles = mockUserData.data.roles;


        let usersServicedatastub = fixture.debugElement.injector.get(UserService);
        const spyUpdateUsersData = spyOn(usersServicedatastub, 'updateUser').and.returnValue(Observable.of(mockUserData));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.updateUser();

        setTimeout(() => {
            expect(mockUserData.data).toBeDefined();
        }, 1000)
        setTimeout(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', { data: 'USuccess' }]);
            done();
        }, 3500)

    })

    it('Back button go back to user page', () => {
        fixture = TestBed.createComponent(EditUserComponent);
        component = fixture.componentInstance;

        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.cancelEditUser();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/users']);
    });



})


let mockUserData = {
    "data": {
        "id": 10,
        "username": "john",
        "email": "aaron@metanoiasolutions.net",
        "phone": "1234567890",
        "roles": [{
            "id": "1",
            "name": "ADMIN"
        }]

    },
    "error": null,
    "code": 0
}

let mockRolesData = {
    "data": [{
        "name": "ADMIN"
    }]
}

class usersServicedatastub {
    public updateUser(user) {
        return Observable.of(mockUserData);
    }
    public getUserDetailsByID(userId) {
        return Promise.resolve(mockUserData);
    }
}
class activitesStubData {

}
class eventsStubData {

}
