
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router } from "@angular/router";
import { Location } from "@angular/common";

import { ReportListComponent } from './report.list.component';
import { ReportModule } from '../report.module';
import { Observable } from 'rxjs/Observable';
import { ReportService } from '../service/report.service';
import { AppModule } from '../../../app.module';
import { By } from '@angular/platform-browser';
//import { AdminModule } from '../../admin.module'


// import {} from 'jasmine';
describe('Reports List Component', () => {
    let component: ReportListComponent;
    let fixture: ComponentFixture<ReportListComponent>;
    let routerMock;
    let routerSpy: any;
    let location: Location;
    let router: Router;
    let locationMock: any;
    let driverServiceMockStub: reportServicedatastub;

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ReportModule],
            declarations: [],
            providers: [
                { provide: ReportService, useValue: reportServicedatastub },
                { provide: Location, useValue: locationMock },
            ]
        }).compileComponents();
    })); 

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportListComponent);
        component = fixture.componentInstance;
    });


    it('should create a component', () => {
        expect(component).toBeTruthy();
    });


    it('On Add Report Button Should navigate to Add Report page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.goToAddReport();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/report/add']);
    });

    it('On Update Report icon Should navigate to Update report page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        let report = {
            "id": 22
        }
        component.editReport(report);
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/report/editReport', report.id]);

    });


})

class reportServicedatastub {

}

var mockReportData = {
    "data": [
        {
            "id": 2,
            "formatType": "PDF",
            "template": null,
            "templateName": {
                "id": 2,
                "templateName": "Analytics_Report"
            }
        },
        {
            "id": 3,
            "formatType": "PDF",
            "template": null,
            "templateName": {
                "id": 3,
                "templateName": "Analysis"
            }
        }
    ],
    "error": null,
    "code": 0
}