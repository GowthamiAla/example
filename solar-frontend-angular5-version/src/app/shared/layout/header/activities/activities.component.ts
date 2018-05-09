import { Component, OnInit, NgZone, ElementRef, Renderer, OnDestroy, Output, EventEmitter, ViewEncapsulation, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { ActivitiesService } from './activities.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { geoNotificationComponent } from './geo-fence-notification/geoNotification'
import * as _ from 'lodash';
declare var $: any;
import { endponitConfig } from '../../../../../environments/endpoints';
import { Global } from '../../../global';
//import { CalendarWidgetComponent } from '../../../../+calendar/calendar-widget/calendar-widget.component';
import { EventsService } from '../../../../+calendar/shared/events.service';

import { NotificationService } from '../../../utils/notification.service';

import * as moment from 'moment';

declare var SockJS;
declare var Stomp;

@Component({
    selector: 'sa-activities',
    templateUrl: './activities.component.html',
    providers: [ActivitiesService, EventsService, Global],
    encapsulation: ViewEncapsulation.None,
})
export class ActivitiesComponent implements OnInit, OnDestroy {


    @Output() userUpdated = new EventEmitter();
    stompClient;

    count: number;
    lastUpdate: any;
    active: boolean;
    activities: any;
    activitiesHeaders: any;
    currentActivityHeader: any;
    currentActivity: any;
    loading: boolean;
    grouped;

    eventListData: any = [];
    eventsListResponse: any;

    notificationDataCount;
    calendarDataCount;
    noNotifications = false;
    private documentSub: any;

    constructor(
        private service: Global,
        private el: ElementRef,
        private renderer: Renderer,
        private activitiesService: ActivitiesService,
        private router: Router,
        private eventsService: EventsService,
        private viewContainerRef: ViewContainerRef,
        private alertNotificationService: NotificationService,
        private ngZone: NgZone
    ) {
        this.active = false;
        this.loading = false;
        this.activities = [];

        this.lastUpdate = new Date();
        this.grouped = [];

        // this.notificationCount();
        // this.calendar();
        //  this.webSocketConnection();
    }

    ngOnInit() {
        this.calendar();
        this.notificationCount();
        this.webSocketConnection();

    }
    public notificationCount() {

        this.notificationEventsList();
        this.currentActivityHeader = this.activitiesHeaders[0].data;

        this.activitiesService.getNotifications().subscribe(data => {
            if (data.data) {
                this.noNotifications = false;
                this.notificationDataCount = data.data.length;

                this.notificationDataCount = data.data.reduce((count, item) => {
                    return count + (item['readStatus'] === 1 ? 1 : 0);
                }, 0);
                this.currentActivity = data.data.sort((a, b) => {
                    return a.lastUpdateTime < b.lastUpdateTime ? 1 : -1;
                }).slice(0, 5);
                if (this.calendarDataCount == undefined || this.notificationDataCount == undefined) {
                    this.notificationDataCount = 0;
                    this.calendarDataCount = 0
                }
                // temp calender count is 0
                this.calendarDataCount = 0;
                this.count = Number(this.notificationDataCount) + Number(this.calendarDataCount);
                this.currentActivityHeader = this.activitiesHeaders[0].data;
            } else {
                if (data.error.message) {
                    this.notificationDataCount = 0;
                    this.calendarDataCount = 0;
                    this.count = 0;
                    this.noNotifications = true
                }
            }

        }, error => {
            console.log(error)

        })
    }

    notificationEventsList() {
        this.activitiesHeaders = [{ data: 'notifications', count: Number(this.notificationDataCount) }, { data: 'calendar', count: Number(this.calendarDataCount) }];
    }


    public websocketNotificationCount() {
        Global.stompClient.subscribe('/topic/' + localStorage.getItem('userData') + '/notificationCount', (response) => {
            this.count = response.body;
            // this.notificationAlert()
            // console.log('websocketNotificationCount' + JSON.stringify(response))
            // this.notificationCount()
        });
    }


    public calendar() {
        const startTime = moment().startOf('day').toDate();
        const endTime = moment().endOf('day').toDate();
        this.eventsService.getFilterDateEvents(moment(startTime).format(), moment(endTime).format()).then(response => {
            this.notificationCount();
            this.eventsListResponse = response;
            if (response) {
                // this.calendarDataCount = this.eventsListResponse.data.length;
                this.noNotifications = true;
                this.eventListData = this.eventsListResponse.data.sort((a, b) => {
                    return a.start > b.start ? 1 : -1;
                })
                // .slice(0, 5);
            }

        })

    }

    onEventNavigation(date) {
        const dropdown = $('.ajax-dropdown', this.el.nativeElement);
        this.active = false;
        dropdown.fadeOut();
        const goDate = date.split('T');
        const link = ['/calendar', { date: goDate[0] }];
        this.router.navigate(link);

    }

    public webSocketConnection() {
        this.ngZone.runOutsideAngular(() => {
        const socket = new SockJS(endponitConfig.WEBSOCKET_ENDPOINT);
        Global.stompClient = Stomp.over(socket);
        Global.stompClient.connect({}, (frame) => {
            this.getAllEventsCodes()
            this.websocketNotificationCount();
        });
    })


    }

    getAllEventsCodes() {
        this.activitiesService.getAllWebSocketConnections().subscribe(
            data => {
                if (data) {
                    data.forEach(eventCode => {
                        this.subscribeEventsOnSelection(eventCode);
                        // Global.stompClient.subscribe('/topic/' + localStorage.getItem('userData') + '/' + eventCode, (response) => {

                        //     console.log('websocket response' + JSON.stringify(response))
                        //     //  this.count = this.count + 1;
                        //     this.notificationCount();
                        //     this.notificationAlert(response.body)

                        // });

                    });
                }
            },
            error => {
            });
    }

    subscribeEventsOnSelection(eventCode) {
        Global.stompClient.subscribe('/topic/' + localStorage.getItem('userData') + '/' + eventCode, (response) => {
            //  this.count = this.count + 1;
            //  this.websocketNotificationCount();
            this.notificationCount();
            this.notificationAlert(response.body)
        });

    }

    notificationAlert(body) {
        this.alertNotificationService.smallBox({
            title: 'New Notification',
            content: body,
            color: '#296191',
            iconSmall: 'fa fa-thumbs-up bounce animated',
            timeout: 4000
        });
    }

    setActivity(activity) {
        this.currentActivityHeader = activity;
    }


    onToggle() {
        this.calendar();
        this.notificationCount();

        const dropdown = $('.ajax-dropdown', this.el.nativeElement);
        this.active = !this.active;
        if (this.active) {
            dropdown.fadeIn()
            this.documentSub = this.renderer.listenGlobal('document', 'mouseup', (event) => {
                if (!this.el.nativeElement.contains(event.target)) {
                    dropdown.fadeOut();
                    this.active = false;
                    this.documentUnsub()
                }
            });
        } else {
            dropdown.fadeOut()
            this.documentUnsub()
        }
    }



    update() {
        this.loading = true;
        setTimeout(() => {
            this.lastUpdate = new Date()
            this.loading = false
        }, 1000)
        this.active = false;
        $('.ajax-dropdown', this.el.nativeElement).fadeOut()
        let link = ['/notifications/notificationssettings'];
        this.router.navigate(link);

    }

    notificationsList() {
        this.activitiesService.updateNotificationReadStatus().subscribe(
            data => {
                this.count = 0;
                this.calendarDataCount = 0;
                this.notificationDataCount = 0;
                this.getNotificationCountAfterRead();
            },
            error => {
            });


    }

    getNotificationCountAfterRead() {
        this.activitiesService.getNotificationCount().subscribe(
            data => {
                // if (data) {
                this.notificationCount();
                this.count = Number(data);
                this.active = false;
                $('.ajax-dropdown', this.el.nativeElement).fadeOut()
                const link = ['/notifications/notificationslist', 'notificationsList' ];
                // let link = ['/notifications/notificationslist'];
                this.router.navigate(link);
                // }
            },
            error => {
            });
    }

    calendarEventsList() {
        this.active = false;
        $('.ajax-dropdown', this.el.nativeElement).fadeOut()
        const link = ['/notifications/notificationslist', 'calendarsList' ];
        this.router.navigate(link);
        // let link = ['/notifications/notificationslist'];
        // this.router.navigate(link);
    }

    changeReadStatus(eventData) {
        if (eventData.readStatus === 1) {
            this.activitiesService.setReadStatus(eventData.id).subscribe(data => {
                eventData.readStatus = 0;
                this.notificationDataCount--;
                this.count = this.notificationDataCount;
                this.notificationEventsList();
            }, error => {
                console.log(error)
            })
        }
    }


    ngOnDestroy() {
        this.documentUnsub()
    }

    documentUnsub() {
        this.documentSub && this.documentSub();
        this.documentSub = null
    }

}
