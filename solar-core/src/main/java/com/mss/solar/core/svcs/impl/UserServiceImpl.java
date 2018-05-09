package com.mss.solar.core.svcs.impl;

import java.net.InetAddress;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.mss.solar.core.common.EnumTypeForErrorCodes;
import com.mss.solar.core.common.MessageTemplateType;
import com.mss.solar.core.common.Utils;
import com.mss.solar.core.domain.MessageTemplate;
import com.mss.solar.core.domain.NotificationEvent;
import com.mss.solar.core.domain.NotificationEventSetting;
import com.mss.solar.core.domain.Otp;
import com.mss.solar.core.domain.Role;
import com.mss.solar.core.domain.ServiceEvent;
import com.mss.solar.core.domain.User;
import com.mss.solar.core.model.ServiceResponse;
import com.mss.solar.core.repos.NotificationEventRepository;
import com.mss.solar.core.repos.NotificationEventSettingRepository;
import com.mss.solar.core.repos.OtpRepository;
import com.mss.solar.core.repos.RoleRepository;
import com.mss.solar.core.repos.UserRepository;
import com.mss.solar.core.svcs.MessageTemplateService;
import com.mss.solar.core.svcs.NotificationService;
import com.mss.solar.core.svcs.ServiceEventService;
import com.mss.solar.core.svcs.UserService;

@RestController
@Validated
public class UserServiceImpl implements UserService {

	private static Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private OtpRepository otpRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private ServiceEventService serviceEventsvc;

	@Autowired
	private NotificationService notificationSvc;

	@Autowired
	private NotificationEventSettingRepository notificationEventSettingRepo;

	@Autowired
	private NotificationEventRepository notificationEventRepo;

	@Autowired
	private MessageTemplateService messgaeTemplatesvc;

	@Autowired
	private Utils utils;

	@Value("${usersvc.otpexpiry:5}")
	private Integer otpExpiry;

	@Value("${usersvc.otpMsg:otp:%s}")
	private String otpMsg;

	@Value("${usersvc.defaultUserRole:USER}")
	private String defaultRole;

	private Random otpGenerator;

	public UserServiceImpl() {
		otpGenerator = new Random();
	}

	/**
	 * registerUser service implementation
	 * 
	 * @param user
	 * @return ServiceResponse<User>
	 */
	@Override
	public ServiceResponse<User> registerUser(@Valid @RequestBody User user) {
		log.info("Registering the user");
		ServiceResponse<User> response = new ServiceResponse<>();
		try {

			User emailExists = userRepo.findByEmail(user.getEmail());
			User phoneExists = userRepo.findByPhone(user.getPhone());

			if (emailExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS001.name(), EnumTypeForErrorCodes.SCUS001.errorMsg());
			} else if (phoneExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS002.name(), EnumTypeForErrorCodes.SCUS002.errorMsg());
			} else {
				Role role = roleRepo.findByName(defaultRole);

				Set<Role> roles = new HashSet<>();
				if (role == null) {
					Role newRole = new Role();
					newRole.setName(defaultRole);
					ServiceResponse<Role> roleResponse = addRole(newRole);
					roles.add(roleResponse.getData());
					user.setRoles(roles);
				} else {
					roles.add(role);
					user.setRoles(roles);
				}
				User newUser = userRepo.save(user);
				// Generating OTP
				generateOtp(newUser);
				response.setData(newUser);
			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS003.name(), EnumTypeForErrorCodes.SCUS003.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("registering user");
		}
		return response;
	}

	/**
	 * Generate otp method implementation
	 * 
	 * @param user
	 * @return Integer
	 */
	private Integer generateOtp(User user) {
		log.info("Generating OTP for the registration");
		Otp newOtp = new Otp();
		try {
			Otp oldOtp = otpRepo.findOneByUser(user);
			if (oldOtp == null) {
				newOtp.setUser(user);
				newOtp.setExpiryTime(ZonedDateTime.now().plusMinutes(otpExpiry));
				newOtp.setCode(100000 + otpGenerator.nextInt(900000));
				newOtp = otpRepo.save(newOtp);
			} else {
				oldOtp.setExpiryTime(ZonedDateTime.now().plusMinutes(otpExpiry));
				oldOtp.setCode(100000 + otpGenerator.nextInt(900000));

				newOtp = otpRepo.save(oldOtp);
			}
			String baseUrl = getCurrentBaseUrl();
			ServiceEvent serviceEvent = null;

			Map<String, String> otpData = new HashMap<>();
			otpData.put("OTP", newOtp.getCode().toString());

			if (user.isActive() == false) {
				MessageTemplate emailTemplate = messgaeTemplatesvc.getMessageTemplateByName("Send OTP",
						MessageTemplateType.EMAIL, "OTP to change your password is <b>${OTP}</b>.");
				MessageTemplate websocketTemplate = messgaeTemplatesvc.getMessageTemplateByName("Popup-Send OTP",
						MessageTemplateType.WEBSOCKET, "OTP to change your password is ${OTP}");
				serviceEvent = serviceEventsvc.getServiceEventByCode("500", "Sending OTP to user", MODULE_NAME,
						emailTemplate, websocketTemplate);
			} else {

				MessageTemplate emailTemplate = messgaeTemplatesvc.getMessageTemplateByName("Send OTP with URL",
						MessageTemplateType.EMAIL,
						"OTP to change your password is <b>${OTP}</b>. You can update or create password at ${baseUrl}/#/otp ");
				MessageTemplate websocketTemplate = messgaeTemplatesvc.getMessageTemplateByName("Popup - Send OTP with URL",
						MessageTemplateType.WEBSOCKET, "OTP to change your password is ${OTP}");
				serviceEvent = serviceEventsvc.getServiceEventByCode("501", "Send OTP with URL",
						MODULE_NAME, emailTemplate, websocketTemplate);
				otpData.put("baseUrl", baseUrl);
			}

			// Sending OTP
			notificationSvc.sendNotificationToUser(user.getId(), serviceEvent.getId(), otpData);
		} catch (Exception e) {
			log.error("Error in generating OTP", e);
			sendErrorNotification("generating OTP");
			throw e;
		}
		return newOtp.getCode();
	}

	/**
	 * addRole service implementation
	 * 
	 * @param role
	 * @return ServiceResponse<Role>
	 */
	@Override
	public ServiceResponse<Role> addRole(@Valid @RequestBody Role role) {
		log.info("adding role");
		ServiceResponse<Role> response = new ServiceResponse<>();
		try {
			Role roleExists = roleRepo.findByName(role.getName());
			if (roleExists == null) {
				roleRepo.save(role);
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS004.name(),
						EnumTypeForErrorCodes.SCUS004.errorMsg() + role.getName());
			}
			response.setData(role);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS005.name(),
					EnumTypeForErrorCodes.SCUS005.errorMsg() + role.getName());
			log.error(response.getError().toString(), e);

			sendErrorNotification("adding new role");
		}
		return response;
	}

	/**
	 * getAllRoles service implementation
	 * 
	 * @return ServiceResponse<Collection<Role>>
	 */
	@Override
	public ServiceResponse<Collection<Role>> getAllRoles() {
		log.info("getting all roles");
		ServiceResponse<Collection<Role>> response = new ServiceResponse<>();
		try {
			Collection<Role> roles = roleRepo.findAll();
			response.setData(roles);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS006.name(), EnumTypeForErrorCodes.SCUS006.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("getting all roles");
		}
		return response;
	}

	/**
	 * getUsersByRole service implementation
	 * 
	 * @param role
	 * @return ServiceResponse<Collection<User>>
	 */
	@Override
	public ServiceResponse<Collection<User>> getUsersByRole(@Size(min = 4, max = 15) @PathVariable String role) {
		log.info("getting users by role");
		ServiceResponse<Collection<User>> response = new ServiceResponse<>();
		try {
			Role roleName = roleRepo.findByName(role);
			response.setData(roleName.getUsers());
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS007.name(), EnumTypeForErrorCodes.SCUS007.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("getting user details by role");
		}
		return response;
	}

	/**
	 * getUserByEmail service implementation
	 * 
	 * @param email
	 * @return ServiceResponse<User>
	 */
	@Override
	public ServiceResponse<User> getUserByEmail(@Email @PathVariable String email) {
		log.info("getting users by email");
		ServiceResponse<User> response = new ServiceResponse<>();
		try {
			User user = userRepo.findByEmail(email);
			if (user == null) {
				response.setError(EnumTypeForErrorCodes.SCUS008.name(), EnumTypeForErrorCodes.SCUS008.errorMsg());
			} else {

				response.setData(user);
			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS008.name(), EnumTypeForErrorCodes.SCUS008.errorMsg() + email);

			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("getting user details by email");
		}
		return response;
	}

	/**
	 * updateUser service implementation
	 * 
	 * @param user
	 * @return ServiceResponse<User>
	 */
	@Transactional
	@Override
	public ServiceResponse<User> updateUser(@Valid @RequestBody User user) {
		log.info("Update user");
		ServiceResponse<User> response = new ServiceResponse<>();
		try {
			User userExists = userRepo.findByEmail(user.getEmail());
			User phoneExists = userRepo.findByPhone(user.getPhone());
			if (userExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS009.name(), EnumTypeForErrorCodes.SCUS009.errorMsg());
			} else {

				if (user.getRoles() == null && user.getRoles().isEmpty()) {
					response.setError(EnumTypeForErrorCodes.SCUS010.name(), EnumTypeForErrorCodes.SCUS010.errorMsg());
				} else {
					Set<Role> role = user.getRoles();
					for (Role rl : role) {
						Role userRole = roleRepo.findByName(rl.getName());
						userExists.setRoles(new HashSet<Role>(Arrays.asList(userRole)));
					}

					userExists.setActive(user.isActive());
					userExists.setName(user.getName());
					if (phoneExists == null || phoneExists.getId() == user.getId()) {
						userExists.setPhone(user.getPhone());
					} else {
						response.setError(EnumTypeForErrorCodes.SCUS011.name(),
								EnumTypeForErrorCodes.SCUS011.errorMsg());
					}

					userRepo.save(userExists);
					response.setData(userExists);
				}

			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS012.name(), EnumTypeForErrorCodes.SCUS012.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("upating user details");
		}
		return response;
	}

	/**
	 * addUser service implementation
	 * 
	 * @param user
	 * @return ServiceResponse<User>
	 */
	@Transactional
	@Override
	public ServiceResponse<User> addUser(@Valid @RequestBody User user) {
		log.info("adding user");
		ServiceResponse<User> response = new ServiceResponse<>();
		try {
			User emailExists = userRepo.findByEmail(user.getEmail());
			User phoneExists = userRepo.findByPhone(user.getPhone());

			if (emailExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS013.name(), EnumTypeForErrorCodes.SCUS013.errorMsg());
			} else if (phoneExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS014.name(), EnumTypeForErrorCodes.SCUS014.errorMsg());
			} else {
				user.setActive(true);
				if (user.getRoles() == null && user.getRoles().isEmpty()) {
					response.setError(EnumTypeForErrorCodes.SCUS010.name(), EnumTypeForErrorCodes.SCUS010.errorMsg());
				} else {
					Set<Role> role = user.getRoles();
					for (Role rl : role) {
						Role userRole = roleRepo.findByName(rl.getName());
						user.setRoles(new HashSet<Role>(Arrays.asList(userRole)));
					}
					userRepo.save(user);
					generateOtp(user);

					MessageTemplate emailTemplate = messgaeTemplatesvc.getMessageTemplateByName("Add user",
							MessageTemplateType.EMAIL,
							"New user with name <b>${userName}</b> and email <b>${email}</b> is registered. ");

					MessageTemplate websocketTemplate = messgaeTemplatesvc.getMessageTemplateByName("Popup-Add user",
							MessageTemplateType.WEBSOCKET,
							"New user with name <b>${userName}</b> and email <b>${email}</b> is registered. ");

					ServiceEvent serviceEvent = serviceEventsvc.getServiceEventByCode("201", "New user registration",
							MODULE_NAME, emailTemplate, websocketTemplate);

					Map<String, String> newUserData = new HashMap<>();
					newUserData.put("userName", user.getName());
					newUserData.put("email", user.getEmail());
					notificationSvc.sendNotification(serviceEvent.getId(), newUserData);

					response.setData(user);
				}
			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS016.name(), EnumTypeForErrorCodes.SCUS016.errorMsg());
			log.error(utils.toJson(response.getError()), e);
			sendErrorNotification("adding new user");
		}
		return response;
	}

	/**
	 * deleteUser service implementation
	 * 
	 * @param userId
	 * @return ServiceResponse<String>
	 */
	@Transactional
	@Override
	public ServiceResponse<String> deleteUser(@NotNull @PathVariable Long userId) {
		log.info("deleting user");
		ServiceResponse<String> response = new ServiceResponse<>();
		try {
			User user = userRepo.findOne(userId);
			Otp otpObj = otpRepo.findOneByUser(user);
			if (otpObj != null) {
				otpRepo.delete(otpObj);
			}
			List<NotificationEventSetting> notificationEventSettings = notificationEventSettingRepo
					.findByUserId(userId);
			if (notificationEventSettings.size() != 0) {
				for (NotificationEventSetting notificationEventSetting : notificationEventSettings) {
					notificationEventSettingRepo.delete(notificationEventSetting.getId());
				}
			}
			List<NotificationEvent> notificationEvents = notificationEventRepo.findByUserId(userId);
			for (NotificationEvent notificationEvent : notificationEvents) {
				notificationEventRepo.delete(notificationEvent.getId());
			}
			userRepo.delete(user);

			MessageTemplate emailTemplate = messgaeTemplatesvc.getMessageTemplateByName("Delete user",
					MessageTemplateType.EMAIL,
					"User with name <b>${userName}</b> and email <b>${email}</b> is deleted. ");

			MessageTemplate websocketTemplate = messgaeTemplatesvc.getMessageTemplateByName("Popup - Delete user",
					MessageTemplateType.WEBSOCKET,
					"User with name <b>${userName}</b> and email <b>${email}</b> is deleted. ");

			ServiceEvent serviceEvent = serviceEventsvc.getServiceEventByCode("202", "Delete user", MODULE_NAME,
					emailTemplate, websocketTemplate);

			Map<String, String> userData = new HashMap<>();

			userData.put("userName", user.getName());
			userData.put("email", user.getEmail());

			notificationSvc.sendNotification(serviceEvent.getId(), userData);

			response.setData("User deleted successfully");
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS017.name(), EnumTypeForErrorCodes.SCUS017.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("deleting user");
		}
		return response;
	}

	/**
	 * setPassword service implementation
	 * 
	 * @param userId
	 * @param otp
	 * @param password
	 * @return ServiceResponse<User>
	 */
	@Override
	public ServiceResponse<User> setPassword(@PathVariable Long userId, @PathVariable Integer otp,
			@PathVariable String password) {
		log.info("set password for registration or adding user");
		ServiceResponse<User> response = new ServiceResponse<>();
		try {
			User user;
			Otp userOtp = otpRepo.findUserByCode(otp);
			user = userOtp.getUser();
			// on user not null
			Otp otpObj = otpRepo.findOneByUserAndCode(user, otp);
			if (otpObj != null) {
				if (ZonedDateTime.now().isBefore(otpObj.getExpiryTime())) {
					user.setPassword(bCryptPasswordEncoder.encode(password));
					if (user.isActive() == false) {
						user.setActive(true);
						userRepo.save(user);

						MessageTemplate emailTemplate = messgaeTemplatesvc.getMessageTemplateByName("Add user",
								MessageTemplateType.EMAIL,
								"New user with name <b>${userName}</b> and email <b>${email}</b> is registered. ");

						MessageTemplate websocketTemplate = messgaeTemplatesvc.getMessageTemplateByName(
								"Popup - Add user", MessageTemplateType.WEBSOCKET,
								"New user with name <b>${userName}</b> and email <b>${email}</b> is registered. ");

						ServiceEvent serviceEvent = serviceEventsvc.getServiceEventByCode("201",
								"New user registration", MODULE_NAME, emailTemplate, websocketTemplate);

						Map<String, String> newUserData = new HashMap<>();

						newUserData.put("userName", user.getName());
						newUserData.put("email", user.getEmail());

						notificationSvc.sendNotification(serviceEvent.getId(), newUserData);

					} else {
						userRepo.save(user);
					}
					response.setData(user);
				} else {
					response.setError(EnumTypeForErrorCodes.SCUS018.name(), EnumTypeForErrorCodes.SCUS018.errorMsg());
				}
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS019.name(), EnumTypeForErrorCodes.SCUS019.errorMsg());
			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS020.name(), EnumTypeForErrorCodes.SCUS020.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("setting password");
		}
		return response;
	}

	/**
	 * getUserByPhone service implementation
	 * 
	 * @param phone
	 * @return ServiceResponse<User>
	 */
	@Override
	public ServiceResponse<User> getUserByPhone(@NotNull @PathVariable String phone) {
		log.info("getting users by phone");
		ServiceResponse<User> response = new ServiceResponse<>();
		try {
			User user = userRepo.findByPhone(phone);
			response.setData(user);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS021.name(), EnumTypeForErrorCodes.SCUS021.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("getting user details by phone");
		}
		return response;
	}

	/**
	 * getAllUsers service implementation
	 * 
	 * @return ServiceResponse<Collection<User>>
	 */
	@Override
	public ServiceResponse<Collection<User>> getAllUsers() {
		log.info("getting all users");
		ServiceResponse<Collection<User>> response = new ServiceResponse<>();
		try {
			Boolean setActive = true;
			Collection<User> users = userRepo.findByActive(setActive);
			response.setData(users);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS022.name(), EnumTypeForErrorCodes.SCUS022.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("getting all users");
		}
		return response;
	}

	/**
	 * forgotPassword service implementation
	 * 
	 * @param email
	 * @return ServiceResponse<User>
	 */
	@Override
	public ServiceResponse<User> forgotPassword(@Email @PathVariable String email, @PathVariable String phone) {
		log.info("forgot password");
		ServiceResponse<User> response = new ServiceResponse<>();
		try {
			User userExists = userRepo.findByEmail(email);
			User phoneExists = userRepo.findByPhone(phone);

			if (userExists.getId() == phoneExists.getId()) {
				// Generating OTP
				generateOtp(userExists);
				response.setData(userExists);
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS023.name(), EnumTypeForErrorCodes.SCUS023.errorMsg());
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS024.name(), EnumTypeForErrorCodes.SCUS024.errorMsg());
			log.error(utils.toJson(response.getError()), e);

			sendErrorNotification("resetting Password");
		}
		return response;
	}

	public void sendErrorNotification(String errorMessage) {

		MessageTemplate emailTemplate = messgaeTemplatesvc.getMessageTemplateByName("Send error",
				MessageTemplateType.EMAIL, "Error occured at ${error}");

		MessageTemplate websocketTemplate = messgaeTemplatesvc.getMessageTemplateByName("Popup - Send error",
				MessageTemplateType.WEBSOCKET, "Error occured at ${error}");

		ServiceEvent serviceEvent = serviceEventsvc.getServiceEventByCode("901", "Error", MODULE_NAME, emailTemplate,
				websocketTemplate);

		Map<String, String> dataMap = new HashMap<>();
		dataMap.put("error", errorMessage);

		notificationSvc.sendNotification(serviceEvent.getId(), dataMap);

	}

	public String getCurrentBaseUrl() {
		String baseUrl = "";
		try {
			RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
			HttpServletRequest servletRequest = ((ServletRequestAttributes) requestAttributes).getRequest();
			String scheme = servletRequest.getScheme() + "://";

			InetAddress addr = InetAddress.getLocalHost();
			String ipAddress = addr.getHostAddress();

			String serverPort = (servletRequest.getServerPort() == 80) ? "" : ":" + servletRequest.getServerPort();

			baseUrl = scheme + ipAddress + serverPort;

		} catch (Exception e) {

			log.error("Error in getting base url", e);

		}
		return baseUrl;
	}

	private Collection<String> getEventSettingsRoles(Long serviceEventId) {
		Collection<String> roles = new ArrayList<>();

		NotificationEventSetting notificationEventSetting = notificationEventSettingRepo
				.getDefaultNotificationSettingsForEvent(serviceEventId);
		Set<Role> eventSettingRoles = notificationEventSetting.getRole();

		for (Role eventSettingRole : eventSettingRoles) {
			roles.add(eventSettingRole.getName());
		}

		return roles;
	}
}
