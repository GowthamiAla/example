package com.mss.solar.maps.common;

public class RestApiUrlConstants {

	/**
	 * Maps MODULE
	 */

	public static final String GET_WEATHER_INFO = "/weatherinfo/{latitude}/{longitude}/";

	public static final String GET_DISTANCE_INFO = "/distance/{sourcelat}/{sourcelong}/{destlat}/{destlong}/";
	
	public static final String GET_DISTANCE = "/distanceTime/{sourcelat}/{sourcelong}/{destlat}/{destlong}/";

	public static final String NOTIFY_GEOFENCE = "/geofence/{startLat}/{startLong}/{endLat}/{endLong}/{geomiles}/";

}
