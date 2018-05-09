package com.mss.solar.maps.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.maps.SolarMapsApplicationTests;

public class DistanceAndTimeServiceTest extends SolarMapsApplicationTests{
	@Autowired
	private WebApplicationContext wac;
	
	private MockMvc mockMvc;
	
	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();

	}

	/**
	 * Junit test case for getDistanceAndTimeInfo
	 * 
	 * @throws Exception
	 */
	
	@Test
	public void getDistanceAndTimeInfoTest() throws Exception {

		this.mockMvc.perform(get("/api/maps/distance/12.968725/77.595437/17.454793/78.466628/"))
				.andExpect(status().isOk()).andExpect(content().contentType("text/plain;charset=UTF-8"));

	}
	/**
	 * Junit test case for getDistanceAndTime
	 * 
	 * @throws Exception
	 */
	
	@Test
	public void getDistanceAndTimeTest() throws Exception {

		this.mockMvc.perform(get("/api/maps/distanceTime/12.968725/77.595437/17.454793/78.466628/"))
				.andExpect(status().isOk()).andExpect(content().contentType("text/plain;charset=UTF-8"));

	}

	/**
	 * Junit test case for notifyGeofence
	 * 
	 * @throws Exception
	 */
	@Test
	public void notifyGeofenceTest() throws Exception {

		this.mockMvc.perform(get("/api/maps/geofence/12.968725/77.595437/13/78/23.36/")).andExpect(status().isOk());
		

	}
}
