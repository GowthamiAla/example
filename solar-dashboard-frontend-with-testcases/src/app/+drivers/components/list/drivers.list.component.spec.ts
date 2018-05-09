
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { DriversModule } from '../../drivers.module';
import { DriversListComponent } from './drivers.list.component';
import { Observable } from 'rxjs/Observable';
import { DriverService } from '../../services/driver.service';
import { AppModule } from '../../../app.module';




describe('List drivers Component', () => {
    let component: DriversListComponent;
    let fixture: ComponentFixture<DriversListComponent>;
    let routerMock;
    let routerSpy: any;
    let location: Location;
    let router: Router;
    let locationMock: any;

    
    beforeEach((() => {


        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, DriversModule],
            declarations: [],
            providers: [
                { provide: DriverService, useValue: driversServicedatastub },
                { provide: Location, useValue: locationMock },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriversListComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([DriverService], (injectService: DriverService) => {
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('On Add Driver Button Should navigate to Add Driver page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.goToAddDriver();
        expect(navigateSpy).toHaveBeenCalledWith(['/drivers/addDriver']);
    });

    it('On Update Driver icon Should navigate to Update Driver page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        let driver = {
            "id": 22
        }
        component.goToUpdateDriverDetials(driver);
        expect(navigateSpy).toHaveBeenCalledWith(['/drivers/updateDriver', driver.id]);

    });



})

class driversServicedatastub {
    public getVendorsInfo() {
        return Observable.of();
    }
    public addDriver(Driver) {
        return Promise.resolve();
    }

}
