import { INotifications } from './notifications';

/**
 *This is model driver class to store driver data
 */

export class Notifications implements INotifications {


  constructor(
    public id : string,
	public from_id : string,
	public to_id : string,
	public primaryItemId : string,
	public secondaryItemId : string,
	public channel : string,
	public toComponentName : string,
	public fromComponentName : string,
	public componentAction : string,
	public data : string,
	public dateNotified : Date,
	public dateReceived : Date,
	public isNew : string,
	public notificationTime:string,
	public dateNotifiedInStringFormat : string ){

    }

}
