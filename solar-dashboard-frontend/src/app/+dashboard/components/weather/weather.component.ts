import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';


import { endponitConfig } from '../../../../environments/endpoints';
declare var $;


@Injectable()
export class WeatherComponent {
	private headers: Headers;

	constructor(private router: Router, private http: Http) {
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		// this.headers.set('X-Auth-Token', localStorage.getItem('token'));
		// this.headers.set('X-Auth-Token', localStorage.getItem('token'));
		this.headers.append("Authorization", localStorage.getItem('Authentication'));
	}

	getWeatherReport(latitude, longitude) {
		return this.http.get(endponitConfig.SOLAR_API_ENDPOINT
			+ 'locations/weatherinfo/' + latitude + '/' + longitude + '/', { headers: this.headers })
			.map(res => { return res.json().data }).catch(this.handleError);
	}
	private handleError(error: any) {
		return Observable.throw(error._body);
	}
}
