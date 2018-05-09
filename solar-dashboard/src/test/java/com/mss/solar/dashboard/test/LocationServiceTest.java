package com.mss.solar.dashboard.test;

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

import com.mss.solar.dashboard.SolarDashboardApplicationTests;

import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class LocationServiceTest extends SolarDashboardApplicationTests {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	/**
	 * Junit test case for addLocation
	 * 
	 * @throws Exception
	 */
	@Test
	public void addLocationTest() throws Exception {
		JSONObject locationData = new JSONObject();

		locationData.put("locNbr", "111");
		locationData.put("locAddrName", "Lohitha");
		locationData.put("address", "Ganga parvathi complex");
		locationData.put("city", "Madhapur");
		locationData.put("state", "Telangana");
		locationData.put("country", "India");
		locationData.put("zipCode", "500081");
		locationData.put("email", "lginjupalli123@metanoiasolutions.net");
		locationData.put("phoneNumber", "00000000000");
		locationData.put("latitude", "23.63");
		locationData.put("longitude", "52.63");
		locationData.put("createdTS", "2015-03-17T06:06:51.365Z");
		locationData.put("lastUpdatedTS", "2015-03-17T06:06:51.365Z");

		MvcResult mvcResult = mockMvc
				.perform(post("/api/locations/addLocation").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(locationData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0)).andReturn();

		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);
		JSONObject jObj = new JSONObject(json);
		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);
		JSONObject dataObj = new JSONObject(jsonData);
		String locNbr = (String) dataObj.getAsString("locNbr");
		deleteLocation(locNbr);

	}

	/**
	 * Junit test case for updateLocation
	 * 
	 * @throws Exception
	 */
	@Test
	public void updateLocationTest() throws Exception {
		String locNbr = addLocation();

		JSONObject locationData = new JSONObject();

		locationData.put("locNbr", locNbr);
		locationData.put("locAddrName", "Lohitha g");
		locationData.put("address", "silicon valley");
		locationData.put("city", "Madhapur");
		locationData.put("state", "Telangana");
		locationData.put("country", "India");
		locationData.put("zipCode", "500081");
		locationData.put("email", "lginjupalli987@metanoiasolutions.net");
		locationData.put("phoneNumber", "0000000000");
		locationData.put("latitude", "23.63");
		locationData.put("longitude", "52.63");
		locationData.put("createdTS", "2015-03-17T06:06:51.365Z");
		locationData.put("lastUpdatedTS", "2015-03-17T06:06:51.365Z");

		this.mockMvc
				.perform(put("/api/locations/updateLocation").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(locationData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

		deleteLocation(locNbr);
	}

	/**
	 * Junit test case for getLocationsById
	 * 
	 * @throws Exception
	 */
	@Test
	public void getLocationsByLocNbrTest() throws Exception {
		String locNbr = addLocation();
		this.mockMvc.perform(get("/api/locations/getLocation/{locNbr}", locNbr)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

		deleteLocation(locNbr);
	}

	/**
	 * Junit test case for deleteLocation
	 * 
	 * @throws Exception
	 */
	@Test
	public void deleteLocationTest() throws Exception {
		String locNbr = addLocation();
		this.mockMvc.perform(delete("/api/locations/deleteLocation/{locNbr}", locNbr)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getAllUsers
	 * 
	 * @throws Exception
	 */
	@Test
	public void getAllLocationsTest() throws Exception {
		String locNbr = addLocation();

		this.mockMvc.perform(get("/api/locations/getAllLocations")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

		deleteLocation(locNbr);

	}

	/**
	 * Junit test case for getdistanceinfo
	 * 
	 * @throws Exception
	 */
	@Test
	public void getdistanceinfoTest() throws Exception {

		this.mockMvc.perform(get("/api/locations/distance/12.968725/77.595437/17.454793/78.466628/"))
				.andExpect(status().isOk()).andExpect(content().contentType("text/plain;charset=UTF-8"));

	}

	/**
	 * Junit test case for notifyGeofence
	 * 
	 * @throws Exception
	 */
	@Test
	public void notifyGeofenceTest() throws Exception {

		JSONObject locationData = new JSONObject();

		locationData.put("driver", "Bharathi");

		this.mockMvc.perform(
				post("/api/locations/geofence/12.968725/77.595437/13/78/23.32/1").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(locationData)))
				.andExpect(status().isOk());

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
		JSONObject eventData = new JSONObject();
		eventData.put("key", "hello");

		this.mockMvc.perform(post("/api/locations/notifyEmail/lginjupalli@metanoiasolutions.net,bchikkala@metanoiasolutions.net/")
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(eventData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));
	
	}
	

	/**
	 * Junit test case for getweatherinfo
	 * 
	 * @throws Exception
	 */

	@Test
	public void getweatherinfoTest() throws Exception {

		this.mockMvc.perform(get("/api/locations/weatherinfo/33/-84/")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * addLocation method
	 * 
	 * @throws Exception
	 */
	public String addLocation() throws Exception {
		JSONObject locationData = new JSONObject();

		locationData.put("locNbr", "00000000");
		locationData.put("locAddrName", "Lohitha");
		locationData.put("address", "Ganga parvathi complex");
		locationData.put("city", "Madhapur");
		locationData.put("state", "Telangana");
		locationData.put("country", "India");
		locationData.put("zipCode", "500081");
		locationData.put("email", "lginjupalli987@metanoiasolutions.net");
		locationData.put("phoneNumber", "0000000000");
		locationData.put("latitude", "23.63");
		locationData.put("longitude", "52.63");
		locationData.put("createdTS", "2015-03-17T06:06:51.365Z");
		locationData.put("lastUpdatedTS", "2015-03-17T06:06:51.365Z");

		MvcResult mvcResult = mockMvc
				.perform(post("/api/locations/addLocation").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(locationData)))
				.andReturn();

		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);
		JSONObject jObj = new JSONObject(json);
		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);
		JSONObject dataObj = new JSONObject(jsonData);
		String locNbr = (String) dataObj.getAsString("locNbr");
		return locNbr;

	}

	/**
	 * method for deleteLocation
	 * 
	 * @throws Exception
	 * 
	 * @PathParam locNbr
	 */
	public void deleteLocation(String locNbr) throws Exception {

		this.mockMvc.perform(delete("/api/locations/deleteLocation/{locNbr}", locNbr)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

}
