import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ReportModule } from '../report.module';
import { ReportService } from '../service/report.service';
import { ReportAddComponent } from './report.add.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { AppModule } from '../../../app.module';
import { timeInterval } from 'rxjs/operator/timeInterval';
import { timeout } from 'q';
//import { AdminModule } from '../../admin.module'

describe('Add Report Component', () => {
    let component: ReportAddComponent;
    let fixture: ComponentFixture<ReportAddComponent>;
    let routerMock;
    let routerSpy: any;
    let location: Location;
    let router: Router;
    let reportServiceDataStub: ReportServiceDataStub;
    let locationMock: any;


    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ReportModule],
            declarations: [],
            providers: [
                { provide: ReportService, useClass: ReportServiceDataStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportAddComponent);
        component = fixture.componentInstance;
    });

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });


    it('Report added Successfully', (done) => {
        component.reportTemplateNamesSelections = 'DeliveryReceipt';
        component.reportFormatSelections = 'PDF';
        reportServiceDataStub = fixture.debugElement.injector.get(ReportService);
        const spy = spyOn(reportServiceDataStub, 'addReport').and.returnValue(Observable.of(mockAddReportResponce));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.addTemplateReport(component.reportTemplateNamesSelections, component.reportFormatSelections)
        setTimeout(() => {
            expect(component.addReportData).toEqual(mockAddReportResponce);
            expect(navigateSpy).toHaveBeenCalledWith(['/admin/report/list', { data: 'ASuccess' }]);
            done();
        }, 2000)
    })


    it('Ones report already generated', (done) => {
        component.reportTemplateNamesSelections = 'DeliveryReceipt';
        component.reportFormatSelections = 'PDF';
        reportServiceDataStub = fixture.debugElement.injector.get(ReportService);
        const spy = spyOn(reportServiceDataStub, 'addReport').and.returnValue(Observable.of(mockAddReportErrorResponse));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.addTemplateReport(component.reportTemplateNamesSelections, component.reportFormatSelections)
        setTimeout(() => {
            expect(component.reportError).toEqual(mockAddReportErrorResponse.error.message, 'Report template already generated')
            done();
        }, 2000)
    })


    it('Back button go back to Report page', () => {
        fixture = TestBed.createComponent(ReportAddComponent);
        component = fixture.componentInstance;
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.goBack();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/report/list']);
    });

    it('Add File Method', () => {
        component.fileChange(fileChangeObj)
        expect(component.fileAppend).toBeTruthy();
    })
})


class ReportServiceDataStub {

    public addReport(name, format, addReportObj) {
        return Observable.of(mockAddReportResponce);
    }
}


let addReportObj = {

}

var mockAddReportResponce = { "data": null, "error": null, "code": 0 }

var mockAddReportErrorResponse = { "data": null, "error": { "context": null, "code": "SCUS604", "message": "Report template already generated" }, "code": -1 }


let fileChangeObj = { 
    target: {
        files: {
            0: {
                name: "test.xml",
                size: 20000000
            },
            length: 1
        },
    }
};