package com.mss.solar.dashboard.common;

public class RestApiUrlConstants {

	private RestApiUrlConstants() {
	}

	/**
	 * LoadAppointment MODULE
	 */

	public static final String GET_ALL_LOADAPPOINTMENTS = "/getAllLoadAppointments";
	
	public static final String UPDATE_LOADAPPOINTMENT = "/updateLoadAppointment";
	
	public static final String DELETE_LOADAPPOINTMENT = "/deleteLoadAppointment/{apptNbr}";
	
	public static final String ADD_LOADAPPOINTMENT = "/addLoadAppointment";
	
	public static final String GET_LOADAPPOINTMENTS_BY_DRIVER = "/getAllLoadAppointments/{driverId}";
	
	public static final String GET_LOADAPPOINTMENTS_BY_APPTNBR = "/getLoadAppointments/{apptNbr}";
	
	public static final String UPDATE_lOAD_STATUS = "/updateLoad/{apptNbr}/{status}";
	
	public static final String GET_ACCEPTED_LOADS_BY_DRIVER = "/getDriverAcceptedLoads/{driverId}";
	
	public static final String GET_NOT_COMPLETED_LOADS= "/getDriverNotCompletedLoads/{driverId}";
	
	public static final String GET_ALL_ACCEPTED_LOADS = "/getAcceptedLoadList";
	
	public static final String GET_LOADS_BASED_LOCATIONS ="/getLoadsBasedOnLocations/{locNbr}";
	
	public static final String UPDATE_HIGH_VALUE ="/updateHighValue/{loadAppt}/{highValueLoad}/{highPriorityLoad}";
	
	public static final String GET_LOADS_BASED_DCMANAGER = "/getLoadsBasedOnDcManager/{email}/";
	
	public static final String UPDATE_GEOMILES = "/updateGeofenceMiles/{apptNbr}/{geomiles}";
	
	
	/**
	 * Driver MODULE
	 */
	public static final String ADD_DRIVER = "/addDriver";

	public static final String UPDATE_DRIVER = "/updateDriver";

	public static final String DELETE_DRIVER = "/deleteDriver/{id}";

	public static final String GET_ALL_DRIVERS = "/getDrivers";

	public static final String GET_DRIVERS_BY_ID = "/getDriver/{id}";
	
	public static final String UPDATE_DRIVER_BY_ID = "/updateDriver/{driverId}/{latitude}/{longitude}/";
	
	public static final String GET_DRIVER_BY_USER_ID = "/getDriverByUserID/{userId}";
	
	public static final String GET_DRIVERS_BY_VENDOR_NUMBER= "/getDriversByVendorNum/{vendorNbr}";

	/**
	 * LOCATION MODULE
	 */
	
	public static final String ADD_LOCATION = "/addLocation";
	
	public static final String UPDATE_LOCATION ="/updateLocation";
	
	public static final String DELETE_LOCATION ="/deleteLocation/{locNbr}";
	
	public static final String GET_ALL_LOCATIONS ="/getAllLocations";
	
	public static final String GET_LOCATIONS_BY_LOCNBR ="/getLocation/{locNbr}";
	
	public static final String GET_DISTANCE_INFO = "/distance/{sourcelat}/{sourcelong}/{destlat}/{destlong}/";

	public static final String NOTIFY_GEOFENCE = "/geofence/{startLat}/{startLong}/{endLat}/{endLong}/{geomiles}/{dcManagerId}";
	
	public static final String NOTIFY_BY_DCMANAGER ="/notifyEmail/{email}/";
	
	public static final String GET_WEATHER_INFO = "/weatherinfo/{latitude}/{longitude}/";
	
	

	/**
	 * LoadAppointmentType MODULE
	 */
	public static final String GET_ALL_LOADAPPOINTMENTTYPES = "/getLoadAppointmentTypes";

	/**
	 * Vendors MODULE
	 */
	public static final String GET_ALL_VENDORS = "/getVendors";
	
	public static final String ADD_VENDOR = "/addVendor";

	public static final String UPDATE_VENDOR = "/updateVendor";

	public static final String DELETE_VENDOR = "/deleteVendor/{vendorNbr}";

	public static final String GET_VENDOR_BY_NUMBER = "/getVendor/{vendorNbr}";
	
	/**
	 * Analytics MODULE
	 */
	public static final String GET_ANALYTICS_DATA = "/getAnalyticsData";
	
	public static final String GET_ANALYTICS_BY_DATE = "/getAnalyticsData/{startDate}/{endDate}";
	
	public static final String GET_VENDOR_RELATED_LOADS = "/getVendorRelatedLoadAppointments/{vendorName}/{destination}";
	
	public static final String GET_VENDOR_RELATED_LOADS_NO_DESTINATION= "/getVendorRelatedLoadAppointments/{vendorName}";
	
	/**
	 * REPORT MODULE
	 */
	public static final String GENERATE_REPORT = "/{templateName}";
	
	

}

