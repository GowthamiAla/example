package com.mss.solar.core.svcs.impl;

import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mss.solar.core.common.EnumTypeForErrorCodes;
import com.mss.solar.core.common.MessageTemplateType;
import com.mss.solar.core.common.Utils;
import com.mss.solar.core.domain.MessageTemplate;
import com.mss.solar.core.domain.NotificationEvent;
import com.mss.solar.core.domain.NotificationEventSetting;
import com.mss.solar.core.domain.Role;
import com.mss.solar.core.domain.ServiceEvent;
import com.mss.solar.core.domain.User;
import com.mss.solar.core.model.ServiceResponse;
import com.mss.solar.core.repos.MessageTemplateRepository;
import com.mss.solar.core.repos.NotificationEventRepository;
import com.mss.solar.core.repos.NotificationEventSettingRepository;
import com.mss.solar.core.repos.RoleRepository;
import com.mss.solar.core.repos.ServiceEventRepository;
import com.mss.solar.core.repos.UserRepository;
import com.mss.solar.core.svcs.EmailService;
import com.mss.solar.core.svcs.NotificationService;
import com.mss.solar.core.svcs.ServiceEventService;
import com.mss.solar.core.svcs.WebSocketService;

@Service
@RestController
public class NotificationServiceImpl implements NotificationService {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private NotificationEventSettingRepository notificationEventSettingRepo;

	@Autowired
	private NotificationEventRepository notificationEventRepo;

	@Autowired
	private ServiceEventRepository serviceEventRepo;

	@Autowired
	private MessageTemplateRepository messageTemplateRepo;

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private EmailService emailsvc;

	@Autowired
	private WebSocketService websocketsvc;

	@Autowired
	private Utils utils;

	@Value("${notificationsvc.AdminRole:ADMIN}")
	private String adminRole;

	@Autowired
	private ServiceEventService serviceEventService;

	/**
	 * sendNotificationToAllUsers service implementation
	 * 
	 * @param notificationContext
	 * @return ServiceResponse<NotificationEvent>
	 */
	@Override
	public ServiceResponse<NotificationEvent> sendNotificationToUsersWithRoles(
			@PathVariable("roles") Collection<String> roles, @PathVariable("serviceEvntId") Long serviceEvntId,
			@RequestBody Map<String, String> dataMap) {

		log.info("notify users");

		ServiceResponse<NotificationEvent> response = new ServiceResponse<>();
		try {
			List<User> users = userRepo.findAllByRolesNameIn(roles);

			// get notification event settings based on service event
			List<NotificationEventSetting> notificationEventSettings = notificationEventSettingRepo
					.findByServiceEventId(serviceEvntId);

			Map<Long, Boolean> emailMap = new HashMap<>();
			Map<Long, Boolean> websocketMap = new HashMap<>();

			NotificationEventSetting defaultSetting = new NotificationEventSetting();
			String userEmailMessage = null;
			String userWebsocketMessage = null;
			ServiceEvent serviceEvent = null;
			MessageTemplate mailMessageType = null;
			MessageTemplate websocketMessageType = null;

			// store the users to whom notificationeventsettings are false based
			// on
			// email, sms, notification center
			for (NotificationEventSetting notificationEventSetting : notificationEventSettings) {
				if (notificationEventSetting.getUser() != null) {
					emailMap.put(notificationEventSetting.getUser().getId(), notificationEventSetting.getEmail());
					websocketMap.put(notificationEventSetting.getUser().getId(),
							notificationEventSetting.getNotificationCenter());
					userEmailMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(notificationEventSetting.getEmailTemplate().getId()));
					userWebsocketMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(notificationEventSetting.getNotificationTemplate().getId()));
					mailMessageType = messageTemplateRepo.findById(notificationEventSetting.getEmailTemplate().getId());
					websocketMessageType = messageTemplateRepo
							.findById(notificationEventSetting.getNotificationTemplate().getId());
					serviceEvent = notificationEventSetting.getServiceevent();

				} else {
					// this is default setting for all users who didn't
					// customize their notification settings
					defaultSetting = notificationEventSetting;
					userEmailMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(defaultSetting.getEmailTemplate().getId()));
					userWebsocketMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(defaultSetting.getNotificationTemplate().getId()));
					mailMessageType = messageTemplateRepo.findById(defaultSetting.getEmailTemplate().getId());
					websocketMessageType = messageTemplateRepo
							.findById(defaultSetting.getNotificationTemplate().getId());
					serviceEvent = defaultSetting.getServiceevent();
				}
			}

			// Save the notifications
			for (User user : users) {
				if (emailMap.containsKey(user.getId())) {
					if (emailMap.get(user.getId())) {
						saveNotificationEventForUser(user, serviceEvent, userEmailMessage, mailMessageType.getType());
						emailsvc.notifyUser(user.getId(), userEmailMessage);
					}
				} else {
					if (defaultSetting.getEmail()) {
						saveNotificationEventForUser(user, serviceEvent, userEmailMessage, mailMessageType.getType());
						emailsvc.notifyUser(user.getId(), userEmailMessage);
					}
				}

				if (websocketMap.containsKey(user.getId())) {
					if (websocketMap.get(user.getId())) {
						saveNotificationEventForUser(user, serviceEvent, userWebsocketMessage,
								websocketMessageType.getType());
						websocketsvc.sendChannelNotifications(user.getId().toString(), serviceEvent.getCode(),
								userWebsocketMessage);
						List<NotificationEvent> notificationCount = notificationEventRepo
								.getAllNotificationsForUser(user.getId(), MessageTemplateType.WEBSOCKET);
						websocketsvc.websocketNotificationCount(user.getId().toString(), notificationCount.size());
					}
				} else {
					if (defaultSetting.getNotificationCenter()) {
						saveNotificationEventForUser(user, serviceEvent, userWebsocketMessage,
								websocketMessageType.getType());
						websocketsvc.sendChannelNotifications(user.getId().toString(), serviceEvent.getCode(),
								userWebsocketMessage);
						List<NotificationEvent> notificationCount = notificationEventRepo
								.getAllNotificationsForUser(user.getId(), MessageTemplateType.WEBSOCKET);
						websocketsvc.websocketNotificationCount(user.getId().toString(), notificationCount.size());
					}
				}
			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS401.name(), EnumTypeForErrorCodes.SCUS401.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	public String getUserEmailMessage(Map<String, String> dataMap, MessageTemplate messageTemplate) {

		String message = messageTemplate.getContent();
		String regexString = Pattern.quote("${") + "(.*?)" + Pattern.quote("}");

		Matcher matcher = Pattern.compile(regexString).matcher(message);
		StringBuffer sb = new StringBuffer();
		while (matcher.find()) {
			matcher.appendReplacement(sb, dataMap.get(matcher.group(1)));
		}
		matcher.appendTail(sb);
		String usermessage = sb.toString();

		if (message.contains("$T{")) {
			String regexStringDate = Pattern.quote("$T{") + "(.*?)" + Pattern.quote("}");
			Matcher matcherDate = Pattern.compile(regexStringDate).matcher(usermessage);
			while (matcherDate.find()) {
				String result = matcherDate.group().substring(matcherDate.group().indexOf("$T{") + 3,
						matcherDate.group().indexOf('}'));

				SimpleDateFormat formatter = new SimpleDateFormat(result);
				Date today = new Date();
				String output = formatter.format(today);

				usermessage = matcherDate.replaceAll(output);

			}
		}
		return usermessage;
	}

	private void saveNotificationEventForUser(User user, ServiceEvent serviceEvent, String userEmailMessage,
			MessageTemplateType type) {

		NotificationEvent newNotificationEvent = new NotificationEvent();
		newNotificationEvent.setUser(user);
		newNotificationEvent.setServiceevent(serviceEvent);
		newNotificationEvent.setNotificationContext(userEmailMessage);
		newNotificationEvent.setLastUpdateTime(ZonedDateTime.now());
		newNotificationEvent.setReadStatus(1);
		newNotificationEvent.setType(type);
		notificationEventRepo.save(newNotificationEvent);
	}

	/**
	 * sendNotificationToAllAdmins service implementation
	 * 
	 * @param serviceEvntId
	 * @return ServiceResponse<NotificationEvent>
	 */
	@Override
	public void sendNotificationToAllAdmins(@PathVariable("serviceEvntId") Long serviceEvntId,
			@RequestBody Map<String, String> dataMap) {

		log.info("notify admins");
		ServiceResponse<NotificationEvent> response = new ServiceResponse<>();

		try {
			Set<String> roles = Collections.singleton(adminRole);
			response = sendNotificationToUsersWithRoles(roles, serviceEvntId, dataMap);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS402.name(), EnumTypeForErrorCodes.SCUS402.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

	}

	/**
	 * getNotificationsForUser service implementation
	 * 
	 * @param userId
	 * @param ServiceResponse<List<NotificationEvent>>
	 */
	@Override
	public ServiceResponse<List<NotificationEvent>> getNotificationsForUser(@PathVariable("userId") Long userId) {

		ServiceResponse<List<NotificationEvent>> response = new ServiceResponse<>();

		User user = userRepo.findById(userId);
		if (user != null) {
			try {
				List<NotificationEvent> notificationEvents = notificationEventRepo.findByUserIdAndType(userId,
						MessageTemplateType.WEBSOCKET);
				if (notificationEvents.size() != 0) {
					response.setData(notificationEvents);
				} else {

					response.setError(EnumTypeForErrorCodes.SCUS403.name(), EnumTypeForErrorCodes.SCUS403.errorMsg());
				}
			} catch (Exception e) {

				response.setError(EnumTypeForErrorCodes.SCUS404.name(), EnumTypeForErrorCodes.SCUS404.errorMsg());
				log.error(utils.toJson(response.getError()), e);
			}
		} else {
			response.setError(EnumTypeForErrorCodes.SCUS405.name(), EnumTypeForErrorCodes.SCUS405.errorMsg());
		}
		return response;
	}

	/**
	 * sendNotificationToUser service implementation
	 * 
	 * @param serviceEvntId,userId
	 * @return ServiceResponse<String>
	 */

	@Override
	public ServiceResponse<String> sendNotificationToUser(@PathVariable("userId") Long userId,
			@PathVariable("serviceEvntId") Long serviceEvntId, @RequestBody Map<String, String> dataMap) {
		log.info("notify users");

		ServiceResponse<String> response = new ServiceResponse<>();
		try {
			// get user details
			User user = userRepo.findById(userId);

			List<NotificationEventSetting> notificationEventSettings = notificationEventSettingRepo
					.findByServiceEventId(serviceEvntId);
			Map<Long, Boolean> emailMap = new HashMap<>();
			Map<Long, Boolean> websocketMap = new HashMap<>();

			NotificationEventSetting defaultSetting = new NotificationEventSetting();
			String userEmailMessage = null;
			String userWebsocketMessage = null;
			ServiceEvent serviceEvent = null;
			MessageTemplate mailMessageType = null;
			MessageTemplate websocketMessageType = null;

			for (NotificationEventSetting notificationEventSetting : notificationEventSettings) {
				if (notificationEventSetting.getUser() != null) {
					emailMap.put(notificationEventSetting.getUser().getId(), notificationEventSetting.getEmail());
					websocketMap.put(notificationEventSetting.getUser().getId(),
							notificationEventSetting.getNotificationCenter());
					userEmailMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(notificationEventSetting.getEmailTemplate().getId()));
					userWebsocketMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(notificationEventSetting.getNotificationTemplate().getId()));
					mailMessageType = messageTemplateRepo.findById(notificationEventSetting.getEmailTemplate().getId());
					websocketMessageType = messageTemplateRepo
							.findById(notificationEventSetting.getNotificationTemplate().getId());
					serviceEvent = notificationEventSetting.getServiceevent();

				} else {
					// this is default setting for all users who didn't
					// customize their notification settings
					defaultSetting = notificationEventSetting;
					userEmailMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(defaultSetting.getEmailTemplate().getId()));
					userWebsocketMessage = getUserEmailMessage(dataMap,
							messageTemplateRepo.findById(defaultSetting.getNotificationTemplate().getId()));
					mailMessageType = messageTemplateRepo.findById(defaultSetting.getEmailTemplate().getId());
					websocketMessageType = messageTemplateRepo
							.findById(defaultSetting.getNotificationTemplate().getId());
					serviceEvent = defaultSetting.getServiceevent();
				}
			}

			// Save the notifications

			if (emailMap.containsKey(user.getId())) {
				if (emailMap.get(user.getId())) {
					saveNotificationEventForUser(user, serviceEvent, userEmailMessage, mailMessageType.getType());
					emailsvc.notifyUserByEmail(user.getEmail(), userEmailMessage);
				}
			} else {
				if (defaultSetting.getEmail()) {
					saveNotificationEventForUser(user, serviceEvent, userEmailMessage, mailMessageType.getType());
					emailsvc.notifyUserByEmail(user.getEmail(), userEmailMessage);
				}
			}

			if (websocketMap.containsKey(user.getId())) {
				if (websocketMap.get(user.getId())) {
					saveNotificationEventForUser(user, serviceEvent, userWebsocketMessage,
							websocketMessageType.getType());
					websocketsvc.sendChannelNotifications(user.getId().toString(), serviceEvent.getCode(),
							userWebsocketMessage);
					List<NotificationEvent> notificationCount = notificationEventRepo
							.getAllNotificationsForUser(user.getId(), MessageTemplateType.WEBSOCKET);
					websocketsvc.websocketNotificationCount(user.getId().toString(), notificationCount.size());
				}
			} else {
				if (defaultSetting.getNotificationCenter()) {
					saveNotificationEventForUser(user, serviceEvent, userWebsocketMessage,
							websocketMessageType.getType());
					websocketsvc.sendChannelNotifications(user.getId().toString(), serviceEvent.getCode(),
							userWebsocketMessage);
					List<NotificationEvent> notificationCount = notificationEventRepo
							.getAllNotificationsForUser(user.getId(), MessageTemplateType.WEBSOCKET);
					websocketsvc.websocketNotificationCount(user.getId().toString(), notificationCount.size());
				}
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS406.name(), EnumTypeForErrorCodes.SCUS406.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * getNotificationEventSettings service implementation
	 * 
	 * @param userId
	 * @return ServiceResponse<List<NotificationEventSetting>>
	 */
	@Override
	public ServiceResponse<List<NotificationEventSetting>> getNotificationEventSettings(
			@PathVariable("userId") Long userId) {
		log.info("getting notification event settings by userId");

		ServiceResponse<List<NotificationEventSetting>> response = new ServiceResponse<>();
		try {

			// get notification event settings on user basis
			List<NotificationEventSetting> notificationEventSettings = notificationEventSettingRepo
					.getAllSettings(userId);

			Map<ServiceEvent, NotificationEventSetting> map = new HashMap<>();

			for (NotificationEventSetting notificationEventSetting : notificationEventSettings) {
				if (notificationEventSetting.getUser() != null) {
					map.put(notificationEventSetting.getServiceevent(), notificationEventSetting);
				} else {
					if (!map.containsKey(notificationEventSetting.getServiceevent())) {
						map.put(notificationEventSetting.getServiceevent(), notificationEventSetting);
					}
				}
			}
			response.setData(new ArrayList<NotificationEventSetting>(map.values()));
		} catch (Exception e) {

			response.setError(EnumTypeForErrorCodes.SCUS407.name(), EnumTypeForErrorCodes.SCUS407.errorMsg());
			log.error(utils.toJson(response.getError()), e);

		}

		return response;
	}

	/**
	 * getDefaultNotificationEventSettings service implementation
	 * 
	 * @return ServiceResponse<List<NotificationEventSetting>>
	 */
	@Override
	public ServiceResponse<List<NotificationEventSetting>> getDefaultNotificationEventSettings() {
		log.info("getting defualt notification event settings");

		ServiceResponse<List<NotificationEventSetting>> response = new ServiceResponse<>();
		try {

			// get notification event settings on user basis
			List<NotificationEventSetting> notificationEventSettings = notificationEventSettingRepo.findAllByUser(null);

			response.setData(notificationEventSettings);
		} catch (Exception e) {

			response.setError(EnumTypeForErrorCodes.SCUS419.name(), EnumTypeForErrorCodes.SCUS419.errorMsg());
			log.error(utils.toJson(response.getError()), e);

		}

		return response;
	}

	/**
	 * deleteNotificationEventSetting service implementation
	 * 
	 * @param eventSettingId
	 * @return ServiceResponse<List<NotificationEventSetting>>
	 */
	@Override
	public ServiceResponse<String> deleteNotificationEventSetting(@PathVariable("eventSettingId") Long eventSettingId) {
		log.info("getting notification event settings by userId");

		ServiceResponse<String> response = new ServiceResponse<>();
		try {

			NotificationEventSetting notificationEventSetting = notificationEventSettingRepo.findOne(eventSettingId);

			List<NotificationEventSetting> notificationEventSettings = notificationEventSettingRepo
					.findByServiceEventId(notificationEventSetting.getServiceevent().getId());

			for (NotificationEventSetting notificationEventSetting2 : notificationEventSettings) {
				notificationEventSettingRepo.delete(notificationEventSetting2.getId());
			}

			List<NotificationEvent> notificationEvents = notificationEventRepo
					.findByServiceevent(notificationEventSetting.getServiceevent());

			for (NotificationEvent notificationEvent : notificationEvents) {
				notificationEventRepo.delete(notificationEvent.getId());
			}

			serviceEventRepo.delete(notificationEventSetting.getServiceevent().getId());
			response.setData("Notification event setting is deleted");

		} catch (Exception e) {

			response.setError(EnumTypeForErrorCodes.SCUS408.name(), EnumTypeForErrorCodes.SCUS408.errorMsg());
			log.error(utils.toJson(response.getError()), e);

		}

		return response;
	}

	/**
	 * addNotificationEventSetting service implementation
	 * 
	 * @param notificationEventSetting
	 * @return ServiceResponse<NotificationEventSetting>
	 */
	@Override
	public ServiceResponse<NotificationEventSetting> addNotificationEventSetting(
			@RequestBody NotificationEventSetting notificationEventSetting) {
		log.info("add notification event setting");

		ServiceResponse<NotificationEventSetting> response = new ServiceResponse<>();
		NotificationEventSetting newNotificationEventSetting;
		try {

			// check for service event
			ServiceEvent serviceEvent = serviceEventRepo.findByCodeAndEvent(
					(notificationEventSetting.getServiceevent()).getCode(),
					(notificationEventSetting.getServiceevent()).getEvent());

			// add service event if not exist
			if (serviceEvent == null) {
				// save new service event in serviceevent table

				ServiceResponse<ServiceEvent> newServiceEvent = serviceEventService
						.add(notificationEventSetting.getServiceevent());

				if (newServiceEvent.getError() == null) {
					// set new service event to the notificationeventsetting
					// object
					notificationEventSetting.setServiceevent(newServiceEvent.getData());
					// add notification event setting
					newNotificationEventSetting = notificationEventSettingRepo.save(notificationEventSetting);
					response.setData(newNotificationEventSetting);
				} else {
					response.setError(newServiceEvent.getError());
				}
			} else {

				NotificationEventSetting notificationEventSettingExists = notificationEventSettingRepo
						.findByServiceEventAndUser(serviceEvent, notificationEventSetting.getUser());

				ServiceEvent serviceEventExists = serviceEventRepo
						.findById((notificationEventSetting.getServiceevent()).getId());
				NotificationEventSetting newNotificationEventSetting1 = null;
				if (notificationEventSettingExists == null) {
					notificationEventSetting.setServiceevent(serviceEventExists);
					newNotificationEventSetting1 = notificationEventSettingRepo.save(notificationEventSetting);
					response.setData(newNotificationEventSetting1);
				} else {
					notificationEventSettingExists.setEmail(notificationEventSetting.getEmail());
					notificationEventSettingExists.setSms(notificationEventSetting.getSms());
					notificationEventSettingExists
							.setNotificationCenter(notificationEventSetting.getNotificationCenter());
					notificationEventSettingExists.setEmailTemplate(notificationEventSetting.getEmailTemplate());
					notificationEventSettingExists
							.setNotificationTemplate(notificationEventSetting.getNotificationTemplate());
					notificationEventSettingExists.setPhoneTemplate(notificationEventSetting.getPhoneTemplate());
					notificationEventSettingExists.setRole(notificationEventSetting.getRole());
					ServiceResponse<ServiceEvent> newServiceEvent = serviceEventService
							.add(notificationEventSetting.getServiceevent());
					if (newServiceEvent.getError() == null) {
						notificationEventSettingExists.setServiceevent(newServiceEvent.getData());
						newNotificationEventSetting = notificationEventSettingRepo.save(notificationEventSettingExists);
						response.setData(newNotificationEventSetting);
					} else {
						response.setError(newServiceEvent.getError());
					}

				}

			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS409.name(), EnumTypeForErrorCodes.SCUS409.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * updateNotificationEventSetting service implementation
	 * 
	 * @param notificationEventSetting
	 * @return ServiceResponse<NotificationEventSetting>
	 */
	@Override
	public ServiceResponse<NotificationEventSetting> updateNotificationEventSetting(
			@Valid @RequestBody NotificationEventSetting notificationEventSetting) {

		ServiceResponse<NotificationEventSetting> response = new ServiceResponse<>();
		try {

			NotificationEventSetting notificationEventSettingExists = notificationEventSettingRepo
					.findByServiceEventAndUser(notificationEventSetting.getServiceevent(),
							notificationEventSetting.getUser());

			ServiceEvent serviceEventExists = serviceEventRepo
					.findById((notificationEventSetting.getServiceevent()).getId());

			if (notificationEventSettingExists == null) {

				if (serviceEventExists != null) {
					ServiceResponse<ServiceEvent> newServiceEvent = serviceEventService
							.save(notificationEventSetting.getId(), notificationEventSetting.getServiceevent());
					if (newServiceEvent.getError() == null) {
						notificationEventSetting.setServiceevent(newServiceEvent.getData());
						notificationEventSetting.setId(null);
						NotificationEventSetting newNotificationEventSetting = notificationEventSettingRepo
								.save(notificationEventSetting);
						response.setData(newNotificationEventSetting);
					} else {
						response.setError(newServiceEvent.getError());
					}
				}
			} else {
				notificationEventSettingExists.setEmail(notificationEventSetting.getEmail());
				notificationEventSettingExists.setSms(notificationEventSetting.getSms());
				notificationEventSettingExists.setNotificationCenter(notificationEventSetting.getNotificationCenter());
				notificationEventSettingExists.setEmailTemplate(notificationEventSetting.getEmailTemplate());
				notificationEventSettingExists
						.setNotificationTemplate(notificationEventSetting.getNotificationTemplate());
				notificationEventSettingExists.setPhoneTemplate(notificationEventSetting.getPhoneTemplate());
				notificationEventSettingExists.setRole(notificationEventSetting.getRole());

				if (serviceEventExists != null) {
					ServiceResponse<ServiceEvent> newServiceEvent = serviceEventService
							.save(notificationEventSetting.getId(), notificationEventSetting.getServiceevent());
					if (newServiceEvent.getError() == null) {
						notificationEventSettingExists.setServiceevent(newServiceEvent.getData());
						NotificationEventSetting newNotificationEventSetting = notificationEventSettingRepo
								.save(notificationEventSettingExists);
						response.setData(newNotificationEventSetting);
					} else {
						response.setError(newServiceEvent.getError());
					}

				} else {
					response.setError(EnumTypeForErrorCodes.SCUS417.name(), EnumTypeForErrorCodes.SCUS417.errorMsg());
				}
			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS415.name(), EnumTypeForErrorCodes.SCUS415.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * getUnreadNotificationsCountForUser service implementation
	 * 
	 * @param userId
	 * @return ServiceResponse<Integer>
	 */
	@Override
	public ServiceResponse<Integer> getUnreadNotificationsCountForUser(@PathVariable("userId") Long userId) {
		log.info("getting unread notifications count for user");

		ServiceResponse<Integer> response = new ServiceResponse<>();

		try {
			List<NotificationEvent> notifications = notificationEventRepo.getAllNotificationsForUser(userId,
					MessageTemplateType.WEBSOCKET);

			response.setData(notifications.size());

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS410.name(), EnumTypeForErrorCodes.SCUS410.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * updateNotificationReadStatus service implementation
	 * 
	 * @param userId
	 * @return ServiceResponse<Integer>
	 */
	@Override
	public ServiceResponse<Integer> updateNotificationReadStatus(@PathVariable("userId") Long userId) {
		log.info("update notification read status");

		ServiceResponse<Integer> response = new ServiceResponse<>();

		try {

			Integer updatedEventsCount = notificationEventRepo.updateAllNotificationsOfUser(userId);

			response.setData(updatedEventsCount);

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS411.name(), EnumTypeForErrorCodes.SCUS411.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * getNotificationChannels service implementation
	 * 
	 * @param userId,role
	 * @return ServiceResponse<List<String>>
	 */
	@Override
	public ServiceResponse<List<String>> getNotificationChannels(@PathVariable("role") String role,
			@PathVariable("userId") Long userId) {
		log.info("get notification event setting");
		ServiceResponse<List<String>> response = new ServiceResponse<>();
		try {
			List<String> channels = new ArrayList<>();
			ServiceResponse<List<NotificationEventSetting>> userSettings = getNotificationEventSettingsByRole(role,
					userId);
			List<NotificationEventSetting> notificationEventSettings = userSettings.getData();
			for (NotificationEventSetting notificationEventSetting : notificationEventSettings) {
				if (notificationEventSetting.getNotificationCenter()) {
					channels.add(notificationEventSetting.getServiceevent().getCode());
				}
			}
			response.setData(channels);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS412.name(), EnumTypeForErrorCodes.SCUS412.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * sendNotificationByDcManager service implementation
	 * 
	 * @param email,serviceEvntId,dataMap
	 * @return ServiceResponse<String>
	 */
	@Override
	public ServiceResponse<String> sendNotificationByDcManager(@PathVariable("email") Collection<String> email,
			@PathVariable("serviceEvntId") Long serviceEvntId, @RequestBody Map<String, String> dataMap) {
		ServiceResponse<String> response = new ServiceResponse<>();
		try {

			NotificationEventSetting notificationEventSetting = notificationEventSettingRepo
					.getDefaultNotificationSettingsForEvent(serviceEvntId);

			String userEmailMessage = getUserEmailMessage(dataMap,
					messageTemplateRepo.findById(notificationEventSetting.getEmailTemplate().getId()));

			for (String users : email) {
				emailsvc.notifyUserByEmail(users, userEmailMessage);
			}
			response.setData("Mail sent successfully");
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS420.name(), EnumTypeForErrorCodes.SCUS420.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * getNotificationEventSettingsByRole service implementation
	 * 
	 * @param role
	 * @return ServiceResponse<Set<NotificationEventSetting>>
	 */
	@Override
	public ServiceResponse<List<NotificationEventSetting>> getNotificationEventSettingsByRole(
			@PathVariable("role") String role, @PathVariable("userId") Long userId) {

		ServiceResponse<List<NotificationEventSetting>> response = new ServiceResponse<>();

		try {
			Role userRole = roleRepo.findByName(role);
			Set<NotificationEventSetting> settingsByRoles = notificationEventSettingRepo.findAllByRole(userRole);

			Map<ServiceEvent, NotificationEventSetting> map = new HashMap<>();
			for (NotificationEventSetting notificationEventSetting : settingsByRoles) {
				List<NotificationEventSetting> settingsByServiceEvent = notificationEventSettingRepo
						.findByServiceEventId(notificationEventSetting.getServiceevent().getId());
				for (NotificationEventSetting notificationEventSetting2 : settingsByServiceEvent) {
					User user = notificationEventSetting2.getUser();
					if (user != null && user.getId().equals(userId)) {
						map.put(notificationEventSetting2.getServiceevent(), notificationEventSetting2);
					} else {
						if (!map.containsKey(notificationEventSetting2.getServiceevent())) {
							map.put(notificationEventSetting2.getServiceevent(), notificationEventSetting2);
						}
					}
				}
			}

			response.setData(new ArrayList<NotificationEventSetting>(map.values()));

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS421.name(), EnumTypeForErrorCodes.SCUS421.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;

	}


       /**
	 * sendNotification service implementation
	 * 
	 * @param serviceEvntId, dataMap
	 * @return ServiceResponse<String>
	 */
	@Override
	public ServiceResponse<String> sendNotification(@PathVariable("serviceEvntId") Long serviceEvntId,
			@RequestBody Map<String, String> dataMap) {
		log.info("sending notification");
		ServiceResponse<String> response = new ServiceResponse<>();
		try {

			NotificationEventSetting notify = notificationEventSettingRepo
					.getDefaultNotificationSettingsForEvent(serviceEvntId);

			Set<Role> roles = notify.getRole();
			Collection<String> roleNames = new HashSet<>();

			for (Role role : roles) {
				String roleName = role.getName();
				roleNames.add(roleName);
			}

			sendNotificationToUsersWithRoles(roleNames, serviceEvntId, dataMap);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS422.name(), EnumTypeForErrorCodes.SCUS422.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * changingReadStatus service implementation
	 * 
	 * @param id,readStatus
	 * @return ServiceResponse<NotificationEvent>
	 */
	@Override
	public ServiceResponse<NotificationEvent> changingReadStatus(@PathVariable Long id) {
		ServiceResponse<NotificationEvent> response = new ServiceResponse<>();
		try {
			NotificationEvent notifications = notificationEventRepo.findById(id);
			notifications.setReadStatus(0);
			notificationEventRepo.save(notifications);
			response.setData(notifications);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS423.name(), EnumTypeForErrorCodes.SCUS423.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

}
