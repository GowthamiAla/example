package com.mss.solar.calendar.common;

public class RestApiUrlConstants {

	/**
	 * CALENDAR MODULE
	 */
	public static final String CREATE_EVENT = "/createEvent";

	public static final String CREATE_EVENT_NEW = "/createEventNew";

	public static final String EVENT_ID = "/event/{calendarId}";
	
	public static final String UPDATE_STATUS = "/updateStatus/{calenderId}/{active}";
	
	public static final String GET_EVENTS = "/getEvents";
	
	public static final String GET_EVENT_BY_TIME_RANGE = "/getEventsByTimeRange/{startTime:.+}/{endTime:.+}";
	
	public static final String GET_EVENT_BY_PRIORITY = "/getEventsByPriority/{priority}";
	
	public static final String GET_EVENT_BY_TITLE = "/getEventsByTitle/{title}";
	
	public static final String GET_ACTIVE_EVENTS = "/getActiveEvents/{active}";
	
	public static final String GET_CURRENT_EVENTS = "/getCurrentEvents";
	
	public static final String GET_EVENT_BY_FILTER = "/getEventsByFilter";


}
