import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router, ActivatedRoute } from "@angular/router";
import { UserModule } from '../users.module';
import { UsersListComponent } from './users-list.component';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user.service';
import { AppModule } from '../../../app.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('List users Component', () => {
    let component: UsersListComponent;
    let fixture: ComponentFixture<UsersListComponent>;


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
        fixture = TestBed.createComponent(UsersListComponent);
        component = fixture.componentInstance;
    });

    //    beforeEach(inject([UserService], (injectService: UserService) => {
    //     }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    // it('On Add User Button Should navigate to Add User page', () => {
    //     let navigateSpy = spyOn((<any>component).router, 'navigate');
    //     component.addUser();
    //     expect(navigateSpy).toHaveBeenCalledWith(['/users/addUser']);
    // });

    it('On Update User icon Should navigate to Update User page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        let user = {
            "id": 22
        }
        component.editUser(user);
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/users/editUser', user.id]);
    });
})

class usersServicedatastub {
    public getAllUserRoleTypes() {
        return Observable.of();
    }
    public addUser(User) {
        return Promise.resolve();
    }

}