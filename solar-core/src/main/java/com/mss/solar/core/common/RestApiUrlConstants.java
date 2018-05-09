package com.mss.solar.core.common;

public class RestApiUrlConstants {

	
    private RestApiUrlConstants(){
		
	}
	
    /**
	 * Global variables 
	 */
    public static final String GET_DETAILS_BY_ID = "/{id}";
    
	/**
	 * USERS MODULE
	 */
	public static final String ADD_USER = "/addUser";

	public static final String UPDATE_USER = "/updateUser";

	public static final String DELETE_USER = "/deleteUser/{userId}";

	public static final String GET_ALL_USERS = "/getAllUsers";

	public static final String GET_ALL_ROLES = "/getAllRoles";

	public static final String GET_USERS_BY_ROLE = "/getUsersByRole/{role}";

	public static final String GET_USER_BY_EMAIL = "/getUserByEmail/{email:.+}";

	public static final String GET_USER_BY_PHONE = "/getUserByPhone/{phone}";

	public static final String REGISTER_USER = "/registerUser";

	public static final String SET_PW = "/setPassword/{userId}/{otp}/{password}";

	public static final String ADD_ROLE = "/addRole";

	public static final String FORGOT_PW = "/forgotPassword/{email:.+}/{phone}";

	/**
	 * MESSAGE TEMPLATE MODULE
	 */
	public static final String MESSAGE_TEMPLATE = "/";

	/**
	 * NOTIFICATION MODULE
	 */
	public static final String NOTIFICATION_EVENT_SETTINGS = "/eventsettings";

	public static final String NOTIFICATION_EVENT_SETTINGS_BY_ID = "/eventsettings/{userId}";

	public static final String DEFAULT_NOTIFICATION_EVENT_SETTINGS_BY_ID = "/eventsettings/default";

	public static final String NOTIFY_USER = "notifyUser/{userId}/{payload}";

	public static final String READSTATUS_NOTIFY_USERS = "/notify/count/{userId}";

	public static final String NOTIFY_USER_BY_ID = "/notify/{userId}";
	
	public static final String NOTIFY_USER_BY_USERID = "/notification/{userId}/{serviceEvntId}";

	public static final String SEND_NOTIFICATION_TO_ALL_ADMINS = "/notify/{serviceEvntId}/admins";

	public static final String DELETE_NOTIFICATION_EVENT_SETTING = "/eventsettings/{eventSettingId}";

	public static final String SEND_NOTIFICATION_TO_USERS_WITH_ROLES = "/notify/{serviceEvntId}/{roles}";

	public static final String GET_NOTIFICATION_CHANNELS = "/channels/{role}/{userId}";
	
	public static final String NOTIFY_BY_DCMANAGER ="/notifyEmail/{serviceEvntId}/{email}/";
	
	public static final String GET_NOTIFICATION_BY_ROLE= "/getNotificationEventSettingsByRole/{role}/{userId}";
	
	public static final String SEND_NOTIFICATION= "/notify/roles/{serviceEvntId}";
	
	public static final String CHANGE_READSTATUS = "/changeReadStatus/{id}";

	/**
	 * SERVICE EVENT MODULE
	 */

	public static final String SERVICE_EVENT = "/";

	/**
	 * WIDGET MODULE
	 */

	public static final String WIDGET = "/";

}
