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
  constructor(private http: Http) { }


  addEventData: any = {};
  //create event
  addEvent(event) {
    let header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", localStorage.getItem('Authentication'));
    // don't have the data yet
    return this.http.post(endponitConfig.CALENDAR_ENDPOINT + 'createEvent', event, { headers: header })
      .map(res => res.json())
      .catch(this.handleError);
  }

  allEventsData: any = {};
  getAllEvent() {
    let header = new Headers();
    header.append("Authorization", localStorage.getItem('Authentication'));
    // don't have the data yet
    return this.http.get(endponitConfig.CALENDAR_ENDPOINT + 'getEvents', { headers: header })
      .map(res => res.json())
      .catch(this.handleError);

  }
  //update event
  updateEventData: any = {};
  updateEvent(id, updateEvent) {
    let header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", localStorage.getItem('Authentication'));
    // don't have the data yet
    return this.http.put(endponitConfig.CALENDAR_ENDPOINT + 'event/' + id, updateEvent, { headers: header })
      .map(res => res.json())
      .catch(this.handleError);

  }
  //priority filter
  filterEvents: any = {};
  getFilterEvents(FilterPriorityData) {
    let header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", localStorage.getItem('Authentication'));
    // don't have the data yet
    return this.http.post(endponitConfig.CALENDAR_ENDPOINT + 'getEventsByFilter', FilterPriorityData, { headers: header })
      .map(res => res.json())
      .catch(this.handleError);

  }
  //filter by time range
  filterByTimeRange: any = {};
  getFilterDateEvents(startDate, EndDate) {
    let header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", localStorage.getItem('Authentication'));
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get(endponitConfig.CALENDAR_ENDPOINT + 'getEventsByTimeRange/' + startDate + '/' + EndDate, { headers: header })
        .map(res => res.json())
        .subscribe(data => {
          this.filterByTimeRange = data;
          resolve(this.filterByTimeRange);
        }, (error) => {
        });
    });
  }


  private handleError(error: any) {
    if (error.status == 404) {
      return Observable.throw(error.json());
    } else {
      localStorage.setItem('status', '401')
      // 401 unauthorized response so log user out of client
      window.location.href = '/#/error';
      return Observable.throw(error._body);
    }
  }



}
