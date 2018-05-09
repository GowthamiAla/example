package com.mss.solar.calendar.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class ServiceResponse<T> {

	private T data;

	private Error error;

	private int code;

	
	
	public int getCode() {
		return code;
	}

	public ServiceResponse() {
		code = 0;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public Error getError() {
		return error;
	}

	public void setError(Error error) {
		code = -1;
		this.error = error;
	}
	
	public void setError(String code, String message) {
		Error error = new Error();
		error.setCode(code);
		error.setMessage(message);
		setError(error);
	}
	
	
}
