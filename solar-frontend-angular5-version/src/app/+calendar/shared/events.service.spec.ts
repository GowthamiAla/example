
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { CalendarEvent } from '../calendar-widget/calendar-widget.component';
import { EventsService } from './events.service';

describe('Calendar Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                EventsService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        }).compileComponents();
    });


    it('Instantiating Calendar service when to inject service', inject([EventsService], (service: EventsService) => {
        expect(service instanceof EventsService).toBe(true);
    }));

    it('Instantiate service with "new" and with Http request', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new EventsService(http);
        expect(service instanceof EventsService).toBe(true, 'new service should be ok');
    }));

    it('Providing mock service data to mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        })
    );

    describe('Get All Events List service ', () => {
        let service: EventsService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new EventsService(http);
            let options = new ResponseOptions({ status: 200, body: mockGetAlleventsData });
            response = new Response(options);
        }));

        it('should have fake wvents list', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getAllEvent().subscribe(allEvents => {
                expect(allEvents.data.length).toBe(mockGetAlleventsData.data.length);
                expect(allEvents.data.length).toBe(1);
            });
        })));

    })

    describe('Add Event service ', () => {
        let service: EventsService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new EventsService(http);
            let options = new ResponseOptions({ status: 200, body: eventResponse });
            response = new Response(options);
        }));

        it('should have fake add events respone', fakeAsync(inject([], () => {
            let AddeventObject: any = new CalendarEvent("fa-clipboard", true, "Meeting", "Internal Meeting", "2018-05-10T00:00:00Z", "2017-12-13T16:12:32+05:30", "2018-02-12T05:08:49Z", "2018-02-12T05:08:49Z", "LOW");
            AddeventObject.properties = {};
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.addEvent(AddeventObject).subscribe(eventData => {
                expect(eventData.data).toBe(eventResponse.data);
            });
        })));

    })

    describe('Update Event service ', () => {
        let service: EventsService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new EventsService(http);
            let options = new ResponseOptions({ status: 200, body: eventResponse });
            response = new Response(options);
        }));

        it('should have fake updated event resposne', fakeAsync(inject([], () => {
            let UpdateventObject: any = new CalendarEvent("fa-clipboard", true, "Meeting", "Internal Meeting", "2018-05-10T00:00:00Z", "2017-12-13T16:12:32+05:30", "2018-02-12T05:08:49Z", "2018-02-12T05:08:49Z", "LOW", "43");
            UpdateventObject.properties = {};
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.addEvent(UpdateventObject).subscribe(eventData => {
                expect(eventData.data).toBe(eventResponse.data);
            });
        })));

    })

    describe('Get Events by filter service ', () => {
        let service: EventsService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new EventsService(http);
            let options = new ResponseOptions({ status: 200, body: eventResponse });
            response = new Response(options);
        }));

        it('should have fake events list within time range', fakeAsync(inject([], () => {
            let postFilterRangeObject = {
                "active": true,
                "eventTypes": ["fa-calendar-o", "fa-user"],
                "priorities": ["LOW", "NORMAL"]
            }
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getFilterEvents(postFilterRangeObject).subscribe(eventData => {
                expect(eventData.data).toBe(eventResponse.data);
            });
        })));

    })




    describe('Get Events by Time Range service ', () => {
        let service: EventsService;
        let backend: MockBackend;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new EventsService(http);
            let options = new ResponseOptions({ status: 200, body: eventResponse });
            response = new Response(options);
        }));

        it('should have fake events list within time range', fakeAsync(inject([], () => {
            backend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));
            service.getFilterDateEvents("2018-05-08T00:00:00+05:30", "2018-05-11T23:59:59+05:30").then(eventData => {
                expect(service.filterByTimeRange.data).toBe(eventResponse.data);
            });
        })));

    })

})


let mockGetAlleventsData = {
    "data": [{
        "id": 26,
        "title": "Arrivals",
        "description": "Load 100004 will be reached to4401 Sarr Pkwy,Stone Mountain",
        "priority": "HIGH",
        "eventType": "fa-calendar-o",
        "active": true,
        "start": "2017-12-12T16:12:32+05:30",
        "end": "2017-12-13T16:12:32+05:30",
        "createTime": "2017-12-12T16:00:33+05:30",
        "lastUpdateTime": "2017-12-12T16:00:33+05:30",
        "properties": "{}"
    }],
    "error": null,
    "code": 0
}

let eventResponse = {
    "data": {
        "id": 43,
        "title": "Meeting",
        "description": "Internal Meeting",
        "priority": "LOW",
        "eventType": "fa-clipboard",
        "active": true,
        "start": "2018-05-10T00:00:00Z",
        "end": "2018-05-10T05:08:00Z",
        "createTime": "2018-02-12T05:08:49Z",
        "lastUpdateTime": "2018-02-12T05:08:49Z",
        "properties": "{}"
    },
    "error": null,
    "code": 0
}