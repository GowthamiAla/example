import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { endponitConfig } from '../../../environments/endpoints';

@Injectable()
export class UserService {
    public headers: Headers;

    constructor(private http: Http) {

    }

    getAllUsers(): Observable<UserData[]> {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('Authentication'));
        header.append('Content-Type', 'application/json');
        return this.http.get(endponitConfig.USER_API_ENDPOINT + 'getAllUsers', { headers: header })
            .map((response: Response) => response.json().data).catch(this.handleError);
    }

    deleteUser(userId: any) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('Authentication'));
        header.append('Content-Type', 'application/json');
        return this.http.get(endponitConfig.USER_API_ENDPOINT + 'deleteUser/' + userId, { headers: header })
            .map(res => { return res.json() }).catch(this.handleError);
    }

    updateUser(userDetails) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('Authentication'));
        header.append('Content-Type', 'application/json');
        return this.http.put(endponitConfig.USER_API_ENDPOINT + 'updateUser', JSON.stringify(userDetails), { headers: header })
            .map(res => { return res.json() }).catch(this.handleError);
    }

    addUser(userDetails) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('Authentication'));
        header.append('Content-Type', 'application/json');
        return this.http.post(endponitConfig.USER_API_ENDPOINT + 'addUser', JSON.stringify(userDetails), { headers: header })
            .map(res => { return res.json() }).catch(this.handleError);
    }

    getAllUserRoleTypes() {
       let header = new Headers();
        header.append('Authorization', localStorage.getItem('Authentication'));
        header.append('Content-Type', 'application/json');
        return this.http.get(endponitConfig.USER_API_ENDPOINT + 'getAllRoles', { headers: header })
            .map((response: Response) => response.json().data).catch(this.handleError);
    }

    /**
  * This method gets  user details based on user Id
  */
    public getUserDetailsByID(userId: string) {
        return this.getAllUsers().toPromise().then(users =>
            users.find(usera => Number(usera.id) === Number(userId))).catch(this.handleError);;
    }

    private handleError(error: any) {
        if (error.status == 404) {
            localStorage.setItem('status', '500')
            return Observable.throw(error.json());
        } else {
            localStorage.setItem('status', '401')
            // 401 unauthorized response so log user out of client
            window.location.href = '/#/error';
            return Observable.throw(error._body);
        }
    }




}


export class UserData {
    constructor() { }
    public id: string;
    public name: string;
    public email: string;
    public phone: string;
    public active: boolean;
    public roles: roles[]
}
export class roles {
    public id: number;
    public name: string
}
