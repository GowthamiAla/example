import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { endponitConfig } from '../../environments/endpoints';
declare var SockJS;
declare var Stomp;
@Injectable()
export class Global {
    public static stompClient: any;
    public static currentDate: Date;
    public static previousDate: Date;
    public wsObservable;
    ws;

    public static offlineMessage = [];
    constructor() {      
        // var socket = new SockJS(endponitConfig.WEBSOCKET_ENDPOINT);
        // Global.stompClient = Stomp.over(socket);
        // Global.stompClient.connect({}, (frame) => {
        // });
    }

 
}
