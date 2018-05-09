package com.mss.solar.core.auth;

import static com.mss.solar.core.auth.SecurityConstants.EXPIRATION_TIME;
import static com.mss.solar.core.auth.SecurityConstants.HEADER_STRING;
import static com.mss.solar.core.auth.SecurityConstants.SECRET;
import static com.mss.solar.core.auth.SecurityConstants.TOKEN_PREFIX;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.mss.solar.core.repos.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private AuthenticationManager authenticationManager;

	private UserRepository applicationUserRepository;

	public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {

		this.authenticationManager = authenticationManager;

	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
			throws AuthenticationException {

		try {
			ServletInputStream str = req.getInputStream();

			String username = req.getParameter("username");
			String password = req.getParameter("password");

			return authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>()));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

	}

	@Override
	protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain,
			Authentication auth) throws IOException, ServletException {

		Date expiration = new Date(System.currentTimeMillis() + EXPIRATION_TIME);
		String token = Jwts.builder().setSubject(((User) auth.getPrincipal()).getUsername())
				.setExpiration(expiration)
				.signWith(SignatureAlgorithm.HS512, SECRET).compact();
		res.addHeader("access-control-expose-headers", "Authorization");
		res.addHeader(HEADER_STRING, TOKEN_PREFIX + token);

	}

	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException failed) throws IOException, ServletException {

		SecurityContext context = SecurityContextHolder.createEmptyContext();
		SecurityContextHolder.clearContext();
		// failureHandler.onAuthenticationFailure(request, response, failed);
	}

}
