package com.mss.solar.core.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.mss.solar.core.SolarApplicationTest;

public class EmailServiceTest extends SolarApplicationTest {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	/**
	 * Junit test case for notifyUser
	 * 
	 * @PathParam userId,payload
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void notifyUserTest() throws Exception {

		this.mockMvc.perform(get("/emailsvc/notifyUser/1/hello")).andExpect(status().isOk());

	}
	
	/**
	 * Junit test case for notifyUserByEmail
	 * 
	 * @PathParam email,payload
	 * 
	 * @throws Exception
	 */
	@Test
	@Transactional
	public void notifyUserByEmailTest() throws Exception {

		this.mockMvc.perform(get("/emailsvc/notifyEmail/lginjupalli12345@metanoiasolutions.net/hello")).andExpect(status().isOk());

	}

}
