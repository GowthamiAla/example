package com.mss.solar.core.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.core.SolarApplicationTest;
import com.mss.solar.core.domain.NotificationEventSetting;
import com.mss.solar.core.domain.Role;
import com.mss.solar.core.repos.NotificationEventSettingRepository;
import com.mss.solar.core.repos.RoleRepository;
import com.mss.solar.core.repos.ServiceEventRepository;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class NotificationServiceTest extends SolarApplicationTest {

	@Autowired
	private WebApplicationContext wac;

	@Autowired
	private NotificationEventSettingRepository notificationEventSettingRepo;
	
	@Autowired
	private RoleRepository roleRepo;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	/**
	 * Junit test case for getNotificationEventSettings
	 * 
	 * @PathParam userId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getNotificationEventSettingsTest() throws Exception {
		Integer notifyId = addNotificationEventSetting();
		long id = (long) notifyId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		long userId = notifyEvent.getUser().getId();

		this.mockMvc.perform(get("/api/notifications/eventsettings/{userId}", userId)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for addNotificationEventSetting
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void addNotificationEventSettingTest() throws Exception {
		JSONObject notificationData = new JSONObject();
		// serviceEvent
		JSONObject serviceEvent = new JSONObject();
		serviceEvent.put("code", "000");
		serviceEvent.put("event", "event");
		serviceEvent.put("module", "user");
		notificationData.put("serviceevent", serviceEvent);
		// user
		Integer id = addUser();
		JSONObject userData = new JSONObject();
		userData.put("id", id);
		userData.put("name", "Bharathi");
		userData.put("email", "bharathich123@metanoiasolutions.net");
		userData.put("phone", "9999955555");

		JSONArray array1 = new JSONArray();
		JSONObject userData1 = new JSONObject();
		userData1.put("name", "USER");
		array1.add(userData1);

		userData.put("roles", array1);
		notificationData.put("user", userData);

		notificationData.put("email", true);
		notificationData.put("sms", true);
		notificationData.put("notificationCenter", true);

		Integer tempId = addTemplate();
		// notificationTemplate
		JSONObject notificationTemplate = new JSONObject();
		notificationTemplate.put("id", tempId);
		notificationTemplate.put("name", "template");
		notificationTemplate.put("type", "1");
		notificationTemplate.put("content", "messageTemplate");
		notificationData.put("notificationTemplate", notificationTemplate);
		// notificationTemplate
		JSONObject emailTemplate = new JSONObject();
		emailTemplate.put("id", tempId);
		emailTemplate.put("name", "template");
		emailTemplate.put("type", "1");
		emailTemplate.put("content", "messageTemplate");
		notificationData.put("emailTemplate", emailTemplate);
		// phoneTemplate
		JSONObject phoneTemplate = new JSONObject();
		phoneTemplate.put("id", tempId);
		phoneTemplate.put("name", "template");
		phoneTemplate.put("type", "1");
		phoneTemplate.put("content", "messageTemplate");
		notificationData.put("phoneTemplate", phoneTemplate);
		// Role
		JSONArray array = new JSONArray();
		JSONObject role = new JSONObject();
		Integer roleId = addRole();
		role.put("id", roleId);
		role.put("name", "USER");
		array.add(role);
		notificationData.put("role", array);

		this.mockMvc
				.perform(post("/api/notifications/eventsettings").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(notificationData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for updateNotificationEventSetting
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateNotificationEventSettingTest() throws Exception {
		Integer eventId = addNotificationEventSetting();
		JSONObject notificationData = new JSONObject();
		notificationData.put("id", eventId);
		// serviceEvent
		JSONObject serviceEvent = new JSONObject();
		serviceEvent.put("code", "000");
		serviceEvent.put("event", "event");
		serviceEvent.put("module", "user");
		notificationData.put("serviceevent", serviceEvent);

		notificationData.put("email", false);
		notificationData.put("sms", false);
		notificationData.put("notificationCenter", true);
		this.mockMvc
				.perform(put("/api/notifications/eventsettings").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(notificationData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));
				
	}

	/**
	 * Junit test case for deleteNotificationEventSetting
	 * 
	 * @throws Exception
	 * 
	 * @PathParam eventSettingId
	 */
	@Test
	@Transactional
	public void deleteNotificationEventSettingTest() throws Exception {
		Integer eventSettingId = addNotificationEventSetting();

		this.mockMvc.perform(delete("/api/notifications/eventsettings/{eventSettingId}", eventSettingId))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for sendNotificationToUsersWithRoles
	 * 
	 * @PathParam serviceEvntId,roles
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void sendNotificationToUsersWithRolesTest() throws Exception {
		Integer eventSettingId = addNotificationEventSetting();
		long id = (long) eventSettingId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		Long serviceEvntId = notifyEvent.getServiceevent().getId();
		JSONObject eventData = new JSONObject();
		eventData.put("key", "hello");

		this.mockMvc.perform(post("/api/notifications/notify/{serviceEvntId}/USER", serviceEvntId)
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(eventData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));
				
	}

	/**
	 * Junit test case for sendNotificationToAllAdmins
	 * 
	 * @PathParam serviceEvntId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void sendNotificationToAllAdminsTest() throws Exception {
		Integer eventSettingId = addNotificationEventSetting();
		long id = (long) eventSettingId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		Long serviceEvntId = notifyEvent.getServiceevent().getId();
		JSONObject eventData = new JSONObject();
		eventData.put("key", "hello");

		this.mockMvc.perform(post("/api/notifications/notify/{serviceEvntId}/admins", serviceEvntId)
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(eventData)))
				.andExpect(status().isOk());
	}

	/**
	 * Junit test case for getNotificationsForUser
	 * 
	 * @PathParam userId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getNotificationsForUserTest() throws Exception {
		Integer notifyId = addNotificationEventSetting();
		long id = (long) notifyId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		long userId = notifyEvent.getUser().getId();
		this.mockMvc.perform(get("/api/notifications/notify/{userId}", userId)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"));
	}

	/**
	 * Junit test case for sendNotificationToUser
	 * 
	 * @PathParam userId,serviceEvntId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void sendNotificationToUserTest() throws Exception {
		Integer notifyId = addNotificationEventSetting();
		long id = (long) notifyId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		long userId = notifyEvent.getUser().getId();
		Long serviceEvntId = notifyEvent.getServiceevent().getId();
		JSONObject eventData = new JSONObject();
		eventData.put("key", "hello");

		this.mockMvc.perform(post("/api/notifications/notification/{userId}/{serviceEvntId}", userId, serviceEvntId)
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(eventData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));
				
	}

	/**
	 * Junit test case for getDefaultNotificationEventSettings
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getDefaultNotificationEventSettingsTest() throws Exception {

		this.mockMvc.perform(get("/api/notifications/eventsettings/default")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for getUnreadNotificationsCountForUser
	 * 
	 * @PathParam userId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getUnreadNotificationsCountForUserTest() throws Exception {
		Integer notifyId = addNotificationEventSetting();
		long id = (long) notifyId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		long userId = notifyEvent.getUser().getId();

		this.mockMvc.perform(get("/api/notifications/notify/count/{userId}", userId)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for updateNotificationReadStatus
	 * 
	 * @PathParam userId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateNotificationReadStatusTest() throws Exception {
		Integer notifyId = addNotificationEventSetting();
		long id = (long) notifyId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		long userId = notifyEvent.getUser().getId();

		this.mockMvc.perform(put("/api/notifications/notify/count/{userId}", userId)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for getNotificationChannels
	 * 
	 * @PathParam userId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getNotificationChannelsTest() throws Exception {
		Integer notifyId = addNotificationEventSetting();
		long id = (long) notifyId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		long userId = notifyEvent.getUser().getId();

		this.mockMvc.perform(get("/api/notifications/channels/ADMIN/{userId}", userId)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for sendNotificationByDcManager
	 * 
	 * @PathParam serviceEvntId,email
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void sendNotificationByDcManagerTest() throws Exception {
		Integer eventSettingId = addNotificationEventSetting();
		long id = (long) eventSettingId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		Long serviceEvntId = notifyEvent.getServiceevent().getId();
		JSONObject eventData = new JSONObject();
		eventData.put("key", "hello");

		this.mockMvc.perform(post("/api/notifications/notifyEmail/{serviceEvntId}/lginjupalli@metanoiasolutions.net,bchikkala@metanoiasolutions.net/", serviceEvntId)
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(eventData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));
	
	}

	/**
	 * Junit test case for getNotificationEventSettingsByRole
	 * 
	 * @PathParam role,userId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getNotificationEventSettingsByRoleAndUserIdTest() throws Exception {
		Integer id = addRole();
		long roleId = (long) id;
		Role userRole = roleRepo.findById(roleId);
		String role = userRole.getName();
		long userId = addUser();

		this.mockMvc.perform(get("/api/notifications/getNotificationEventSettingsByRole/{role}/{userId}", role, userId))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}
	/**
	 * Junit test case for sendNotification
	 * 
	 * @PathParam serviceEvntId
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void sendNotificationTest() throws Exception {
		Integer eventSettingId = addNotificationEventSetting();
		long id = (long) eventSettingId;
		NotificationEventSetting notifyEvent = notificationEventSettingRepo.findById(id);
		Long serviceEvntId = notifyEvent.getServiceevent().getId();
		JSONObject eventData = new JSONObject();
		eventData.put("key", "hello");

		this.mockMvc.perform(post("/api/notifications/notify/roles/{serviceEvntId}", serviceEvntId)
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(eventData)))
				.andExpect(status().isOk());
	}

	/**
	 * Junit test case for changingReadStatus
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void changingReadStatusTest() throws Exception {
		JSONObject notificationData = new JSONObject();

		Integer id = addUser();
		JSONObject userData = new JSONObject();
		userData.put("id", id);
		userData.put("name", "Bharathi");
		userData.put("email", "bharathich123@metanoiasolutions.net");
		userData.put("phone", "9999955555");

		JSONArray array1 = new JSONArray();
		JSONObject userData1 = new JSONObject();
		userData1.put("name", "USER");
		array1.add(userData1);
		userData.put("roles", array1);
		notificationData.put("user", userData);

		notificationData.put("lastUpdateTime", "2015-03-17T06:06:51.365Z");
		notificationData.put("readStatus", "1");
		notificationData.put("type", "2");

		// serviceEvent
		JSONObject serviceEvent = new JSONObject();
		serviceEvent.put("code", "000");
		serviceEvent.put("event", "event");
		serviceEvent.put("module", "user");
		notificationData.put("serviceevent", serviceEvent);

		notificationData.put("notificationContext", "hello");
		
		this.mockMvc
				.perform(put("/api/notifications/changeReadStatus/{id}",id).contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(notificationData)))
				.andExpect(status().isOk());

	}

	/**
	 * addUser method
	 * 
	 * @throws Exception
	 */
	public Integer addUser() throws Exception {
		JSONObject userData = new JSONObject();

		userData.put("name", "Bharathi");
		userData.put("email", "bharathich123@metanoiasolutions.net");
		userData.put("phone", "9999955555");

		JSONArray array = new JSONArray();
		JSONObject userData1 = new JSONObject();
		userData1.put("name", "USER");
		array.add(userData1);
		userData.put("roles", array);

		MvcResult mvcResult = mockMvc.perform(post("/api/users/addUser").contentType("application/json;charset=UTF-8")
				.content(TestUtil.convertObjectToJsonString(userData))).andReturn();

		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);
		JSONObject jObj = new JSONObject(json);
		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);
		JSONObject dataObj = new JSONObject(jsonData);
		Integer id = (Integer) dataObj.getAsNumber("id");
		return id;

	}

	/**
	 * addRole method
	 * 
	 * @throws Exception
	 */
	public Integer addRole() throws Exception {
		JSONObject userData = new JSONObject();

		userData.put("name", "CUSTOMER");
		MvcResult mvcResult = mockMvc.perform(post("/api/users/addRole").contentType("application/json;charset=UTF-8")
				.content(TestUtil.convertObjectToJsonString(userData))).andReturn();
		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);
		JSONObject jObj = new JSONObject(json);
		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);
		JSONObject dataObj = new JSONObject(jsonData);
		Integer id = (Integer) dataObj.getAsNumber("id");

		return id;
	}

	/**
	 * addTemplate method
	 * 
	 * @throws Exception
	 */
	public Integer addTemplate() throws Exception {
		JSONObject templateData = new JSONObject();

		templateData.put("name", "template");
		templateData.put("type", "1");
		templateData.put("content", "messageTemplate");

		MvcResult mvcResult = mockMvc.perform(post("/api/templates/").contentType("application/json;charset=UTF-8")
				.content(TestUtil.convertObjectToJsonString(templateData))).andReturn();

		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);

		JSONObject jObj = new JSONObject(json);

		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);

		JSONObject dataObj = new JSONObject(jsonData);
		Integer id = (Integer) dataObj.getAsNumber("id");
		return id;
	}

	/**
	 * addNotificationEventSetting method
	 * 
	 * @throws Exception
	 */
	public Integer addNotificationEventSetting() throws Exception {
		JSONObject notificationData = new JSONObject();
		// serviceEvent
		JSONObject serviceEvent = new JSONObject();
		serviceEvent.put("code", "000");
		serviceEvent.put("event", "event");
		serviceEvent.put("module", "user");
		notificationData.put("serviceevent", serviceEvent);
		// user
		Integer id = addUser();
		JSONObject userData = new JSONObject();
		userData.put("id", id);
		userData.put("name", "Bharathi");
		userData.put("email", "bharathich123@metanoiasolutions.net");
		userData.put("phone", "9999955555");

		JSONArray array1 = new JSONArray();
		JSONObject userData1 = new JSONObject();
		userData1.put("name", "USER");
		array1.add(userData1);

		userData.put("roles", array1);
		notificationData.put("user", userData);

		notificationData.put("email", true);
		notificationData.put("sms", true);
		notificationData.put("notificationCenter", true);

		Integer tempId = addTemplate();
		// notificationTemplate
		JSONObject notificationTemplate = new JSONObject();
		notificationTemplate.put("id", tempId);
		notificationTemplate.put("name", "template");
		notificationTemplate.put("type", "1");
		notificationTemplate.put("content", "messageTemplate");
		notificationData.put("notificationTemplate", notificationTemplate);
		// notificationTemplate
		JSONObject emailTemplate = new JSONObject();
		emailTemplate.put("id", tempId);
		emailTemplate.put("name", "template");
		emailTemplate.put("type", "1");
		emailTemplate.put("content", "messageTemplate");
		notificationData.put("emailTemplate", emailTemplate);
		// phoneTemplate
		JSONObject phoneTemplate = new JSONObject();
		phoneTemplate.put("id", tempId);
		phoneTemplate.put("name", "template");
		phoneTemplate.put("type", "1");
		phoneTemplate.put("content", "messageTemplate");
		notificationData.put("phoneTemplate", phoneTemplate);
		// Role
		JSONArray array = new JSONArray();
		JSONObject role = new JSONObject();
		Integer roleId = addRole();
		role.put("id", roleId);
		role.put("name", "USER");
		array.add(role);
		notificationData.put("role", array);

		MvcResult mvcResult = mockMvc
				.perform(post("/api/notifications/eventsettings").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(notificationData)))
				.andReturn();

		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);

		JSONObject jObj = new JSONObject(json);

		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);

		JSONObject dataObj = new JSONObject(jsonData);
		Integer notifyId = (Integer) dataObj.getAsNumber("id");
		return notifyId;

	}

}
