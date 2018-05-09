import { INotificationSettings } from './notificationsettings';

/**
 *This is model driver class to store notification settings data
 */

export class NotificationSettings implements INotificationSettings {


  constructor(
    public id : number,
	public component_id : number,
	public component : string,
	public description : string,
	public web_socket : number,
	public email : number,
	public mobile : number,
	public wdisabled : boolean,
	public emailStatus:boolean,
	public webSocketStatus:boolean){

    }
}