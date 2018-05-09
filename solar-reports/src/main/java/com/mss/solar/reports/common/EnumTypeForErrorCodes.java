package com.mss.solar.reports.common;

public enum EnumTypeForErrorCodes {

	/**
	 * REPORT MODULE
	 */
	SCUS601("Document already generated"),

	SCUS602("Error in generating report"),

	SCUS603("Report template not Found"),

	SCUS604("Report template already generated"),

	SCUS605("File type must be XML"),

	SCUS606("Failed to add report template"),

	SCUS607("Failed to get report template"),

	SCUS608("Report template not found"),

	SCUS609("Failed to delete report template");

	private String errorMsg;

	EnumTypeForErrorCodes(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String errorMsg() {
		return errorMsg;
	}
}
