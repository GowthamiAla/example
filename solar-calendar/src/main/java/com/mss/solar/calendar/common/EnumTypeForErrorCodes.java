package com.mss.solar.calendar.common;

public enum EnumTypeForErrorCodes {

	/**
	 * CALENDAR MODULE
	 */

	SCUS601("Failed to create event"),

	SCUS602("Failed to update event"),

	SCUS603("Failed to update event"),

	SCUS604("Failed to getting current events"),

	SCUS605("Failed to update event "),

	SCUS606("Failed to update status "),

	SCUS607("Failed to get events "),

	SCUS608("Failed to get events by date range "),

	SCUS609("Failed to get event by title "),

	SCUS610("Failed to get event by title "),

	SCUS611("Failed to getting active events "),

	SCUS612("Failed to getting current events"),
	
	SCUS613("Failed to getting events by filter");

	private String errorMsg;

	EnumTypeForErrorCodes(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String errorMsg() {
		return errorMsg;
	}

}
