package com.mss.solar.reports.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.reports.test.TestUtil;
import com.mss.solar.reports.SolarReportsApplicationTests;

import net.minidev.json.JSONObject;

public class ReportServiceTest extends SolarReportsApplicationTests {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	MockMultipartFile file = new MockMultipartFile("reportData", "sample.xml", "text/xml", "some report xml".getBytes());

	/**
	 * Junit test case for generateReport
	 * 
	 * @PathParam userId,templateName
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void generateReportTest() throws Exception {
		JSONObject reportData = new JSONObject();

		reportData.put("RP_startdate", "2017-01-01");
		reportData.put("RP_enddate", "2017-01-25");
		// saveReport();
		this.mockMvc
				.perform(post("/api/reports/analytics_report").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(reportData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

	}

	/**
	 * Junit test case for saveReport
	 * 
	 * @PathParam templateName,formatType
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void saveReportTest() throws Exception {

		this.mockMvc.perform((MockMvcRequestBuilders.fileUpload("/api/reports/analytics_report/PDF").file(file)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));
	}

	/**
	 * Junit test case for getReportTemplate
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getReportTemplateTest() throws Exception {

		this.mockMvc.perform(get("/api/reports/")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for deleteReport
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void deleteReportTest() throws Exception {
		this.mockMvc.perform(delete("/api/reports/10")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"));

	}
	/**
	 *saveReport method
	 * 
	 * @PathParam templateName,formatType
	 * 
	 * @throws Exception
	 */
	public void saveReport() throws Exception {

		this.mockMvc.perform((MockMvcRequestBuilders.fileUpload("/api/reports/userreport/USERDETAILS/PDF").file(file)));
				
	}
}
