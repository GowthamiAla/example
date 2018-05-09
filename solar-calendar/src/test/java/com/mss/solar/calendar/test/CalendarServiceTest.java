package com.mss.solar.calendar.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.ZonedDateTime;

import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.calendar.SolarCalendarApplicationTest;
import com.mss.solar.calendar.domain.CalendarEvent;
import com.mss.solar.calendar.model.CalendarPriorityType;
import com.mss.solar.calendar.repos.CalendarRepo;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

public class CalendarServiceTest extends SolarCalendarApplicationTest {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Autowired
	private CalendarRepo calendarRepo;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	/**
	 * Junit test case for create event
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void createEventTest() throws Exception {
		JSONObject calenderData = new JSONObject();

		calenderData.put("active", "true");
		calenderData.put("start", "2015-03-17T06:06:51.365Z");
		calenderData.put("end", "2015-04-13T06:06:51.445Z");
		calenderData.put("createTime", "2015-04-13T06:06:51.445Z");
		calenderData.put("lastUpdateTime", "2015-04-13T06:06:51.445Z");
		calenderData.put("description", "events");
		calenderData.put("priority", "1");
		calenderData.put("title", "events");

		String propertiesString = "{\"key\":\" event\",\"type\":\" event \"}";

		calenderData.put("properties", propertiesString);

		this.mockMvc
				.perform(post("/api/calendar/createEvent").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(calenderData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for update event by id
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateEventTest() throws Exception {

		Integer id = createEvent();

		JSONObject calenderData = new JSONObject();

		calenderData.put("id", id);
		calenderData.put("active", "true");
		calenderData.put("start", "2017-03-17T06:06:51.365Z");
		calenderData.put("end", "2017-04-13T06:06:51.445Z");
		calenderData.put("createTime", "2017-04-17T06:06:51.465Z");
		calenderData.put("lastUpdateTime", "2017-04-17T04:06:51.465Z");
		calenderData.put("description", "events");
		calenderData.put("priority", "1");
		calenderData.put("title", "events");
		String propertiesString = "{\"key\":\" event\",\"type\":\" event \"}";

		calenderData.put("properties", propertiesString);

		this.mockMvc
				.perform(put("/api/calendar/event/{id}", id).content((TestUtil.convertObjectToJsonString(calenderData)))
						.contentType("application/json;charset=UTF-8"))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getting all events
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getEventsTest() throws Exception {

		createEvent();
		this.mockMvc.perform(get("/api/calendar/getEvents")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data.length()").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for update status
	 * 
	 * @PathParam id,Active
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void updateStatusTest() throws Exception {
		Integer id = createEvent();

		this.mockMvc.perform(put("/api/calendar/updateStatus/{id}/1", id)).andExpect(status().isOk())

				.andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getting event by id
	 * 
	 * @PathParam id
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getEventTest() throws Exception {
		Integer id = createEvent();

		this.mockMvc.perform(get("/api/calendar/event/{id}", id)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getting events by time range
	 * 
	 * @PathParam startTime,endTime
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getEventsByTimeRangeTest() throws Exception {

		Integer id = createEvent();
		long calendarId = (long) id;
		CalendarEvent eventDetails = calendarRepo.findById(calendarId);
		ZonedDateTime startTime = eventDetails.getStart();
		ZonedDateTime endTime = eventDetails.getEnd();

		this.mockMvc.perform(get("/api/calendar/getEventsByTimeRange/{startTime}/{endTime}", startTime, endTime))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getting events by priority
	 * 
	 * @PathParam priority
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getEventsByPriorityTest() throws Exception {
		Integer id = createEvent();
		long calendarId = (long) id;
		CalendarEvent eventDetails = calendarRepo.findById(calendarId);
		CalendarPriorityType priority = eventDetails.getPriority();

		this.mockMvc.perform(get("/api/calendar/getEventsByPriority/{priority}", priority)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getting events by title
	 * 
	 * @PathParam title
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getEventsByTitleTest() throws Exception {

		Integer id = createEvent();
		long calendarId = (long) id;
		CalendarEvent eventDetails = calendarRepo.findById(calendarId);
		String title = eventDetails.getTitle();

		this.mockMvc.perform(get("/api/calendar/getEventsByTitle/{title}", title)).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getting all active events
	 * 
	 * @PathParam Active
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getActiveEventsTest() throws Exception {

		createEvent();

		this.mockMvc.perform(get("/api/calendar/getActiveEvents/1")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for getting all current events
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getCurrentEventsTest() throws Exception {

		createEvent();

		this.mockMvc.perform(get("/api/calendar/getCurrentEvents")).andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.data").exists()).andExpect(jsonPath("$.code").value(0));

	}

	/**
	 * Junit test case for create Quartz Event
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void createQuartzEventTest() throws Exception {
		JSONObject calenderData = new JSONObject();

		calenderData.put("active", "true");
		calenderData.put("start", "2015-03-17T06:06:51.365Z");
		calenderData.put("end", "2015-04-13T06:06:51.445Z");
		calenderData.put("createTime", "2015-04-13T06:06:51.445Z");
		calenderData.put("lastUpdateTime", "2015-04-13T06:06:51.445Z");
		calenderData.put("description", "events");
		calenderData.put("priority", "1");
		calenderData.put("title", "events");

		String propertiesString = "{\"key\":\" event\",\"type\":\" event \"}";

		calenderData.put("properties", propertiesString);

		this.mockMvc
				.perform(post("/api/calendar/createEventNew").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(calenderData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

	}

	/**
	 * Junit test case for create Quartz Event
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void getEventsByFilterTest() throws Exception {
		
		JSONObject calenderData = new JSONObject();
		calenderData.put("active", "true");
		
		this.mockMvc
				.perform(post("/api/calendar/getEventsByFilter").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(calenderData)))
				.andExpect(status().isOk()).andExpect(content().contentType("application/json;charset=UTF-8"));

	}

	/**
	 * createEvent method
	 * 
	 * @throws Exception
	 */
	public Integer createEvent() throws Exception {
		JSONObject calenderData = new JSONObject();

		calenderData.put("active", "true");
		calenderData.put("start", "2015-03-17T06:06:51.365Z");
		calenderData.put("end", "2015-04-13T06:06:51.445Z");
		calenderData.put("createTime", "2015-04-13T06:06:51.445Z");
		calenderData.put("lastUpdateTime", "2015-04-13T06:06:51.445Z");
		calenderData.put("description", "events");
		calenderData.put("priority", "1");
		calenderData.put("title", "events");

		String propertiesString = "{\"key\":\" event\",\"type\":\" event \"}";

		calenderData.put("properties", propertiesString);

		MvcResult mvcResult = mockMvc
				.perform(post("/api/calendar/createEvent").contentType("application/json;charset=UTF-8")
						.content(TestUtil.convertObjectToJsonString(calenderData)))
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

}
