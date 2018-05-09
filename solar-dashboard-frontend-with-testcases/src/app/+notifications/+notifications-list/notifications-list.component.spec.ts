
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationModule } from '../notifications.module';
import { NotificationListComponent } from './notifications-list.component';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../notifications.service';
import { AppModule } from '../../app.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { EventsService } from '../../+calendar/shared/events.service';
import { setTimeout } from 'timers';

describe('List drivers Component', () => {
    let component: NotificationListComponent;
    let fixture: ComponentFixture<NotificationListComponent>;
    let routerMock;
    let routerSpy: any;
    let location: Location;
    let router: Router;
    let locationMock: any;

    beforeEach((() => {

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, NotificationModule],
            declarations: [],
            providers: [
                { provide: ActivatedRoute, useValue: { 'params': Observable.of([{ 'data': 'notificationsList' }]) } },
                { provide: NotificationService, useClass: notificationsServiceDatastub },
                { provide: EventsService, useClass: eventsServicedatastub },

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationListComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([NotificationService], (injectService: NotificationService) => {
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('calling the notification list', (done) => {
        //calling the notification list based on state parmas
        fixture = TestBed.createComponent(NotificationListComponent);
        component = fixture.componentInstance;
        let notificationsServiceDatastub = fixture.debugElement.injector.get(NotificationService);
        const spy = spyOn(notificationsServiceDatastub, 'getNotifications').and.returnValue(Observable.of(mockNotificationData));
        component.notificationsList();
        setTimeout(() => {
            expect(component.activities).toEqual(mockNotificationData.data);
            done();
        }, 2000)
    })

    it('Calling the Calendar notification list', ((done) => {
        fixture = TestBed.createComponent(NotificationListComponent);
        component = fixture.componentInstance;
        let eventsServicedatastub = fixture.debugElement.injector.get(EventsService);
        const spy = spyOn(eventsServicedatastub, 'getFilterDateEvents').and.returnValue(Promise.resolve(mockCurrentDayevents));
        component.calendarEventsList();
        setTimeout(() => {
            expect(component.eventsListResponse).toEqual(mockCurrentDayevents);
            done();
        }, 2000)
    }));





})

/*let mockData{
   "start": 2017-07-01T00:00:00+05:30
}*/

class notificationsServiceDatastub {
    public getNotifications() {
        return Observable.of(mockNotificationData);
    }
}

class eventsServicedatastub {
    public getFilterDateEvents(startdate, endDate) {
        return Promise.resolve(mockCurrentDayevents);
    }
}

let mockCurrentDayevents = {
    "data": [{
        "id": 58,
        "title": "gfdghfgh",
        "description": "fghfghfgh",
        "priority": "NORMAL",
        "eventType": "fa-calendar-o",
        "active": true,
        "start": "2018-02-07T19:30:00+05:30",
        "end": "2018-02-08T23:59:00+05:30",
        "createTime": "2018-02-06T16:08:10+05:30",
        "lastUpdateTime": "2018-02-07T14:38:53+05:30",
        "properties": "{}"
    }],
    "error": null,
    "code": 0
}

let mockNotificationData = {
    "data": [{
        "id": 2475,
        "user": {
            "id": 1,
            "name": "John",
            "email": "john@metanoiasolutions.net",
            "phone": "8096861024",
            "active": true,
            "roles": [{
                "id": 1,
                "name": "ADMIN"
            }]
        },
        "serviceevent": {
            "id": 3,
            "code": "402",
            "event": "Geofence for admin",
            "module": "LoadService"
        },
        "notificationContext": "Charles with load 100003 has entered into 4401 Sarr Pkwy,Stone Mountain",
        "lastUpdateTime": "2018-02-07T04:31:02Z",
        "readStatus": 0,
        "type": "WEBSOCKET"
    }]
}