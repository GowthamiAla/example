import { Injectable } from '@angular/core';
import { JsonApiService } from "../../../../core/api/json-api.service";
import { Observable } from 'rxjs/Rx'

import { Http, Headers, Response, RequestOptions } from "@angular/http";

import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { endponitConfig } from '../../../../../environments/endpoints';

@Injectable()
export class ActivitiesService {

  url: string;
  public headers;
  constructor(private jsonApiService: JsonApiService, private http: Http) {
    this.url = '/activities/activities.json';
    this.headers = new Headers();
    this.headers.append("Authorization", "Basic " + localStorage.getItem('Authentication'));
    this.headers.append("Content-Type", "application/json");
  }


  getActivities() {
    return this.jsonApiService.fetch(this.url)

  }

  getNotifications() {
    return this.http.get(endponitConfig.NOTIFICATIONS_API_ENDPOINT + 'notify/' + localStorage.getItem('userData'), { headers: this.headers }).map(res => { return res.json() })
  }

  /** Get All Subscription Channels */
  getAllWebSocketConnections() {
    return this.http.get(endponitConfig.NOTIFICATIONS_API_ENDPOINT + 'channels/' + Number(localStorage.getItem('userData')), { headers: this.headers })
      .map(response => {
        return response.json().data;

      });
  }

  /** Update Notification Read status as Read */
  updateNotificationReadStatus() {
    return this.http.put(endponitConfig.NOTIFICATIONS_API_ENDPOINT + 'notify/count/' + Number(localStorage.getItem('userData')),'', { headers: this.headers })
      .map(response => {
        return response.json().data;

      });
  }
  /** Get Notification count based on read status */
  getNotificationCount() {
    return this.http.get(endponitConfig.NOTIFICATIONS_API_ENDPOINT + 'notify/count/' + Number(localStorage.getItem('userData')), { headers: this.headers })
      .map(response => {
        return response.json().data;

      });
  }


}
