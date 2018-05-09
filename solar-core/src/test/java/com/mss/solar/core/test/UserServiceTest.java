package com.mss.solar.core.test;

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
import com.mss.solar.core.domain.Otp;
import com.mss.solar.core.domain.User;
import com.mss.solar.core.repos.OtpRepository;
import com.mss.solar.core.repos.UserRepository;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class UserServiceTest extends SolarApplicationTest {

	@Autowired
	private WebApplicationContext wac;

	@Autowired
	private OtpRepository otpRepo;

	@Autowired
	private UserRepository userRepo;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	/**
	 * Junit test case for getAllUsers
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getAllUsersTest() throws Exception {
		addUser();
		this.mockMvc.perform(get("/api/users/getAllUsers")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getAllRoles
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getAllRolesTest() throws Exception {
		addRole();
		this.mockMvc.perform(get("/api/users/getAllRoles")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getUsersByRole
	 * 
	 * @throws Exception
	 * 
	 * @PathParam role
	 */
	@Test
	@Transactional
	public void getUsersByRoleTest() throws Exception {
		addUser();
		this.mockMvc.perform(get("/api/users/getUsersByRole/USER")).andExpect(status().isOk())

				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for getUsersByEmail
	 * 
	 * @throws Exception
	 * 
	 * @PathParam email
	 */
	@Test
	@Transactional
	public void getUsersByEmailTest() throws Exception {
		addUser();
		this.mockMvc.perform(get("/api/users/getUserByEmail/bharathich123@metanoiasolutions.net"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for updateUser
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateUserTest() throws Exception {
		Integer id = addUser();

		JSONObject userData = new JSONObject();
		userData.put("id", id);
		userData.put("name", "Bharathi123");
		userData.put("email", "bharathich123@metanoiasolutions.net");
		userData.put("phone", "9999955555");
		userData.put("active", "true");

		JSONArray array = new JSONArray();
		JSONObject userData1 = new JSONObject();
		userData1.put("name", "ADMIN");
		array.add(userData1);
		userData.put("roles", array);

		this.mockMvc
				.perform(put("/api/users/updateUser").content((TestUtil.convertObjectToJsonString(userData)))
						.contentType("application/json;charset=UTF-8"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

	}

	/**
	 * Junit test case for addUser
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void addUserTest() throws Exception {
		JSONObject userData = new JSONObject();

		userData.put("name", "bharathi12345");
		userData.put("email", "bharathich123@metanoiasolutions.net");
		userData.put("phone", "9999955555");

		JSONArray array = new JSONArray();
		JSONObject userData1 = new JSONObject();
		userData1.put("id", "2");
		userData1.put("name", "USER");
		array.add(userData1);

		userData.put("roles", array);
		this.mockMvc
				.perform(post("/api/users/addUser").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(userData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for deleteUser
	 * 
	 * @throws Exception
	 * 
	 * @PathParam id
	 */
	@Test
	@Transactional
	public void deleteUserTest() throws Exception {
		Integer id = addUser();

		this.mockMvc.perform(get("/api/users/deleteUser/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for getUsersByPhone
	 * 
	 * @throws Exception
	 * 
	 * @PathParam phone
	 */
	@Test
	@Transactional
	public void getUsersByPhoneTest() throws Exception {
		addUser();
		this.mockMvc.perform(get("/api/users/getUserByPhone/9999955555")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for registerUser
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void registerUserTest() throws Exception {
		JSONObject userData = new JSONObject();
		userData.put("name", "bharathi12345");
		userData.put("email", "bharathich123@metanoiasolutions.net");
		userData.put("phone", "9999955555");

		this.mockMvc
				.perform(post("/api/users/registerUser").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(userData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for setPassword
	 * 
	 * @throws Exception
	 * 
	 * @PathParam id,OTP,password
	 */
	@Test
	@Transactional
	public void setPasswordTest() throws Exception {
		Integer id = addUser();
		long userId = (long) id;
		User userDetails = userRepo.findById(userId);
		Otp otpDetails = otpRepo.findOneByUser(userDetails);
		Integer otp = otpDetails.getCode();

		this.mockMvc.perform(post("/api/users/setPassword/{id}/{otp}/12345", id, otp)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for addRole
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void addRoleTest() throws Exception {
		JSONObject userData = new JSONObject();

		userData.put("name", "CUSTOMER");
		this.mockMvc
				.perform(post("/api/users/addRole").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(userData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for forgotPassword
	 * 
	 * @throws Exception
	 * 
	 * @PathParam email,phoneNumber
	 */
	@Test
	@Transactional
	public void forgotPasswordTest() throws Exception {
		addUser();
		JSONObject userData = new JSONObject();
		this.mockMvc.perform(post("/api/users/forgotPassword/bharathich123@metanoiasolutions.net/9999955555")
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(userData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

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

}
