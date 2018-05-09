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
import com.mss.solar.dashboard.domain.Location;
import com.mss.solar.dashboard.repos.LocationRepository;

import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class LoadAppointmentServiceTest extends SolarDashboardApplicationTests {
	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Autowired
	private LocationRepository locationRepo;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();

	}

	/**
	 * Junit test case for getAllLoadAppointments
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getAllLoadAppointmentsTest() throws Exception {
		addLoadAppointment();
		this.mockMvc.perform(get("/api/loadAppointments/getAllLoadAppointments")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getLoadAppointmentsByDriver
	 * 
	 * @PathParam driverId
	 * 
	 * @throws Exception
	 */
	@Test
	public void getLoadAppointmentsByDriverTest() throws Exception {
		Integer id = addDriver();
		long driverId = (long) id;
		this.mockMvc.perform(get("/api/loadAppointments/getAllLoadAppointments/{driverId}", driverId))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
		deleteDriver(id);
	}

	/**
	 * Junit test case for updateLoadAppointment
	 * 
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateLoadAppointmentTest() throws Exception {
		String apptNbr = addLoadAppointment();

		JSONObject loadAppointmentData = new JSONObject();
		loadAppointmentData.put("apptNbr", apptNbr);
		loadAppointmentData.put("createdTS", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("lastUpdatedTS", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("scheduledArrivalDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("startDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("endDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("cartons", "1");

		JSONObject loadAppointmentData1 = new JSONObject();
		loadAppointmentData1.put("id", "1");
		loadAppointmentData1.put("status", "Load Created");
		loadAppointmentData.put("apptStatNbr", loadAppointmentData1);

		this.mockMvc
				.perform(
						put("/api/loadAppointments/updateLoadAppointment").contentType("application/json;charset=UTF-8")
								.content(TestUtil.convertObjectToJsonString(loadAppointmentData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for deleteLoadAppointment
	 * 
	 * @PathParam apptNbr
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void deleteLoadTest() throws Exception {
		String apptNbr = addLoadAppointment();

		this.mockMvc.perform(delete("/api/loadAppointments/deleteLoadAppointment/{apptNbr}", apptNbr))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for addLoadAppointment
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void addLoadAppointmentTest() throws Exception {
		JSONObject loadAppointmentData = new JSONObject();

		loadAppointmentData.put("apptNbr", "001");
		loadAppointmentData.put("createdTS", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("lastUpdatedTS", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("scheduledArrivalDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("startDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("endDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("cartons", "1");

		JSONObject loadAppointmentData1 = new JSONObject();
		loadAppointmentData1.put("id", "1");
		loadAppointmentData1.put("status", "Load Created");
		loadAppointmentData.put("apptStatNbr", loadAppointmentData1);

		this.mockMvc
				.perform(post("/api/loadAppointments/addLoadAppointment").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(loadAppointmentData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for getLoadAppointmentsByApptNbr
	 * 
	 * @PathParam apptNbr
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getLoadAppointmentsByApptNbrTest() throws Exception {
		String apptNbr = addLoadAppointment();
		this.mockMvc.perform(get("/api/loadAppointments/getLoadAppointments/{apptNbr}", apptNbr))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for updateLoadStatus
	 * 
	 * @PathParam apptNbr,Active
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateLoadStatusTest() throws Exception {
		String apptNbr = addLoadAppointment();

		this.mockMvc
				.perform(put("/api/loadAppointments/updateLoad/{apptNbr}/1", apptNbr)
						.contentType("application/json;charset=UTF-8"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));
	}

	/**
	 * Junit test case for getDriverAcceptedLoads
	 * 
	 * @PathParam driverId
	 * 
	 * @throws Exception
	 */
	@Test
	public void getDriverAcceptedLoadsTest() throws Exception {

		Integer id = addDriver();
		long driverId = (long) id;
		this.mockMvc.perform(get("/api/loadAppointments/getDriverAcceptedLoads/{driverId}", driverId))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
		deleteDriver(id);
	}

	/**
	 * Junit test case for getDriverNotCompletedLoads
	 * 
	 * @PathParam driverId
	 * 
	 * @throws Exception
	 */
	@Test
	public void getDriverNotCompletedLoadsTest() throws Exception {

		Integer id = addDriver();
		long driverId = (long) id;
		this.mockMvc.perform(get("/api/loadAppointments/getDriverNotCompletedLoads/{driverId}", driverId))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
		deleteDriver(id);

	}

	/**
	 * Junit test case for getAcceptedLoadsList
	 * 
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getAcceptedLoadsListTest() throws Exception {
		addLoadAppointment();
		this.mockMvc.perform(get("/api/loadAppointments/getAcceptedLoadList")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for updateHighValue
	 * 
	 * @PathParam loadAppt,highValueLoad,highPriorityLoad
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateHighValueTest() throws Exception {
		String loadAppt = addLoadAppointment();

		this.mockMvc.perform(get("/api/loadAppointments/updateHighValue/{loadAppt}/1/0", loadAppt))
				.andExpect(status().isOk());

	}

	/**
	 * Junit test case for getLoadsBasedOnLocations
	 * 
	 * @PathParam locNbr
	 * 
	 * @throws Exception
	 */
	@Test
	public void getLoadsBasedOnLocationsTest() throws Exception {
		String locNbr = addLocation();

		this.mockMvc.perform(get("/api/loadAppointments/getLoadsBasedOnLocations/{locNbr}/", locNbr))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
		deleteLocation(locNbr);
	}

	/**
	 * Junit test case for getLoadsBasedOnDcManagerTest
	 * 
	 * @PathParam email
	 * 
	 * @throws Exception
	 */
	@Test
	public void getLoadsBasedOnDcManagerTest() throws Exception {
		String locNbr = addLocation();
		Location location = locationRepo.findByLocNbr(locNbr);
		String email = location.getEmail();

		this.mockMvc.perform(get("/api/loadAppointments/getLoadsBasedOnDcManager/{email}/", email))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
		deleteLocation(locNbr);
	}

	/**
	 * Junit test case for updateGeofenceMilesTest
	 * 
	 * @PathParam apptNbr,geomiles
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateGeofenceMilesTest() throws Exception {

		this.mockMvc.perform(
				put("/api/loadAppointments/updateGeofenceMiles/000/00").contentType("application/json;charset=UTF-8"))

				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

	}

	/**
	 * method for addLoadAppointment
	 * 
	 * 
	 * @throws Exception
	 */
	private String addLoadAppointment() throws Exception {

		JSONObject loadAppointmentData = new JSONObject();

		loadAppointmentData.put("apptNbr", "00");
		loadAppointmentData.put("createdTS", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("lastUpdatedTS", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("scheduledArrivalDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("startDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("endDate", "2015-03-17T06:06:51.365Z");
		loadAppointmentData.put("cartons", "1");

		JSONObject loadAppointmentData1 = new JSONObject();
		loadAppointmentData1.put("id", "1");
		loadAppointmentData1.put("status", "Load Created");
		loadAppointmentData.put("apptStatNbr", loadAppointmentData1);

		MvcResult mvcResult = mockMvc
				.perform(post("/api/loadAppointments/addLoadAppointment").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(loadAppointmentData)))
				.andReturn();
		String result = mvcResult.getResponse().getContentAsString();
		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);
		JSONObject jObj = new JSONObject(json);
		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);
		JSONObject dataObj = new JSONObject(jsonData);
		String apptNbr = (String) dataObj.getAsString("apptNbr");
		return apptNbr;

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
		driverData.put("email", "bchikkala123@metanoiasolutions.net");
		driverData.put("phoneNumber", "9999555555");
		driverData.put("password", "Test@123");

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
		Integer driverId = (Integer) dataObj.getAsNumber("id");
		return driverId;
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
		locationData.put("email", "bchikkala123@metanoiasolutions.net");
		locationData.put("phoneNumber", "9999955555");
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
