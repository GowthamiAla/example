import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { UserModule } from '../users.module';
import { AddUserComponent } from './add-user.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user.service';
import { AppModule } from '../../../app.module';

describe('Add user Component', () => {
    let component: AddUserComponent;
    let fixture: ComponentFixture<AddUserComponent>;


    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, UserModule],
            declarations: [],
            providers: [
                { provide: UserService, useClass: usersServicedatastub },

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddUserComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([UserService], (injectService: UserService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });



    it('On ngOnInit get the roles list', async(() => {
        fixture = TestBed.createComponent(AddUserComponent);
        component = fixture.componentInstance;
        let usersServicedatastub = fixture.debugElement.injector.get(UserService);
        const spy = spyOn(usersServicedatastub, 'getAllUserRoleTypes').and.returnValue(Observable.of(mockRolesData.data));
        fixture.detectChanges();
        expect(component.userTypeRoles).toEqual(mockRolesData.data);
    }));

    it('Add User form is invalid when page loaded', () => {
        expect(component.complexForm.valid).toBeFalsy();
    });

    it('Add User email field validity', () => {
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

    it('Add User Phone number field validity', () => {
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

    it('Add User Name field validity', () => {
        let errors = {};
        let username = component.complexForm.controls['username'];
        expect(username.valid).toBeFalsy();

        // USername field is required
        errors = username.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set USername to something correct
        username.setValue("Test");
        errors = username.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(username.valid).toBeTruthy();
    })

    it('Add User Role field validity', () => {
        let errors = {};
        let role = component.complexForm.controls['roles'];
        expect(role.valid).toBeFalsy();
        role.setValue(mockRolesData.data[0].name);
        expect(role.valid).toBeTruthy();
    })
    it('Checking Add User Form Validity', () => {
        component.complexForm.controls['username'].setValue('james');
        component.complexForm.controls['email'].setValue('test@example.com');
        component.complexForm.controls['phone'].setValue('1234567890');
        component.complexForm.controls['roles'].setValue(mockRolesData.data[0].name);

        expect(component.complexForm.valid).toBeTruthy();
    })

    it('Submit the Add User details sucessfully', (done) => {

        component.complexForm.controls['username'].setValue('james');
        component.complexForm.controls['email'].setValue('test@example.com');
        component.complexForm.controls['phone'].setValue('1234567890');
        component.complexForm.controls['roles'].setValue(mockRolesData.data[0].name);

        expect(component.complexForm.valid).toBeTruthy();

        component.userDetails = {
            "name": "Test",
            "email": "aaron@metanoiasolutions.net",
            "phone": "2602185194",
            "active": "true",
            "roles": [mockRolesData.data[0]]
        }
        let usersServicedatastub = fixture.debugElement.injector.get(UserService);
        const spy = spyOn(usersServicedatastub, 'addUser').and.returnValue(Observable.of(mockAddUserResponse));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.addUser();
        setTimeout(() => {
            expect(component.addUserResponse.data.name).toBe(component.userDetails.name);
        }, 1000)
        setTimeout(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', { data: 'ASuccess' }]);
            done();
        }, 4500)

    })





    it('Button cancel go back to users page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.cancelUser();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/users']);

    })

})
let mockAddUserResponse = {
    "data": {
        "id": 64,
        "name": "Test",
        "email": "aaron@metanoiasolutions.net",
        "phone": "2602185194",
        "active": "true",
        "roles": [{
            "id": 3,
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
    public getAllUserRoleTypes() {
        return Observable.of(mockRolesData.data);
    }
    public addUser(User) {
        return Observable.of(mockAddUserResponse);
    }
}