
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router } from "@angular/router";
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { CalendarWidgetComponent } from './calendar-widget.component';
import { CalendarModule } from '../calendar.module';
import { EventsService } from '../shared/events.service';
import { AppModule } from 'app/app.module';
import { CalendarEvent } from './calendar-widget.component';


describe('Calendar widget Component', () => {
    let component: CalendarWidgetComponent;
    let fixture: ComponentFixture<CalendarWidgetComponent>;

    //let driversServicedatastub: driversServicedatastub;
    beforeEach((() => {
        // routerMock = {
        //     navigate: jasmine.createSpy('navigate')
        // };

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, CalendarModule, AppModule],
            declarations: [],
            providers: [
                { provide: EventsService, useClass: eventsServicedatastub },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarWidgetComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([EventsService], (injectService: EventsService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('Select Event type list: Shows list of events types', () => {
        expect(component.Typeevents.length).toBeGreaterThanOrEqual(0);
    })


    it('Select Priority list:Shows list of event priorities', () => {
        expect(component.colorClassNames.length).toBeGreaterThanOrEqual(0);
    })

    



})

class eventsServicedatastub {
    addEvent(event) {
        return Observable.of();
    }
}