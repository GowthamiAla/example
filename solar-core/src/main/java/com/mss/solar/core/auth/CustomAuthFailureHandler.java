package com.mss.solar.core.auth;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.mss.solar.core.common.EnumTypeForErrorCodes;
import com.mss.solar.core.domain.User;
import com.mss.solar.core.repos.UserRepository;

@Component
public class CustomAuthFailureHandler extends SimpleUrlAuthenticationFailureHandler {
	
	@Autowired
	private UserRepository userRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
    	User user = userRepository.findByEmail(request.getParameter("username"));
			if (user == null) {
				response.sendError(27, EnumTypeForErrorCodes.SCUS027.errorMsg());
			} else {
				response.sendError(29, EnumTypeForErrorCodes.SCUS029.errorMsg());
			}
    	
    }
}
