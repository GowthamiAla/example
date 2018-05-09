package com.mss.solar.dashboard.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.dashboard.SolarDashboardApplicationTests;

public class AnalyticsServiceTest extends SolarDashboardApplicationTests {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();

	}

	/**
	 * Junit test case for getAnalyticsData
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getAnalyticsDataTest() throws Exception {

		this.mockMvc.perform(get("/api/analytics/getAnalyticsData")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getAnalyticsByDate
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getAnalyticsByDateTest() throws Exception {

		this.mockMvc.perform(get("/api/analytics/getAnalyticsData/2017-10-14/2017-10-14")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getVendorRelatedLoadAppointments
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getVendorRelatedLoadAppointmentsTest() throws Exception {

		this.mockMvc.perform(get("/api/analytics/getVendorRelatedLoadAppointments/TAMPA DIST CTR/GANDY"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getVendorRelatedLoadAppointmentsNoDestination
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getVendorRelatedLoadAppointmentsNoDestinationTest() throws Exception {

		this.mockMvc.perform(get("/api/analytics/getVendorRelatedLoadAppointments/TAMPA DIST CTR"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}
}
