
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { ReportService } from './report.service';

describe('Report Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ReportService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        }).compileComponents();
    });


    it('Instantiating Report service when to inject service', inject([ReportService], (service: ReportService) => {
        expect(service instanceof ReportService).toBe(true);
    }));

    it('Instantiate service with "new" and with Http request', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new ReportService(http);
        expect(service instanceof ReportService).toBe(true, 'new service should be ok');
    }));

    it('Providing mock service data to mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        })
    );

    describe('Get Report List service ', () => {
        let service: ReportService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new ReportService(http);
            let options = new ResponseOptions({ status: 200, body: reportsList });
            response = new Response(options);
        }));
 
        it('should have fake Report list', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getAllReports().subscribe(reports => {
                expect(reports).toBe(reportsList.data);
            });
        })));
    })


    describe('Delete Report Service', () => {
        let service: ReportService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new ReportService(http);
            let options = new ResponseOptions({ body: reportDelData });
            response = new Response(options);
        }));

        it('should have delete Report details', fakeAsync(inject([], () => {
            let userId = 9;
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.deleteReport(userId).subscribe(deleteData => {
                expect(deleteData.data).toBe(reportDelData.data);
            });
        })));
    })


    describe('Add Report Service', () => {
        let service: ReportService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new ReportService(http);
            let options = new ResponseOptions({ status: 200, body: addReport });
            response = new Response(options);
        }));

        it('should add a fake Report', fakeAsync(inject([], () => {
            let a, b, c;
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.addReport(a, b, c).subscribe(report => {
                expect(report).toBe(addReport);
            });
        })));
    })

})


var reportsList = { "data": [{ "id": 3, "formatType": "PDF", "template": null, "templateName": { "id": 3, "templateName": "Analysis" } }, { "id": 2, "formatType": "PDF", "template": null, "templateName": { "id": 2, "templateName": "Analytics_Report" } }], "error": null, "code": 0 }
var addReport = { "data": null, "error": null, "code": 0 }
var reportDelData = { "data": "Template deleted successfully ", "error": null, "code": 0 }


