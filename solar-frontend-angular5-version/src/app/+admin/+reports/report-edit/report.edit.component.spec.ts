// import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
// import { RouterTestingModule } from "@angular/router/testing"
// import { Router, ActivatedRoute } from "@angular/router";
// import { Location } from "@angular/common";
// import { ReportModule } from '../report.module';
// import { ReportService } from '../service/report.service';
// import { ReportEditComponent } from './report.edit.component';
// import { DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import { AppModule } from '../../../app.module';
// import { timeInterval } from 'rxjs/operator/timeInterval';
// import { timeout } from 'q';


// describe('Update Report Component', () => {
//     let component: ReportEditComponent;
//     let fixture: ComponentFixture<ReportEditComponent>;
//     let routerMock;
//     let routerSpy: any;
//     let location: Location;
//     let router: Router;
//     let reportServiceDataStub: ReportServiceDataStub;
//     let locationMock: any;


//     beforeEach((() => {
//         TestBed.configureTestingModule({
//             imports: [RouterTestingModule, AppModule, ReportModule],
//             declarations: [],
//             providers: [
//                 { provide: ActivatedRoute, useValue: { 'params': Observable.of({ 'reportId': 3 }) } },
//                 { provide: ReportService, useClass: ReportServiceDataStub },
//                 { provide: Location, useValue: locationMock },
//             ]
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(ReportEditComponent);
//         component = fixture.componentInstance;
//     });

//     beforeEach(inject([ReportService], (injectService: ReportService) => {
//     }));

//     it('should create a component', () => {
//         expect(component).toBeTruthy();
//     }); 


//     it('On ngOnInit get the report List', ((done) => {
//         fixture = TestBed.createComponent(ReportEditComponent);
//         component = fixture.componentInstance;
//         reportServiceDataStub = fixture.debugElement.injector.get(ReportService);
//         const spyDriversData = spyOn(reportServiceDataStub, 'getReportByID').and.returnValue(Promise.resolve(mockReportResponce));
//         fixture.detectChanges();
//         setTimeout(() => {
//             expect(component.report).toBe(mockReportResponce)
//             done()
//         }, 2000)
//     }));

//     it('Back button go back to Report page', () => {
//         fixture = TestBed.createComponent(ReportEditComponent);
//         component = fixture.componentInstance;

//         let navigateSpy = spyOn((<any>component).router, 'navigate');
//         component.goBack();
//         expect(navigateSpy).toHaveBeenCalledWith(['/admin/report/list']);
//     });

// })


// class ReportServiceDataStub {
//     public getReportByID(id) {
//         return Promise.resolve(mockReportResponce);
//     }
// }



// var mockReportResponce = { "id": 3, "formatType": "PDF", "template": null, "templateName": { "id": 3, "templateName": "Analysis" } }