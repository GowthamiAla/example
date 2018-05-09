import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { endponitConfig } from '../../../environments/endpoints';
// import { endponitConfig } from '../../environments/endpoints';

@Injectable()
export class EventsService {

  constructor(private http: Http) {
   }


  addEventData: any = {};
  //create event
  addEvent(event) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // don't have the data yet
    return new Promise(resolve => {
      this.http.post(endponitConfig.CALENDAR_ENDPOINT+'createEvent', event, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.addEventData = data;
          resolve(this.addEventData);
        }, (error) => (console.log('error')));
    });
  }

  allEventsData: any = {};
  getAllEvent() {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get(endponitConfig.CALENDAR_ENDPOINT+'getEvents', { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.allEventsData = data;
          resolve(this.allEventsData);
        }, (error) => (console.log('error')));
    });
  }
  //update event
  updateEventData: any = {};
  updateEvent(id, updateEvent) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // don't have the data yet
    return new Promise(resolve => {
      this.http.put(endponitConfig.CALENDAR_ENDPOINT+'event/' + id, updateEvent, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.updateEventData = data;
          resolve(this.updateEventData);
        }, (error) => (console.log('error')));
    });
  }
  //priority filter
  filterEvents: any = {};
  getFilterEvents(FilterPriorityData) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // don't have the data yet
    return new Promise(resolve => {
      this.http.post(endponitConfig.CALENDAR_ENDPOINT+'getEventsByFilter',FilterPriorityData, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.filterEvents = data;
          resolve(this.filterEvents);
        }, (error) => (console.log('error')));
    });
  }
  //filter by time range
  filterByTimeRange: any = {};
  getFilterDateEvents(startDate, EndDate) {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get(endponitConfig.CALENDAR_ENDPOINT+'getEventsByTimeRange/' + startDate + '/' + EndDate, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.filterByTimeRange = data;
          resolve(this.filterByTimeRange);
        }, (error) => (console.log('error')));
    });
  }



}
