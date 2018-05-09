import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx'
import {JsonApiService} from "../../core/api/json-api.service";


@Injectable()
export class MapStyleService {


  constructor(private jsonApiService:JsonApiService) {  }


  fetchStyle(style):Observable<any> {
    return this.jsonApiService.fetch(style.url)
  }
  // fetchStyle(style){
  //   alert(style);
  //   //  return this.http.get(endponitConfig.PARKING_SLOTS+'/'+id ,{ headers: this.headers })
  //   //         .map((response: Response) => response.json().data).catch(this.handleError);
  // }

}
