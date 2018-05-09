package com.mss.solar.maps.common;

public enum EnumTypeForErrorCodes {
	
	/**
	 * Weather MODULE
	 */
	SCUS901("Failed to get weather info");

	private String errorMsg;

	EnumTypeForErrorCodes(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String errorMsg() {
		return errorMsg;
	}
}
