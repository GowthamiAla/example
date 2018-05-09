package com.mss.solar.core.common;

public enum EnumTypeForErrorCodes {

	/**
	 * USERS MODULE
	 */
	SCUS001("User already exists"),

	SCUS002("Phone number already exists"),

	SCUS003("Failed to register new user"),

	SCUS004("Role value is null "),

	SCUS005("Failed to add a role"),

	SCUS006("Failed to get all roles"),

	SCUS007("Failed to get user details by role"),

	SCUS008("Failed to get user details by email"),

	SCUS009("Failed to update  user"),

	SCUS010("Role not found"),

	SCUS011("Phone number alredy exists"),

	SCUS012("Failed to update user"),

	SCUS013("User already exits"),

	SCUS014("Phone number already exists"),

	SCUS016("Failed to add new user"),

	SCUS017("Error in user delete"),

	SCUS018("OTP is expired"),

	SCUS019("Please enter valid OTP"),

	SCUS020("Error in setting password"),

	SCUS021("Failed to get user details by phone"),

	SCUS022("Failed to get all users"),

	SCUS023("Email and phone number are does not match"),

	SCUS024("Please enter valid email and phone number"),

	SCUS027("User is not registered"),

	SCUS028("Failed to login"),

	SCUS029("Please enter valid login credentials"),

	/**
	 * MESSAGE TEMPLATE MODULE
	 */
	SCUS101("Failed to get message template by id"),

	SCUS102("Failed to update template "),

	SCUS103("Failed to update template "),

	SCUS104("Failed to delete template"),

	SCUS105("Template name already exists "),

	SCUS106("Failed to add new template "),

	SCUS107("Failed to get all templates"),

	SCUS108("Template name already exists"),

	/**
	 * EMAIL SERVICE MODULE
	 */
	SCUS201("Failed to send email"),

	/**
	 * SERVICE EVENT MODULE
	 */
	SCUS301("Failed to get service event by id "),

	SCUS302("Failed to update service event "),

	SCUS303("Failed to update service event"),

	SCUS304("Failed to delete service event"),

	SCUS305("Service event already exists "),

	SCUS306("Failed to add new service event "),

	SCUS307("Failed to get all service events"),

	SCUS308("Event code already exists"),

	SCUS309("Event already exists"),

	/**
	 * NOTIFICATIONS MODULE
	 */
	SCUS401("Failed to send notification "),

	SCUS402("Error occured while sending notifications to admins"),

	SCUS403("There are no notification events for user"),

	SCUS404("Failed to get notification events by user ID"),

	SCUS405("User does not exists"),

	SCUS406("Failed to send notification "),

	SCUS407("Failed to get notification event settings by userId"),

	SCUS408("Failed to get notification event settings by userId"),

	SCUS409("Failed to add notification event setting"),

	SCUS410("Failed to count unread notifications for user"),

	SCUS411("Failed to update notifications read status"),

	SCUS412("Failed to get notification event setting"),

	SCUS415("Failed to update notification event setting"),

	SCUS416("Notification event does not exists"),

	SCUS417("Service event does not exists"),

	SCUS418("Eveny code and event already exists"),

	SCUS419("Failed to get default notification event settings"),
	
	SCUS420("Failed to send email notification"),
	
	SCUS421("Failed to get notification event settings by role"),
	
	SCUS422("Failed to send notification"),
	
	SCUS423("Failed to changing read status"),
	

	/**
	 * WIDGET MODULE
	 */
	SCUS501("Failed to find the widget"),

	SCUS502("Widget not found"),

	SCUS503("Widget name already exists"),

	SCUS504("Failed to update widget"),

	SCUS505("Failed to delete widget"),

	SCUS506("Widget already exits"),

	SCUS507("Role not found"),

	SCUS508("Failed to add new widget"),

	SCUS509("Failed to get all widget");

	private String errorMsg;

	EnumTypeForErrorCodes(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String errorMsg() {
		return errorMsg;
	}
}
