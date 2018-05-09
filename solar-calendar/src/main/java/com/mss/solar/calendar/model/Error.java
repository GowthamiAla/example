package com.mss.solar.calendar.model;

import java.io.PrintWriter;

public class Error {

	private String context;
	private String code;
	private String message;

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public void setContext(Throwable th) {
		try {
			th.printStackTrace(new PrintWriter(context));
		} catch (Exception e) {
			e.printStackTrace();
			context = th.getLocalizedMessage();
		}
	}

}
