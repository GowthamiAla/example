package com.mss.solar.dashboard.common;

public enum EnumTypeForErrorCodes {

	/**
	 * Driver MODULE
	 */
	SCUS101("Failed to get driver details"),

	SCUS102("Driver already exists"),

	SCUS103("Failed to add new driver "),

	SCUS104("Failed to delete driver"),

	SCUS105("Driver not found"),

	SCUS106("Failed to update driver"),

	SCUS107("Failed to get driver details by id"),

	SCUS108("Driver can't be deleted as a load is assigned to the driver"),

	SCUS109("This email already exists"),

	SCUS110("Failed to get driver details by vendor number"),
	/**
	 * Load Appointment MODULE
	 */
	SCUS001("Failed to get loads"),

	SCUS002("Load does not exists"),

	SCUS003("Failed to update load"),

	SCUS004("Failed to delete load"),

	SCUS005("Load already exists"),

	SCUS006("Failed to add new load"),

	SCUS007("Failed to get load by id"),

	SCUS008("Failed to update load status"),

	SCUS009("Failed to get loads by driver"),

	SCUS010("Failed to get driver not completed loads"),

	SCUS011("Load is already assigned to the driver"),

	SCUS012("Failed to get loads based on locations"),

	SCUS013("Load is completed by driver"),

	SCUS014("Failed to update geo miles"),
	
	SCUS015("No loads for this dc manager"),


	/**
	 * Location MODULE
	 */
	SCUS301("Failed to add new location "),

	SCUS302("Location does not exists"),

	SCUS303("Failed to update location"),

	SCUS304("Failed to delete location"),

	SCUS305("Failed to get all locations"),

	SCUS306("Location already exists"),

	SCUS307("Failed to get weather data"),

	SCUS308("Failed to send email notification"),

	SCUS309("Location can't be deleted as location has few loads"),

	SCUS310("Email already exists"),

	SCUS311("Phone number already exists"),

	SCUS312("Location address already exists"),
	
	SCUS313("This location already assigned to a load"),
	
	/**
	 * Load AppointmentType MODULE
	 */
	SCUS401("Failed to get load types"),
	/**
	 * Vendor MODULE
	 */
	SCUS501("Failed to get all vendors"),

	SCUS502("Vendor already exists"),

	SCUS503("Failed to add new vendor "),

	SCUS504("Vendor can't be deleted as vendor has few loads"),

	SCUS505("Failed to delete vendor"),

	SCUS506("Vendor not found"),

	SCUS507("Failed to update vendor"),

	SCUS508("Failed to get vendor details by number"),

	SCUS509("This phone number is already exists"),

	SCUS510("This phone number is already registered with other vendor"),
	/**
	 * Analytics MODULE
	 */
	SCUS601("Failed to get analytics data"),

	SCUS602("Failed to get analytics data By start date and end date"),

	SCUS603("Failed to get all vendor related loads"),
	
	SCUS604("This vendor has already assigned to a load"),
	/**
	 * Reports MODULE
	 */
	SCUS701("Failed to generate report");

	private String errorMsg;

	EnumTypeForErrorCodes(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String errorMsg() {
		return errorMsg;
	}
}
