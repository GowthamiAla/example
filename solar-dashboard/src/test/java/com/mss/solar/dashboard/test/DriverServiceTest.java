package com.mss.solar.dashboard.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.dashboard.SolarDashboardApplicationTests;
import com.mss.solar.dashboard.domain.Driver;
import com.mss.solar.dashboard.repos.DriverRepository;

import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class DriverServiceTest extends SolarDashboardApplicationTests {

	@Autowired
	private WebApplicationContext wac;

	@Autowired
	private DriverRepository driverRepo;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	/**
	 * Junit test case for getAllDrivers
	 * 
	 * @throws Exception
	 */
	@Test
	public void getAllDriversTest() throws Exception {
		Integer id = addDriver();
		this.mockMvc.perform(get("/api/drivers/getDrivers")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
		deleteDriver(id);
	}

	/**
	 * Junit test case for addDriver
	 * 
	 * @throws Exception
	 */
	@Test
	public void addDriverTest() throws Exception {

		JSONObject driverData = new JSONObject();

		driverData.put("dateOfBirth", "2015-03-17T06:06:51.365Z");
		driverData.put("firstName", "bharathi");
		driverData.put("lastName", "chikkala");
		driverData.put("email", "bharathich123@metanoiasolutions.net");
		driverData.put("phoneNumber", "9999955555");
		driverData.put("password", "Test@123");

		MvcResult mvcResult = mockMvc
				.perform(post("/api/drivers/addDriver").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(driverData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0)).andReturn();

		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);
		JSONObject jObj = new JSONObject(json);
		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);
		JSONObject dataObj = new JSONObject(jsonData);
		Integer id = (Integer) dataObj.getAsNumber("id");
		deleteDriver(id);

	}

	/**
	 * Junit test case for deleteDriver
	 * 
	 * @throws Exception
	 * 
	 * @PathParam id
	 */
	@Test
	public void deleteDriverTest() throws Exception {
		Integer id = addDriver();

		this.mockMvc.perform(delete("/api/drivers/deleteDriver/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for updateDriver
	 * 
	 * @throws Exception
	 */
	@Test
	public void updateDriverTest() throws Exception {
		Integer id = addDriver();

		JSONObject driverData = new JSONObject();
		driverData.put("id", id);
		driverData.put("dateOfBirth", "2015-03-17T06:06:51.365Z");
		driverData.put("firstName", "bharathich");
		driverData.put("lastName", "chikkala");
		driverData.put("email", "bharathich123@metanoiasolutions.net");
		driverData.put("phoneNumber", "9999955555");
		driverData.put("password", "Test@123");

		this.mockMvc
				.perform(put("/api/drivers/updateDriver").content((TestUtil.convertObjectToJsonString(driverData)))
						.contentType("application/json;charset=UTF-8"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

		deleteDriver(id);

	}

	/**
	 * Junit test case for getDriverById
	 * 
	 * @throws Exception
	 * 
	 * @PathParam id
	 */
	@Test
	public void getDriverByIdTest() throws Exception {
		Integer id = addDriver();

		this.mockMvc.perform(get("/api/drivers/getDriver/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

		deleteDriver(id);
	}

	/**
	 * Junit test case for updateDriverById
	 * 
	 * @throws Exception
	 */
	@Test
	public void updateDriverByIdTest() throws Exception {
		Integer id = addDriver();

		this.mockMvc
				.perform(put("/api/drivers/updateDriver/{id}/222.222/33.3333/", id)
						.contentType("application/json;charset=UTF-8"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

		deleteDriver(id);
	}

	/**
	 * Junit test case for getDriverByUserId
	 * 
	 * @throws Exception
	 * 
	 * @PathParam userid
	 */
	@Test
	public void getDriverByUserIdTest() throws Exception {
		Integer id = addDriver();
		long driverId = (long) id;
		Driver driver = driverRepo.findById(driverId);
		long userId = driver.getUser().getId();

		this.mockMvc.perform(get("/api/drivers/getDriverByUserID/{userId}", userId)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

		deleteDriver(id);
	}

	/**
	 * addDriver method
	 * 
	 * @throws Exception
	 */
	public Integer addDriver() throws Exception {

		JSONObject driverData = new JSONObject();

		driverData.put("dateOfBirth", "2015-03-17T06:06:51.365Z");
		driverData.put("firstName", "bharathi");
		driverData.put("lastName", "chikkala");
		driverData.put("email", "bharathich123@metanoiasolutions.net");
		driverData.put("phoneNumber", "9999955555");
		driverData.put("password", "Test@123");
		driverData.put("latitude", "22.2222");
		driverData.put("longitude", "33.3333");

		MvcResult mvcResult = mockMvc.perform(post("/api/drivers/addDriver")
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(driverData)))
				.andReturn();

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
	 * method for deleteDriver
	 * 
	 * @throws Exception
	 * 
	 * @PathParam id
	 */
	public void deleteDriver(Integer id) throws Exception {

		this.mockMvc.perform(delete("/api/drivers/deleteDriver/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for getDriverByVendorNbr
	 * 
	 * @throws Exception
	 * 
	 * @PathParam vendorNbr
	 */

	@Test
	public void getDriverByVendorNbrTest() throws Exception {

		this.mockMvc.perform(get("/api/drivers/getDriversByVendorNum/000000")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"));

	}

}
