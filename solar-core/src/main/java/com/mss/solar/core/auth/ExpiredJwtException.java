package com.mss.solar.core.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.JwtException;

@SuppressWarnings("serial")
public class ExpiredJwtException extends JwtException {

	public ExpiredJwtException(Header header, Claims claims, String message) {
		super(message);
	}

	public ExpiredJwtException(Header header, Claims claims, String message, Throwable cause) {
		super(message);
	}
}