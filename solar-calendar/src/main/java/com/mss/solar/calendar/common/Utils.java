package com.mss.solar.calendar.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class Utils {
	private static Logger log = LoggerFactory.getLogger(Utils.class);

	@Autowired
	private ObjectMapper jsonMapper;

	public String toJson(Object obj) {

		String retStr = "";

		try {
			retStr = jsonMapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			// do nothing
			log.error("Failed to convert object to json", e);
		}

		return retStr;
	}

}
