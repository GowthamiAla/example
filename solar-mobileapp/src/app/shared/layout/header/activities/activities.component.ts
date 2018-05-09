import { Component, OnInit, ElementRef, Renderer, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivitiesService } from './activities.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
declare var $: any;
import { endponitConfig } from '../../../../../environments/endpoints';
import { Global } from '../../../global';
// import { CalendarWidgetComponent } from '../../../../+calendar/calendar-widget/calendar-widget.component';

import { AlertNotificationService } from '../../../utils/notification.service';

import * as moment from 'moment';

declare var SockJS;
declare var Stomp;

@Component({
    selector: 'sa-activities',
    templateUrl: './activities.component.html',
    providers: [ActivitiesService, Global],
    styles: [`
    .notificationDropDown:after, .notificationDropDown:before {
    right: 7.5% !important;
    left:auto !important;
        }
        .notificationDropDown{
            left:auto !important;
            right:0px !important;
                height: 450px;
        }
        @media only screen and (max-width: 479px) and (min-width: 320px){
            .notificationDropDown {
                height: 345px !important;
            }
        }
        @media screen and(min-width: 480px){
            .notificationDropDown {
                height: 450px !important;
            }
        }`]
})
export class ActivitiesComponent implements OnInit, OnDestroy {

    @Output() userUpdated = new EventEmitter();
    stompClient;
    private documentSub: any;
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

    constructor(
        private service: Global,
        private el: ElementRef,
        private renderer: Renderer,
        private activitiesService: ActivitiesService,
        private router: Router,

        private alertNotificationService: AlertNotificationService
    ) {
        this.active = false;
        this.loading = false;
        this.activities = [];

        this.lastUpdate = new Date();
        this.grouped = [];

        // this.notificationCount();
        // this.calendar();
        // this.webSocketConnection();
    }

    ngOnInit() {
        this.notificationCount();
        // this.calendar();
        this.webSocketConnection();

    }
    public notificationCount() {
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
                // if (this.calendarDataCount == undefined || this.notificationDataCount == undefined) {
                //     this.notificationDataCount = 0;
                //     this.calendarDataCount = 0
                // }
                this.count = Number(this.notificationDataCount)
                // + Number(this.calendarDataCount)
                this.activitiesHeaders = [{ data: 'notifications', count: Number(this.notificationDataCount) },
                    // { data: 'calendar', count: Number(this.calendarDataCount)}
                ];
                this.currentActivityHeader = this.activitiesHeaders[0].data;
            }else {
                if (data.error.message) {
                    this.notificationDataCount = 0;
                    this.calendarDataCount = 0;
                    this.count = 0;
                    this.noNotifications = true
                }
            }

        }, error => {
            console.log('Error')
            console.log(error)

        })
    }


    public websocketNotificationCount() {
        Global.stompClient.subscribe('/topic/' + localStorage.getItem('userData') + '/notificationCount', (response) => {
            this.count = response.body;
            // this.notificationAlert()
            console.log('websocketNotificationCount' + JSON.stringify(response))
             this.notificationCount()
        });
    }


    // public calendar() {
    //     var startTime = moment().startOf('day').toDate();
    //     var endTime = moment().endOf('day').toDate();
    //     this.eventsService.getFilterDateEvents(moment(startTime).format(), moment(endTime).format()).then(response => {
    //         this.eventsListResponse = response;
    //         if (response) {
    //             this.calendarDataCount = this.eventsListResponse.data.length;

    //             this.eventListData = this.eventsListResponse.data.sort((a, b) => {
    //                 return a.start > b.start ? 1 : -1;
    //             }).slice(0, 5);

    //         }

    //     })
    // }

    onEventNavigation(date) {
        const dropdown = $('.ajax-dropdown', this.el.nativeElement);
        this.active = false;
        dropdown.fadeOut();
        const goDate = date.split('T');
        const link = ['/calendar', { date: goDate[0] }];
        this.router.navigate(link);

    }

    public webSocketConnection() {

        const socket = new SockJS(endponitConfig.WEBSOCKET_ENDPOINT);
        Global.stompClient = Stomp.over(socket);
        Global.stompClient.connect({}, (frame) => {
            this.getAllEventsCodes()
            // this.websocketNotificationCount();
        });


    }

    getAllEventsCodes() {
        this.activitiesService.getAllWebSocketConnections().subscribe(
            data => {
                if (data) {
                    data.forEach(eventCode => {
                        Global.stompClient.subscribe('/topic/' + localStorage.getItem('userData') + '/' + eventCode, (response) => {

                            console.log('websocket response' + JSON.stringify(response))
                            //  this.count = this.count + 1;
                            this.notificationCount();
                            this.notificationAlert(response.body)

                        });

                    });
                }
            },
            error => {
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
        this.notificationCount();
        // this.calendar();
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
        const link = ['/notifications/notificationssettings'];
        this.router.navigate(link);

    }

    notificationsList() {
        this.activitiesService.updateNotificationReadStatus().subscribe(
            data => {
                console.log('getNotificationCountAfterRead' + data)
                if (data.error == null) {
                    this.count = 0;
                    this.getNotificationCountAfterRead();
                }
            },
            error => {
            });


    }

    getNotificationCountAfterRead() {
        this.activitiesService.getNotificationCount().subscribe(
            data => {
                // if (data) {
                // this.notificationCount();
                this.count = Number(data);
                this.active = false;
                $('.ajax-dropdown', this.el.nativeElement).fadeOut()
                const link = ['/notifications/notificationslist', { data: 'notificationsList' }];
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
        const link = ['/notifications/notificationslist', { data: 'calendarsList' }];
        this.router.navigate(link);
        // let link = ['/notifications/notificationslist'];
        // this.router.navigate(link);
    }


    ngOnDestroy() {
        this.documentUnsub()
    }

    documentUnsub() {
        this.documentSub && this.documentSub();
        this.documentSub = null
    }

}
