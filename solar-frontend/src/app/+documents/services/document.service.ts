import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { IDocument } from '../models/document';

import { endponitConfig } from '../../../environments/endpoints';
/**
 * This is document service class which does Rest service calls for  all document operations
 */
@Injectable()
export class DocumentService {
    private headers: Headers;
    constructor(private http: Http) {

         this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.set('X-Auth-Token', localStorage.getItem('token'));

    }

     public getAllDocumentsDetailsSolar(a: any) {
        let getDocumentURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getloadnumbyPrefix?loadnumprefix='
        let url = `${getDocumentURL}`;
        return this.http.get(url,  { headers: this.headers })
            .map((response: Response) => response.json());

    }

    public getAllDocumentsDetails(a: any) {
        let getDocumentURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getloadnumbyPrefix?loadnumprefix='
        let url = `${getDocumentURL}`;
        return this.http.post(url, 'a', { headers: this.headers })
            .map((response: Response) => response.json());

    }

    /**
    * This method get Document Details By LoadNumber
    */
    public getDocumentDetailsByLoadNumber(loadNumber: any) {
        let getDocumentDetailsByLoadNumberURL = endponitConfig.PALS_DRIVERS_ENDPOINT + 'getDealersInfoByLoadNum?loadNum='
        let url = `${getDocumentDetailsByLoadNumberURL}${loadNumber}`;
        return this.http.get(url, { headers: this.headers })
            .map((response: Response) => response.json().data);

    }

}
