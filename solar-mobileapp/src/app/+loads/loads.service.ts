import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { endponitConfig } from '../../environments/endpoints';


@Injectable()
export class LoadServices {
    public headers: Headers;

    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append('Authorization',  localStorage.getItem('Authentication'));
        this.headers.append('Content-Type', 'application/json');
    }

    getAllLoads(driverId: any) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(endponitConfig.SOLAR_LOAD_ENDPOINT + 'loadAppointments/getDriverNotCompletedLoads/' + driverId, { headers: this.headers })
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    getLoadDetails(loadId: any) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(endponitConfig.SOLAR_LOAD_ENDPOINT + 'loadAppointments/getLoadAppointments/' + loadId, { headers: this.headers })
            .map(res => { return res.json().data }).catch(this.handleError);
    }

    setLoadAccept(loadId: any, status: any) {
        // tslint:disable-next-line:max-line-length
        return this.http.put(endponitConfig.SOLAR_LOAD_ENDPOINT + 'loadAppointments/updateLoad/' + loadId + '/' + status, '', { headers: this.headers })
            .map(res => { return res.json().data }).catch(this.handleError);
    }

    sendLocationDetails(currentLat, currentLng, destinationlat, destinationlng, geoMiles, destinationManagerId, driverObject) {
        // tslint:disable-next-line:max-line-length
        return this.http.post(endponitConfig.SOLAR_DASHBOARD_LOCATION + 'locations/geofence/' + currentLat + '/' + currentLng + '/' + destinationlat + '/' + destinationlng + '/' + geoMiles + '/' + destinationManagerId + '/', driverObject, { headers: this.headers })
            .map(res => { return res });
    }

    getTimeandDistance(currentLat, currentLng, destinationlat, destinationlng) {
        return this.http.get(endponitConfig.SOLAR_DASHBOARD_LOCATION
            // tslint:disable-next-line:max-line-length
            + 'locations/distance/' + currentLat + '/' + currentLng + '/' + destinationlat + '/' + destinationlng + '/', { headers: this.headers })
            .map(res => { return res.json() });
    }

    getWeatherReport(latitude, longitude) {
        return this.http.get(endponitConfig.SOLAR_DASHBOARD_LOCATION
            + 'locations/weatherinfo/' + latitude + '/' + longitude + '/', { headers: this.headers })
            .map(res => { return res.json().data });
    }

    sendDriverCoordinates(currentLat, currentLng, driverObject) {
        return this.http.put(endponitConfig.SOLAR_DASHBOARD_LOCATION
            + 'drivers/updateDriver/' + driverObject + '/' + currentLat + '/' + currentLng + '/', '', { headers: this.headers })
            .map(res => { return res.json().data });
    }


    private handleError(error: any) {
        localStorage.setItem('status', '401')
        // 401 unauthorized response so log user out of client
        window.location.href = '/#/error';


        return Observable.throw(error._body);
    }


}
