package com.mss.solar.dashboard.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.dashboard.SolarDashboardApplicationTests;

import net.minidev.json.JSONObject;

public class ReportServiceTest extends SolarDashboardApplicationTests {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();

	}

	/**
	 * Junit test case for analyticsReport
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void analyticsReportTest() throws Exception {

		JSONObject reportData = new JSONObject();

		reportData.put("RP_startdate", "2017-01-01");
		reportData.put("RP_enddate", "2017-01-25");

		this.mockMvc.perform(post("/api/reports/Analytics_Report").contentType("application/json;charset=UTF-8")
				.content(TestUtil.convertObjectToJsonString(reportData))).andExpect(status().isOk());

	}
}
