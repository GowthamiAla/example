package com.mss.solar.core.svcs;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.core.model.ServiceResponse;

@RequestMapping(value = "emailsvc")
public interface EmailService {
	
	@GetMapping("notifyUser/{userId}/{payload}")
	@ResponseBody
	ServiceResponse<String> notifyUser(@PathVariable("userId") Long userId, @PathVariable("payload") String payload);
	
	@GetMapping("notifyEmail/{email}/{payload}")
	@ResponseBody
	ServiceResponse<String> notifyUserByEmail(@PathVariable("email") String email, @PathVariable("payload") String payload);
	
	@GetMapping("notifyImage/{email}/{payload}")
	@ResponseBody
	ServiceResponse<String> notifyUserByImage(@PathVariable("email") String email, @PathVariable("payload") String payload);
	
}
