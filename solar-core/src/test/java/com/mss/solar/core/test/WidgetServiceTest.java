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

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class WidgetServiceTest extends SolarApplicationTest {

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
	 * @throws Exception
	 * 
	 */
	@Test
	@Transactional
	public void findByIdTest() throws Exception {
		Integer id = add();
		this.mockMvc.perform(get("/api/widgets/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));
	}

	/**
	 * Junit test case for update
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateTest() throws Exception {
		Integer id = add();
		Integer roleId = addRole();
		JSONObject widgetData = new JSONObject();
		widgetData.put("id", id);
		widgetData.put("content", "updated widget module");
		widgetData.put("name", "Widget Module");

		JSONArray array = new JSONArray();
		JSONObject roleData = new JSONObject();
		roleData.put("id", roleId);
		roleData.put("name", "CUSTOMER");

		array.add(roleData);
		widgetData.put("role", array);

		this.mockMvc
				.perform(put("/api/widgets/{id}", id).content((TestUtil.convertObjectToJsonString(widgetData)))
						.contentType("application/json;charset=UTF-8"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for delete
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void deleteTest() throws Exception {
		Integer id = add();
		this.mockMvc.perform(delete("/api/widgets/{id}", id)).andExpect(status().isOk())
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
		Integer roleId = addRole();
		JSONObject widgetData = new JSONObject();

		widgetData.put("content", "New Widget Module");
		widgetData.put("name", "Widget Module");

		JSONArray array = new JSONArray();
		JSONObject roleData = new JSONObject();
		roleData.put("id", roleId);
		roleData.put("name", "CUSTOMER");

		array.add(roleData);
		widgetData.put("role", array);

		this.mockMvc
				.perform(post("/api/widgets/").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(widgetData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getAll
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getAllTest() throws Exception {
		add();
		this.mockMvc.perform(get("/api/widgets/")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * add method
	 * 
	 * @throws Exception
	 */
	public Integer add() throws Exception {
		Integer roleId = addRole();
		JSONObject widgetData = new JSONObject();

		widgetData.put("content", "New Widget Module");
		widgetData.put("name", "Widget Module");

		JSONArray array = new JSONArray();
		JSONObject roleData = new JSONObject();
		roleData.put("id", roleId);
		roleData.put("name", "CUSTOMER");
		array.add(roleData);
		widgetData.put("role", array);

		MvcResult mvcResult = mockMvc.perform(post("/api/widgets/").contentType("application/json;charset=UTF-8")
				.content(TestUtil.convertObjectToJsonString(widgetData))).andReturn();

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
