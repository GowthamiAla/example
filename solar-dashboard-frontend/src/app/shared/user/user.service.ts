import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs/Rx";

import {JsonApiService} from "../../core/api/json-api.service";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

@Injectable()
export class UserService {

  public user: Subject<any>;

  public userInfo = {
    username: 'Guest'
  };

  constructor(private http: Http, private jsonApiService:JsonApiService) {
    this.user = new Subject();
  }

  getLoginInfo():Observable<any> {
    return this.jsonApiService.fetch('/user/login-info.json')
      .do((user)=>{
        this.userInfo = user;
      this.user.next(user)
    })
  }

   userLogout() {
    let headers1 = new Headers();
    headers1.append("Content-Type", "application/json");

    return this.http.post('logout', { headers: headers1 }).map(response => {
      return response;
    });
  }

}
