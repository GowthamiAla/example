
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TemplateService } from './template.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { addClassName } from 'app/shared/utils/dom-helpers';


const getTemplateListResponse = {
    "data": {
        "id": 1,
        "name": "Email - New load",
        "type": "EMAIL",
        "content": "<p>New load ${loadNum} is created</p>"
    },
    "error": null,
    "code": 0
}

let AddTemplateObject = {

    "name": "Email - New load",
    "type": "EMAIL",
    "content": "<p>New load ${loadNum} is created</p>"
}

let UpdateTemplateObject = {
    "id": 1,
    "name": "Email - New load",
    "type": "EMAIL",
    "content": "<p>New load ${loadNum} is created</p>"

}

let TemplateDeleteFakeResponse = {
    "data": null,
    "error": {
        "context": null,
        "code": "SCUS104",
        "message": "Failed to delete template"
    },
    "code": -1
}


describe('Template Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                TemplateService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        }).compileComponents();
    });

    it('Instantiating Template service when to inject service', inject([TemplateService], (service: TemplateService) => {
        expect(service instanceof TemplateService).toBe(true);
    }));

    it('Instantiate  Template service with "new" and with Http request', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new TemplateService(http);
        expect(service instanceof TemplateService).toBe(true, 'new service should be ok');
    }));

    it('Providing mock Template service data to mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        })
    );

    describe('Get Template details by Id :', () => {
        let service: TemplateService;
        let backend: MockBackend;
        let response: Response;
        let fakeTemplateResponse;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TemplateService(http);
            fakeTemplateResponse = getTemplateListResponse;
            let options = new ResponseOptions({ status: 200, body: fakeTemplateResponse });
            response = new Response(options);
        }));

        it('should have expected fake template by Id ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            let fakeGetTemplateId = 1;
            service.getTemplatebyId(fakeGetTemplateId).then(Template => {
                expect(Template.data.id).toBe(+fakeGetTemplateId);
            });
        })));
    })

    describe('Add Template details :', () => {
        let service: TemplateService;
        let backend: MockBackend;
        let response: Response;
        let fakeTemplateResponse;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TemplateService(http);
            let options = new ResponseOptions({ status: 200, body: getTemplateListResponse });
            response = new Response(options);
        }));

        it('It must Add a fake Template', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.addTemplate(AddTemplateObject).subscribe(Template => {
                expect(Template.data.name).toBe(AddTemplateObject.name);
            });
        })));
    })


    describe('Update Template details by Id :', () => {
        let service: TemplateService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TemplateService(http);
            let options = new ResponseOptions({ status: 200, body: getTemplateListResponse });
            response = new Response(options);
        }));

        it('should have  fake Template by Id ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.updateTemplate(UpdateTemplateObject, UpdateTemplateObject.id).subscribe(Template => {
                expect(Template.data.name).toBe(UpdateTemplateObject.name);
            });
        })));
    })


    describe('Delete Template By Id :', () => {
        let service: TemplateService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TemplateService(http);
            let options = new ResponseOptions({ status: 200, body: TemplateDeleteFakeResponse });
            response = new Response(options);
        }));

        it('should delete the template details ', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.deleteTemplate(UpdateTemplateObject.id).subscribe(Template => {
                expect(Template.error.message).toBe(TemplateDeleteFakeResponse.error.message);
            });
        })));
    })
});