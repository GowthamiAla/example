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

public class VendorServiceTest extends SolarDashboardApplicationTests {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();

	}

	/**
	 * Junit test case for getVendors
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getVendorsTest() throws Exception {

		this.mockMvc.perform(get("/api/vendors/getVendors")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for addVendor
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void addVendorTest() throws Exception {
		JSONObject vendorData = new JSONObject();

		vendorData.put("vendorNbr", "000");
		vendorData.put("vendorName", "vendor");
		vendorData.put("phoneNumber", "9999955555");
		vendorData.put("email", "bchikkala123@metanoiasolutions.net");
		vendorData.put("address", "imagegarden road");
		vendorData.put("state", "hyd");
		vendorData.put("city", "hyd");
		vendorData.put("country", "india");
		vendorData.put("zipCode", "500081");
		
		this.mockMvc
				.perform(post("/api/vendors/addVendor").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(vendorData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for deleteVendor
	 * 
	 * @throws Exception
	 * 
	 * @PathParam vendorNbr
	 */
	@Test
	@Transactional
	public void deleteVendorTest() throws Exception {
		String vendorNbr = addVendor();

		this.mockMvc.perform(delete("/api/vendors/deleteVendor/{vendorNbr}", vendorNbr)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for updateVendor
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updatevendorTest() throws Exception {
		String vendorNbr = addVendor();

		JSONObject vendorData = new JSONObject();

		vendorData.put("vendorNbr", vendorNbr);
		vendorData.put("vendorName", "vendorname");
		vendorData.put("phoneNumber", "9999955555");
		vendorData.put("email", "bchikkala123@metanoiasolutions.net");
		vendorData.put("address", "imagegarden road");
		vendorData.put("state", "hyd");
		vendorData.put("city", "hyd");
		vendorData.put("country", "india");
		vendorData.put("zipCode", "500081");

		this.mockMvc
				.perform(put("/api/vendors/updateVendor").content((TestUtil.convertObjectToJsonString(vendorData)))
						.contentType("application/json;charset=UTF-8"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

	}

	/**
	 * Junit test case for getvendorByNumber
	 * 
	 * @throws Exception
	 * 
	 * @PathParam vendorNbr
	 */
	@Test
	@Transactional
	public void getvendorByNumberTest() throws Exception {
		String vendorNbr = addVendor();

		this.mockMvc.perform(get("/api/vendors/getVendor/{vendorNbr}", vendorNbr)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * addVendor method
	 * 
	 * @throws Exception
	 */
	public String addVendor() throws Exception {

		JSONObject vendorData = new JSONObject();

		vendorData.put("vendorNbr", "000");
		vendorData.put("vendorName", "vendor");
		vendorData.put("phoneNumber", "9999955555");
		vendorData.put("email", "bchikkala123@metanoiasolutions.net");
		vendorData.put("address", "imagegarden road");
		vendorData.put("state", "hyd");
		vendorData.put("city", "hyd");
		vendorData.put("country", "india");
		vendorData.put("zipCode", "500081");

		MvcResult mvcResult = mockMvc.perform(post("/api/vendors/addVendor")
				.contentType("application/json;charset=UTF-8").content(TestUtil.convertObjectToJsonString(vendorData)))
				.andReturn();

		String result = mvcResult.getResponse().getContentAsString();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result);
		JSONObject jObj = new JSONObject(json);
		String dataResult = jObj.getAsString("data");

		JSONObject jsonData = (JSONObject) parser.parse(dataResult);
		JSONObject dataObj = new JSONObject(jsonData);
		String vendorNbr = dataObj.getAsString("vendorNbr");

		return vendorNbr;
	}

}
