import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, OnChanges, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { EventsService } from '../shared/events.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';



declare var $: any;


export class CalendarEvent {
    constructor(
        public eventType: string,
        public active: boolean,
        public title: string,
        public description: string,
        public start: string,
        public end: string,
        public createTime: string,
        public lastUpdateTime: string,
        public priority: string,
        public id?: string
    ) { }
}

@Component({
    selector: 'calendar-widget',
    templateUrl: './calendar-widget.component.html',
    styles: [`
  .FilterDropDownAnimation {
      -webkit-animation-name: none !important;
      -moz-animation-name: flipInX !important;
      -o-animation-name: flipInX !important;
      animation-name: none !important;
      -webkit-animation-duration: 0s !important;
      -moz-animation-duration: .4s !important;
      -o-animation-duration: .4s !important;
      animation-duration: 0s !important;
      -webkit-animation-fill-mode: none !important;
      -moz-animation-fill-mode: both !important;
      -o-animation-fill-mode: both !important;
      animation-fill-mode: none !important;
  }

  .tooglePosition {
      float: left !important;
  }

  .filterFormAlign {
      margin-bottom: 0px !important;
      margin-top: 5px !important;
      padding-right: 0px;
  }

  .filterDropwdownViewAlign {
      color: black;
      position: relative !important;
      top: 3px;
      padding: 0px !important;
  }

  @media only screen and (min-width:768px) {
      .filterDropwdownViewAlign {
          min-width: 335px !important;
          left: -296px !important;
      }
  }

  @media only screen and (max-width: 479px) and (min-width: 320px) {
      .filterDropwdownViewAlign {
          min-width: 310px !important;
          left: -255px !important;
      }
  }

  @media only screen and (min-width:479px) and (max-width:768px) {
      .filterDropwdownViewAlign {
          min-width: 335px !important;
          left: -280px !important;
      }
  }
`
    ]
})
export class CalendarWidgetComponent implements AfterViewInit, OnInit {

    notificationDate: any;
    subscription: Subscription;
    private $calendarRef: any;
    private calendar: any;
    public properties: any = {};
    // create event attributes
    public eventType: string;
    public activeColorClass: any;
    @Input() public title: string;
    @Input() public description: string;
    @Input() public eventStartDate: string;
    @Input() public eventEnddate: string;
    @Input() public active: boolean;
    @Input() public createTime: string;
    @Input() public lastUpdateTime: string;

    public createPriority: string;
    showPropertyAttributes: boolean;

    CalenderInputdefaultValue = new Date();
    CalenderInputEnddefaultValue = new Date();

    todayDate;
    // public period = 'Showing';
    public calendarView = 'month';
    // update Event attributes
    public updateId: string;
    @Input() public updateTitle: string;
    @Input() public updateDescription: string;
    @Input() public updateEventStartdate: string;
    @Input() public updateEventEnddate: string;
    @Input() public updateActive: boolean;
    @Input() public updateCreateTime: string;
    @Input() public updateLastUpdateTime: string;


    public updatePriority: string;

    // create event form validation attributes
    public complexCreateEventForm: FormGroup;
    public createEventTitle: AbstractControl;
    public createEventDescription: AbstractControl;
    public createEventStartValid: AbstractControl;
    public createEventEndValid: AbstractControl;
    public createEventType: AbstractControl;
    createEventSubmit = false;
    // update event form validation attributes
    public complexupdateEventForm: FormGroup;
    public updateTitleValid: AbstractControl;
    public updateDescriptionValid: AbstractControl;
    public updateEventStartValid: AbstractControl;
    public updateEventEndValid: AbstractControl;
    public updateEventType: AbstractControl;
    updateEventSubmit = false;

    public createPropertiesForm: FormGroup;
    public CreatePkey: AbstractControl;
    public CreatePvalue: AbstractControl;
    getallEvents: any = {};


    public priorityOptions: any = [];
    public Typeevents: Array<any>;

    public calendarFilterDropDownToggle: any = '';
    public filterEventsObject: any;
    public activeEvents = false;
    formValidate;

    public PropertySelectData: any;
    propertySelected = false;

    // add event data
    eventAddStartEndTimeComparision = false;
    eventaddStartValidation = false;
    eventaddEndValidation = false;
    createEventData;


    updateStartEndComparision = false;
    eventUpdateStartValidation = false;
    eventUpdateEndValidation = false;
    updateEventData: any;

    public prioritySelectedValues: Array<string> = [];
    public eventTypeSelectedValues: Array<string> = [];

    public serviceErrorResponse;
    public serviceErrorData;


    public updateDisableFields;
    // modal wizard form steps
    public steps = [
        {
            key: 'step1',
            title: 'Event information',
            valid: false,
            submitted: false,
        },
        {
            key: 'step2',
            title: 'Event Properties',
            valid: false,
            submitted: false,
        },

        {
            key: 'step3',
            title: 'Save Event',
            valid: true,
            submitted: false,
        },
    ];
    public newProperty: any = {
        newPropertyKey: 'data',
        newPropertyValue: 'null'
    }
    @Input() public options = {
        mode: 'inline',
        disabled: false,
        inline: true,
        emptytext: 'edit'
    };
    public activeStep = this.steps[0];

    // priorities and color classes
    public colorClassNames: Array<any> = [
        {
            bg: 'bg-color-blue',
            txt: 'txt-color-white',
            title: 'LOW'
        }, {
            bg: 'bg-color-greenLight',
            txt: 'txt-color-white',
            title: 'NORMAL'
        }, {
            bg: 'bg-color-red',
            txt: 'txt-color-white',
            title: 'HIGH'
        }
    ];

    @ViewChild('popoverAddEvent') public popoverAddEvent: ModalDirective;
    @ViewChild('popoverupdateEvent') public popoverupdateEvent: ModalDirective;

    constructor(private el: ElementRef, private router: Router, private route: ActivatedRoute,
        private eventsService: EventsService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.todayDate = moment().format('YYYY-MM-DD');
        this.PropertySelectData = '';
        this.eventType = '';
        // create form validations
        this.complexCreateEventForm = fb.group({
            createEventTitle: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
            createEventDescription: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000)])],
            createEventStartValid: [null, Validators.compose([Validators.required])],
            createEventEndValid: [null, Validators.compose([Validators.required])],
            createEventType: [null, Validators.compose([Validators.required])]
        })
        this.createEventTitle = this.complexCreateEventForm.controls['createEventTitle'];
        this.createEventDescription = this.complexCreateEventForm.controls['createEventDescription'];
        this.createEventStartValid = this.complexCreateEventForm.controls['createEventStartValid'];
        this.createEventEndValid = this.complexCreateEventForm.controls['createEventEndValid'];
        this.createEventType = this.complexCreateEventForm.controls['createEventType'];

        // update form validations
        this.complexupdateEventForm = fb.group({
            updateTitleValid: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
            updateDescriptionValid: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000)])],
            updateEventStartValid: [null, Validators.compose([Validators.required])],
            updateEventEndValid: [null, Validators.compose([Validators.required])],
            updateEventType: [null, Validators.compose([Validators.required])]
        })
        this.updateTitleValid = this.complexupdateEventForm.controls['updateTitleValid'];
        this.updateDescriptionValid = this.complexupdateEventForm.controls['updateDescriptionValid'];
        this.updateEventStartValid = this.complexupdateEventForm.controls['updateEventStartValid'];
        this.updateEventEndValid = this.complexupdateEventForm.controls['updateEventEndValid'];
        this.updateEventType = this.complexupdateEventForm.controls['updateEventType'];

        this.createPropertiesForm = fb.group({
            CreatePkey: [null, Validators.compose([Validators.required])],
            CreatePvalue: [null, Validators.compose([Validators.required])]
        })
        this.CreatePkey = this.createPropertiesForm.controls['CreatePkey'];
        this.CreatePvalue = this.createPropertiesForm.controls['CreatePvalue'];

        // dropdown prioritites options
        this.priorityOptions = [
            { id: 1, name: 'Low', value: 'LOW' },
            { id: 2, name: 'Normal', value: 'NORMAL' },
            { id: 3, name: 'High', value: 'HIGH' },
        ]

        // dropdown event type options
        this.Typeevents = [
            { id: 1, name: 'Meeting', value: 'fa-clock-o' },
            { id: 2, name: 'Event', value: 'fa-calendar-o' },
            { id: 3, name: 'Seminar', value: 'fa-clipboard' },
            { id: 6, name: 'Conference', value: 'fa-user' },
            { id: 7, name: 'Team Building', value: 'fa-cubes' },
            { id: 8, name: 'Product Launch', value: 'fa-folder-o' },
            { id: 9, name: 'Trade Shows', value: 'fa-laptop' },
            { id: 10, name: 'Birthday', value: 'fa-gift' },
            { id: 11, name: 'Leave', value: 'fa-pencil-square-o' },
        ];

    }


    addPropertyAttributes() {
        this.newProperty.newPropertyKey = '';
        this.newProperty.newPropertyValue = '';
        if (this.showPropertyAttributes) {
            this.showPropertyAttributes = false;
        } else {
            this.showPropertyAttributes = true;
        }
    }





    submitPropertyData(keyData: any, valueData: any) {
        const obj = this.properties;
        const name = keyData;
        obj[name] = valueData;
        this.showPropertyAttributes = false;
        keyData = null;
        valueData = null;
    }
    deleteProperty(propertyKey) {
        delete this.properties[propertyKey];
    }


    prevStep() {
        const idx = this.steps.indexOf(this.activeStep);
        if (idx > 0) {
            this.activeStep = this.steps[idx - 1]
        }
    }
    nextStepFunction(step) {
        let idx = this.steps.indexOf(step);
        this.activeStep = null;
        while (!this.activeStep) {
            idx = idx == this.steps.length - 1 ? 0 : idx + 1;
            if (!this.steps[idx].valid) {
                this.activeStep = this.steps[idx]
            }

        }
    }


    nextStep() {
        if (this.complexCreateEventForm.valid || this.complexupdateEventForm.valid) {
            this.activeStep.submitted = true;
            if (this.activeStep.key == 'step1') {
                if (this.popoverAddEvent.isShown) {
                    this.addEventData();
                } else if (this.popoverupdateEvent.isShown) {
                    this.updateEvent();
                }
                if (this.steps[0].valid) {
                    this.nextStepFunction(this.activeStep);
                }
            } else if (this.activeStep.key == 'step2') {
                this.activeStep = null;
                this.activeStep = this.steps[2];
            }
        } else {
            this.formValidate = true;
            this.complexCreateEventForm != this.complexCreateEventForm;
        }
    }


    // properties select

    onPropertySelect(event) {
        this.propertySelected = true;
    }

    // add event popover event declaration
    public showChildModal(): void {
        this.popoverAddEvent.show();
    }

    public hideChildModal(): void {
        this.popoverAddEvent.hide();
    }

    // update event popover event declaration
    public showUpdateChildModal(): void {
        this.popoverupdateEvent.show();
    }

    public hideUpdateChildModal(): void {
        this.popoverupdateEvent.hide();
    }

    // caleandar functionality
    render() {
        this.$calendarRef = $('#calendar', this.el.nativeElement);
        this.calendar = this.$calendarRef.fullCalendar({
            lang: 'en',
            editable: true,
            draggable: true,
            selectable: false,
            selectHelper: true,
            unselectAuto: false,
            disableResizing: false,
            droppable: true,
            eventLimit: true, // for all non-agenda views
            views: {
                agenda: {
                    eventLimit: 6 // adjust to 6 only for agendaWeek/agendaDay
                }
            },
            eventConstraint: {
                start: moment().format(),
                end: '2400-01-01' // hard coded goodness unfortunately
            },
            header: {
                left: 'title', // today
                center: 'prev, next, today',
                right: 'month, agendaWeek, agendaDay, listMonth, listWeek' // month, agendaDay,
            },

            // showing all the events in calender
            events: (startTime, endTime, timezone, callback) => {
                if (this.filterEventsObject && (this.filterEventsObject.priorities.length ||
                    this.filterEventsObject.eventTypes.length || this.filterEventsObject.active)) {
                    this.eventsService.getFilterEvents(this.filterEventsObject).subscribe(response => {
                        const manuplatedData = this.manuplateResponseData(response);
                        callback(manuplatedData.data);
                    }, error => {
                        this.serviceErrorResponse = error.exception;
                        this.serviceErrorData = true;
                    });

                } else {
                    this.eventsService.getAllEvent().subscribe(response => {
                        const manuplatedData = this.manuplateResponseData(response);
                        callback(manuplatedData.data);
                    }, error => {
                        this.serviceErrorResponse = error.exception;
                        this.serviceErrorData = true;
                    });
                }
            },
            timeFormat: 'hh:mma',
            textColor: '#fff',
            defaultView: this.changeView('Showing', 'notSelected'),
            // modifications in view calnders like css
            eventRender: (event, element, icon) => {
                element.find('.fc-list-item-time').css({ 'width': '30%' });
                element.find('.fc-scroller').css({ 'height': '100%' });
                if (event) {
                    element.find('.fc-list-item-marker').closest('td').remove();
                }
                if (event.eventType) {
                    element.find('.fc-title').css
                        ({ 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'max-width': '100%' });
                    element.find('.fc-time').append
                        ('<i class="air air-top-right fa ' + event.eventType + '"></i>');
                    element.find('.fc-list-item-marker').append('<i class="fa ' + event.eventType + '"></i>');
                }
                if (event.description != '') {
                    element.find('.fc-event-title').append('<br/><strong>' + + '</strong>');
                }
            },
            eventAfterAllRender: (view) => {
            },
            // click on calendar to add event
            dayClick: (date, jsEvent, view) => {
                const check = moment(date).format('YYYY-MM-DD');
                const today = moment().format('YYYY-MM-DD');
                this.formValidate = false;
                if (check >= today) {
                    this.activeStep = this.steps[0];
                    this.description = '';
                    this.title = '';
                    this.properties = {};
                    this.activeColorClass = this.colorClassNames[0];
                    this.eventType = '';
                    this.eventAddStartEndTimeComparision = false;
                    this.eventaddStartValidation = false;
                    this.eventaddEndValidation = false;
                    this.eventStartDate = moment(date).format();
                    this.CalenderInputdefaultValue = new Date(this.eventStartDate);
                    if (this.calendarView === 'Showing' || this.calendarView === 'month' || this.calendarView === 'Month') {
                        this.eventEnddate = moment(this.eventStartDate).add(23, 'h').add(59, 'm').format();
                        this.CalenderInputEnddefaultValue = new Date(this.eventEnddate);
                    } else if (this.calendarView === 'agendaWeek' || this.calendarView === 'Week') {
                        this.eventEnddate = moment(this.eventStartDate).add(11, 'h').add(59, 'm').format();
                        this.CalenderInputEnddefaultValue = new Date(this.eventEnddate);
                    } else if (this.calendarView === 'agendaDay' || this.calendarView === 'Day') {
                        this.eventEnddate = moment(this.eventStartDate).add(1, 'h').format();
                        this.CalenderInputEnddefaultValue = new Date(this.eventEnddate);
                    }
                    this.active = true;
                    this.popoverAddEvent.show();
                    this.cdr.detectChanges();
                }
            },
            // update event
            eventClick: (calEvent, jsEvent, view) => {
                if (calEvent.title === 'Arrivals') {
                    this.updateDisableFields = true;
                    this.complexupdateEventForm.controls['updateEventType'].disable();
                    this.complexupdateEventForm.controls['updateEventStartValid'].disable();
                    this.complexupdateEventForm.controls['updateEventEndValid'].disable();
                } else {
                    this.updateDisableFields = false;
                    this.complexupdateEventForm.controls['updateEventType'].enable();
                    this.complexupdateEventForm.controls['updateEventStartValid'].enable();
                    this.complexupdateEventForm.controls['updateEventEndValid'].enable();
                }
                const check = moment(calEvent.start).format();
                const today = moment().format();
                if (check >= today) {
                    this.activeStep = this.steps[0];
                    this.properties = JSON.parse(calEvent.properties);
                    this.updateId = calEvent.id;
                    this.updateActive = true;
                    this.updateTitle = calEvent.title;
                    this.updateCreateTime = calEvent.createTime;
                    this.updateDescription = calEvent.description;
                    this.updateStartEndComparision = false;
                    this.eventUpdateStartValidation = false;
                    this.eventUpdateEndValidation = false;
                    // priority select
                    if (calEvent.priority === 'NORMAL') {
                        this.activeColorClass = this.colorClassNames[1];
                    } else if (calEvent.priority === 'HIGH') {
                        this.activeColorClass = this.colorClassNames[2];
                    } else {
                        this.activeColorClass = this.colorClassNames[0];
                    }

                    // icons select
                    for (let i = 0; i < this.Typeevents.length; i++) {
                        if (this.Typeevents[i].value === calEvent.eventType) {
                            this.eventType = calEvent.eventType;
                            break;
                        }
                    }
                    this.updatePriority = calEvent.priority;
                    this.updateEventStartdate = moment(calEvent.start).local().format();
                    this.CalenderInputdefaultValue = new Date(this.updateEventStartdate);
                    if (calEvent.end === null) {
                        this.updateEventEnddate = this.updateEventStartdate;
                    } else {
                        this.updateEventEnddate = moment(calEvent.end).local().format();
                    }
                    this.CalenderInputEnddefaultValue = new Date(this.updateEventEnddate);
                    this.popoverupdateEvent.show();
                    this.cdr.detectChanges();
                }
            },
            eventDragStart: (event, jsEvent, ui, view) => {
                console.log('Start dragg Event');
            },
            eventDragStop: (event, jsEvent, ui, view) => {
                console.log('stop drag Event');
            },
            eventAllow: (dropLocation, draggedEvent) => {
                const check = moment(draggedEvent.start).format();
                const today = moment().format();
                if (check > today) {
                    return true;
                } else {
                    return false;
                }
            },
            eventDrop: (event, delta, revertFunc, jsEvent, ui, view) => {
                // Allowing the dragging event for non geofence events
                if (event.title != 'Arrivals') {
                    const date = new Date();
                    const updateTime = moment(date).format();
                    if (event.end === null) {
                        event.end = event.start;
                    }
                    const StartDate = moment(event.start.format()).local().format();
                    const endDate = moment(event.end).local().format();
                    // let splitDate = StartDate.split('+');
                    // let minutes = moment.duration(splitDate[1]).asMinutes();
                    // let newStartDate = moment(StartDate).subtract(minutes, 'minutes').format();
                    // let newEndDate = moment(endDate).subtract(minutes, 'minutes').format();
                    const draggedEvent = new CalendarEvent(
                        event.eventType,
                        event.active,
                        event.title,
                        event.description,
                        StartDate, // newStartDate
                        endDate, // newEndDate
                        event.createTime,
                        updateTime,
                        event.priority,
                        event.id
                    );
                    const draggedEventDetails: any = draggedEvent;
                    if (Object.keys(event.properties).length != 0) {
                        draggedEventDetails.properties = event.properties;
                    }

                    this.eventsService.updateEvent(event.id, draggedEventDetails).subscribe(data => {
                        this.$calendarRef.fullCalendar('refetchEvents');
                    }, error => {
                        this.serviceErrorResponse = error.exception;
                        this.serviceErrorData = true;
                    });
                } else {
                    revertFunc();
                }
            }
        }
        );

        this.calendarCssEnhancements();
        // local storage custom view loaders

    }

    // modifying response data
    manuplateResponseData(response) {
        this.getallEvents = response;
        for (let i = 0; i < this.getallEvents.data.length; i++) {
            if (this.getallEvents.data[i].hasOwnProperty('start') ||
                this.getallEvents.data[i].hasOwnProperty('end') || this.getallEvents.data[i].hasOwnProperty('createTime') ||
                this.getallEvents.data[i].hasOwnProperty('lastUpdateTime')) {
                //  moment.parseZone(this.getallEvents.data[i].lastUpdateTime).local().format();
                this.getallEvents.data[i].start = moment(this.getallEvents.data[i].start).format();
                this.getallEvents.data[i].end = moment(this.getallEvents.data[i].end).format();;
                this.getallEvents.data[i].createTime = moment(this.getallEvents.data[i].createTime).format();
                this.getallEvents.data[i].lastUpdateTime = moment(this.getallEvents.data[i].lastUpdateTime).format();
            }
            // event custom colors based on priority
            if (this.getallEvents.data[i].hasOwnProperty('priority')) {
                if (this.getallEvents.data[i].priority === 'LOW') {
                    this.getallEvents.data[i].className = 'bg-color-blue txt-color-white calendar-EventFont';
                } else if (this.getallEvents.data[i].priority === 'NORMAL') {
                    this.getallEvents.data[i].className = 'bg-color-greenLight txt-color-white calendar-EventFont';
                } else if (this.getallEvents.data[i].priority === 'HIGH') {
                    this.getallEvents.data[i].className = 'bg-color-red txt-color-white calendar-EventFont';
                }
            }
        }
        return this.getallEvents;
    }

    changeView(viewperiod: any, selectStatus) {

        if (selectStatus === 'notSelected') {
            const calendarViewData = localStorage.getItem('CalendarView');
            if (calendarViewData != null && calendarViewData != '') {
                viewperiod = calendarViewData;
            } else {
                viewperiod = 'month';
            }
        }
        this.calendarView = viewperiod;
        if (selectStatus === 'selected') {
            this.calendar.fullCalendar('changeView', viewperiod);
        }
        localStorage.setItem('CalendarView', viewperiod);
        return this.calendarView
    }



    next() {
        $('.fc-next-button', this.el.nativeElement).click();
        $('.fc-head-container thead tr', this.$calendarRef).addClass('bg-color-darken');
        $('td>.fc-today', this.$calendarRef).addClass('fc-state-highlight');
        this.calendarCssEnhancements();
    }

    prev() {
        $('.fc-prev-button', this.el.nativeElement).click();
        this.calendarCssEnhancements();
    }

    today() {
        $('.fc-today-button', this.el.nativeElement).click();
    }

    // setting priority color
    setColorClass(colorClassName) {
        this.activeColorClass = colorClassName;
        this.createPriority = colorClassName.title;
        this.updatePriority = colorClassName.title;
    }



    addEventData() {
        this.cdr.detectChanges();
        this.eventAddStartEndTimeComparision = false;
        if (this.createPriority == undefined || this.createPriority == '') {
            this.createPriority = this.colorClassNames[0].title;
        }
        if (!moment(this.eventStartDate).isValid()) {
            this.eventaddStartValidation = true;
        } else if (!moment(this.eventEnddate).isValid()) {
            this.eventaddStartValidation = false;
            this.eventaddEndValidation = true;
        } else {
            this.eventaddStartValidation = false;
            this.eventaddEndValidation = false;
            this.eventStartDate = moment(this.eventStartDate).format();
            this.eventEnddate = moment(this.eventEnddate).format();
            if (this.eventStartDate < this.eventEnddate) {
                this.eventAddStartEndTimeComparision = false;
                const date = new Date();
                this.createTime = moment(date).format();
                // this.updateEventEnddate=this.updateEventStartdate;
                this.lastUpdateTime = this.createTime;
                const event = new CalendarEvent(
                    this.eventType,
                    this.active,
                    this.title,
                    this.description,
                    this.eventStartDate,
                    this.eventEnddate,
                    this.createTime,
                    this.lastUpdateTime,
                    this.createPriority,
                );
                this.steps[0].valid = true;
                this.createEventData = event;
            } else {
                this.eventAddStartEndTimeComparision = true;
            }
        }
    }
    // click button add event on modal page
    AddEventDetailsWithProperties() {
        if (Object.keys(this.properties).length != 0) {
            this.createEventData.properties = JSON.stringify(this.properties);
        }

        this.eventsService.addEvent(this.createEventData).subscribe(data => {
            this.popoverAddEvent.hide();
            this.$calendarRef.fullCalendar('refetchEvents');
        }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
        });
        this.description = '';
        this.title = '';
        this.eventEnddate = '';
        this.createPriority = '';
        this.eventType = '';
        this.activeColorClass = this.colorClassNames[0];

    }

    // update event data
    updateEvent() {
        this.updateStartEndComparision = false;
        if (!moment(this.updateEventStartdate).isValid()) {
            this.eventUpdateStartValidation = true;
        } else if (!moment(this.updateEventEnddate).isValid()) {
            this.eventUpdateStartValidation = false;
            this.eventUpdateEndValidation = true;
        } else {
            this.eventUpdateStartValidation = false;
            this.eventUpdateEndValidation = false;
            this.updateEventStartdate = moment(this.updateEventStartdate).format();
            this.updateEventEnddate = moment(this.updateEventEnddate).format();
            if (this.updateEventStartdate < this.updateEventEnddate) {
                this.updateStartEndComparision = false;
                const date = new Date();
                this.updateLastUpdateTime = moment(date).format();
                const updateEvent = new CalendarEvent(
                    this.eventType,
                    this.updateActive,
                    this.updateTitle,
                    this.updateDescription,
                    this.updateEventStartdate,
                    this.updateEventEnddate,
                    this.updateCreateTime,
                    this.updateLastUpdateTime,
                    this.updatePriority,
                    this.updateId
                );
                this.updateEventData = updateEvent;
                this.steps[0].valid = true;
            } else {
                this.updateStartEndComparision = true;
            }
        }
    }
    // click button update event on modal page
    updateEventDetailsProperties() {
        if (Object.keys(this.properties).length != 0) {
            this.updateEventData.properties = JSON.stringify(this.properties);
        }
        this.eventsService.updateEvent(this.updateEventData.id, this.updateEventData).subscribe(data => {
            this.popoverupdateEvent.hide();
            this.$calendarRef.fullCalendar('refetchEvents');
        }, error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
        });
        this.description = '';
        this.title = '';
        this.updatePriority = '';
        this.eventType = '';
        this.activeColorClass = this.colorClassNames[0];

    }


    // filter setting icons click button
    openFilterDropDown() {
        this.calendarFilterDropDownToggle = 'open';
    }
    // filter dropdown submit button
    onFilterEventSubmit() {
        // closing the dropdwon
        this.calendarFilterDropDownToggle = '';
        //changing the calendar view by caling changeView function
        this.changeView(this.calendarView, 'selected');
        // priorities values and event type values are binded in ngAfterViewInit()
        const filterSubmitData: any = {
            'priorities': this.prioritySelectedValues,
            'eventTypes': this.eventTypeSelectedValues,
            'active': this.activeEvents
        }

        // if objects are selected in filter
        if (this.prioritySelectedValues.length || this.eventTypeSelectedValues.length || this.activeEvents) {
            localStorage.setItem('filterObjectData', JSON.stringify(filterSubmitData));
            this.filterEventsObject = filterSubmitData;
            this.$calendarRef.fullCalendar('refetchEvents');
        }
     this.calendarCssEnhancements();
    }

    // filter dropdown cancel button
    onFilterEventCancel() {
        // clearing the filter event object
        this.filterEventsObject = undefined;
        $('#priorityMultipleSelect').val('').trigger('change');
        $('#evntTypeMultipleSelect').val('').trigger('change');
        this.activeEvents = false;
        localStorage.removeItem('filterObjectData');
        this.$calendarRef.fullCalendar('refetchEvents');
        // closing the dropdown view
        this.calendarFilterDropDownToggle = '';
    }


    notificationNavigation(navigationdate) {
        setTimeout(function () {
            $('#calendar').fullCalendar('changeView', 'agendaDay');
            $('#calendar').fullCalendar('gotoDate', navigationdate);
        }, 100);
        this.calendarView = 'Day';
    }


    ngOnInit() {
        System.import('script-loader!fullcalendar/dist/fullcalendar.min.js').then(() => {
            this.activeColorClass = this.colorClassNames[0];

            // notification route params to calendar
            this.route.params.subscribe(params => {
                this.notificationDate = params;
                if (this.notificationDate.date != undefined) {
                    this.notificationNavigation(this.notificationDate.date);
                }
            })

            if (this.notificationDate.date === undefined) {
                let filterLocalStorageObject: any = localStorage.getItem('filterObjectData');
                if (filterLocalStorageObject) {
                    filterLocalStorageObject = JSON.parse(filterLocalStorageObject);
                    if (filterLocalStorageObject.priorities.length || filterLocalStorageObject.eventTypes.length ||
                        filterLocalStorageObject.active) {
                        this.filterEventsObject = filterLocalStorageObject;
                        $('#priorityMultipleSelect').val(filterLocalStorageObject.priorities).trigger('change');
                        $('#evntTypeMultipleSelect').val(filterLocalStorageObject.eventTypes).trigger('change');
                        this.activeEvents = filterLocalStorageObject.active;
                    }
                }

            }
            // calling the calendar 
            this.render();
        })
    }

    // for filter multiple events input values handling
    ngAfterViewInit() {
        // priority
        $('#priorityMultipleSelect').on('change', (eventValues) => {
            this.prioritySelectedValues = $(eventValues.target).val();
            if (this.prioritySelectedValues === null) {
                this.prioritySelectedValues = [];
            }
        });

        // Event Type
        $('#evntTypeMultipleSelect').on('change', (eventValues) => {
            this.eventTypeSelectedValues = $(eventValues.target).val();
            if (this.eventTypeSelectedValues === null) {
                this.eventTypeSelectedValues = [];
            }
        });
    };


    calendarCssEnhancements() {
        $('.fc-header-right, .fc-header-center', this.$calendarRef).hide();
        $('.fc-left', this.$calendarRef).addClass('fc-header-title');
        $('.fc-more-popover', this.$calendarRef).addClass('fc-widget-content');
        $('.fc-head-container thead tr,th.fc-today', this.$calendarRef).addClass('bg-color-darken');
        $('td.fc-today', this.$calendarRef).addClass('fc-state-highlight');
    }
}




