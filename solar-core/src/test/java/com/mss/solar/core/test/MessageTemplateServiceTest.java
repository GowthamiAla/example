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

import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class MessageTemplateServiceTest extends SolarApplicationTest {
	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	/**
	 * Junit test case for findById
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void findByIdTest() throws Exception {
		Integer id = add();
		this.mockMvc.perform(get("/api/templates/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for save
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void saveTest() throws Exception {

		Integer id = add();

		JSONObject templateData = new JSONObject();

		templateData.put("id", id);
		templateData.put("name", "template");
		templateData.put("type", "0");
		templateData.put("content", "messages");

		this.mockMvc
				.perform(put("/api/templates/{id}",id).contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(templateData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for delete template by id
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void deleteTest() throws Exception {
		Integer id = add();

		this.mockMvc.perform(delete("/api/templates/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))

				.andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for add
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void addTest() throws Exception {
		JSONObject templateData = new JSONObject();

		templateData.put("name", "template");
		templateData.put("type", "1");
		templateData.put("content", "messageTemplate");

		this.mockMvc
				.perform(post("/api/templates/").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(templateData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for findAll
	 * 
	 * @throws Exception
	 */

	@Test
	@Transactional
	public void findAllTest() throws Exception {
		add();
		this.mockMvc.perform(get("/api/templates/")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * add method
	 * 
	 * @throws Exception
	 */
	public Integer add() throws Exception {
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

}
