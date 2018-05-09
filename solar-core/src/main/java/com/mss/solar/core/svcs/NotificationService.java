package com.mss.solar.core.svcs;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.core.common.RestApiUrlConstants;
import com.mss.solar.core.domain.NotificationEvent;
import com.mss.solar.core.domain.NotificationEventSetting;
import com.mss.solar.core.model.ServiceResponse;

@RequestMapping(value = "api/notifications")
public interface NotificationService {

	final String MODULE_NAME = "NotificationService";

	@GetMapping(RestApiUrlConstants.DEFAULT_NOTIFICATION_EVENT_SETTINGS_BY_ID)
	@ResponseBody
	ServiceResponse<List<NotificationEventSetting>> getDefaultNotificationEventSettings();

	@GetMapping(RestApiUrlConstants.NOTIFICATION_EVENT_SETTINGS_BY_ID)
	@ResponseBody
	ServiceResponse<List<NotificationEventSetting>> getNotificationEventSettings(@PathVariable("userId") Long userId);

	@PostMapping(RestApiUrlConstants.NOTIFICATION_EVENT_SETTINGS)
	@ResponseBody
	ServiceResponse<NotificationEventSetting> addNotificationEventSetting(
			@RequestBody NotificationEventSetting notificationEventSetting);

	@DeleteMapping(RestApiUrlConstants.DELETE_NOTIFICATION_EVENT_SETTING)
	@ResponseBody
	ServiceResponse<String> deleteNotificationEventSetting(@PathVariable("eventSettingId") Long eventSettingId);

	@PostMapping(RestApiUrlConstants.SEND_NOTIFICATION_TO_USERS_WITH_ROLES)
	@ResponseBody
	ServiceResponse<NotificationEvent> sendNotificationToUsersWithRoles(@PathVariable("roles") Collection<String> roles,
			@PathVariable("serviceEvntId") Long serviceEvntId, @RequestBody Map<String, String> dataMap);

	@PostMapping(RestApiUrlConstants.SEND_NOTIFICATION_TO_ALL_ADMINS)
	@ResponseBody
	void sendNotificationToAllAdmins(@PathVariable("serviceEvntId") Long serviceEvntId,
			@RequestBody Map<String, String> dataMap);

	@GetMapping(RestApiUrlConstants.NOTIFY_USER_BY_ID)
	@ResponseBody
	ServiceResponse<List<NotificationEvent>> getNotificationsForUser(@PathVariable("userId") Long userId);

	@PostMapping(RestApiUrlConstants.NOTIFY_USER_BY_USERID)
	@ResponseBody
	ServiceResponse<String> sendNotificationToUser(@PathVariable("userId") Long userId,
			@PathVariable("serviceEvntId") Long serviceEvntId, @RequestBody Map<String, String> dataMap);

	@GetMapping(RestApiUrlConstants.READSTATUS_NOTIFY_USERS)
	@ResponseBody
	ServiceResponse<Integer> getUnreadNotificationsCountForUser(@PathVariable("userId") Long userId);

	@PutMapping(RestApiUrlConstants.READSTATUS_NOTIFY_USERS)
	@ResponseBody
	ServiceResponse<Integer> updateNotificationReadStatus(@PathVariable("userId") Long userId);

	@GetMapping(RestApiUrlConstants.GET_NOTIFICATION_CHANNELS)
	@ResponseBody
	ServiceResponse getNotificationChannels(@PathVariable("role") String role, @PathVariable("userId") Long userId);

	@PutMapping(RestApiUrlConstants.NOTIFICATION_EVENT_SETTINGS)
	@ResponseBody
	ServiceResponse<NotificationEventSetting> updateNotificationEventSetting(
			@Valid @RequestBody NotificationEventSetting notificationEventSetting);

	@PostMapping(RestApiUrlConstants.NOTIFY_BY_DCMANAGER)
	@ResponseBody
	ServiceResponse<String> sendNotificationByDcManager(@PathVariable("email") Collection<String> email,
			@PathVariable("serviceEvntId") Long serviceEvntId, @RequestBody Map<String, String> dataMap);

	@GetMapping(RestApiUrlConstants.GET_NOTIFICATION_BY_ROLE)
	@ResponseBody
	ServiceResponse<List<NotificationEventSetting>> getNotificationEventSettingsByRole(
			@PathVariable("role") String role, @PathVariable("userId") Long userId);

	@PostMapping(RestApiUrlConstants.SEND_NOTIFICATION)
	@ResponseBody
	ServiceResponse<String> sendNotification(@PathVariable("serviceEvntId") Long serviceEvntId,
			@RequestBody Map<String, String> dataMap);
	
	@PutMapping(RestApiUrlConstants.CHANGE_READSTATUS)
	@ResponseBody
	ServiceResponse<NotificationEvent> changingReadStatus(@PathVariable("id") Long id);

}
