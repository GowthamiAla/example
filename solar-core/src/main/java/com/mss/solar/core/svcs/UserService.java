package com.mss.solar.core.svcs;

import java.util.Collection;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.core.common.RestApiUrlConstants;
import com.mss.solar.core.domain.Role;
import com.mss.solar.core.domain.User;
import com.mss.solar.core.model.ServiceResponse;


@RequestMapping(value = "/api/users")
public interface UserService {
	
	final String MODULE_NAME="UserService";
		
	@GetMapping(RestApiUrlConstants.GET_ALL_USERS)
	@ResponseBody
	ServiceResponse<Collection<User>> getAllUsers();

	@GetMapping(RestApiUrlConstants.GET_ALL_ROLES)
	@ResponseBody
	ServiceResponse<Collection<Role>> getAllRoles();

	@GetMapping(RestApiUrlConstants.GET_USERS_BY_ROLE)
	@ResponseBody
	ServiceResponse<Collection<User>> getUsersByRole(@Size(min = 4, max = 15) @PathVariable String role);

	@GetMapping(RestApiUrlConstants.GET_USER_BY_EMAIL)
	@ResponseBody
	ServiceResponse<User> getUserByEmail(@Email @PathVariable String email);

	@PutMapping(RestApiUrlConstants.UPDATE_USER)
	@ResponseBody
	ServiceResponse<User> updateUser(@Valid @RequestBody User user);

	@PostMapping(RestApiUrlConstants.ADD_USER)
	@ResponseBody
	ServiceResponse<User> addUser(@Valid @RequestBody User user);

	@GetMapping(RestApiUrlConstants.DELETE_USER)
	@ResponseBody
	ServiceResponse<String> deleteUser(@NotNull @PathVariable Long userId);

	@GetMapping(RestApiUrlConstants.GET_USER_BY_PHONE)
	@ResponseBody
	ServiceResponse<User> getUserByPhone(@NotNull @PathVariable String phone);

	@PostMapping(RestApiUrlConstants.REGISTER_USER)
	@ResponseBody
	ServiceResponse<User> registerUser(@Valid @RequestBody User user);

	@PostMapping(RestApiUrlConstants.SET_PW)
	@ResponseBody
	ServiceResponse<User> setPassword(@PathVariable Long userId, @PathVariable Integer otp,
			@PathVariable String password);

	@PostMapping(RestApiUrlConstants.ADD_ROLE)
	@ResponseBody
	ServiceResponse<Role> addRole(@Valid @RequestBody Role role);

	@PostMapping(RestApiUrlConstants.FORGOT_PW)
	@ResponseBody
	ServiceResponse<User> forgotPassword(@Email @PathVariable String email, @PathVariable String phone);


}
