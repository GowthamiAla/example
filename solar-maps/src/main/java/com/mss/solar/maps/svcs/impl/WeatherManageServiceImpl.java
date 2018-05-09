package com.mss.solar.maps.svcs.impl;

import java.io.IOException;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mss.solar.maps.common.EnumTypeForErrorCodes;
import com.mss.solar.maps.common.Utils;
import com.mss.solar.maps.model.ServiceResponse;
import com.mss.solar.maps.model.Weather;
import com.mss.solar.maps.svcs.WeatherManageService;



@Service
@RestController
public class WeatherManageServiceImpl implements WeatherManageService {

	private static Logger log = LoggerFactory.getLogger(WeatherManageServiceImpl.class);

	@Value("${weather.url}")
	private String weatherUrl;
	
	@Autowired
	private Utils utils;

	/**
	 * getWeatherInfo Service Implementation
	 * 
	 * @param latitude, longitude
	 * @return ServiceResponse<Weather> 
	 */
	@Override
	public ServiceResponse<Weather> getWeatherInfo(@PathVariable("latitude") String latitude,
			@PathVariable("longitude") String longitude) {

		log.info("Get Weather information");
		ServiceResponse<Weather> response = new ServiceResponse<>();
		RestTemplate restTemplate = new RestTemplate();
		String weatherResponse = restTemplate.getForObject(weatherUrl
				+ "MapClick.php?lat=" + latitude + "&lon=" + longitude
				+ "&FcstType=json", String.class);
		Integer errorFlag = 0;
		JSONParser parser = new JSONParser();
		JSONObject jsonObject;
		Weather weatherData = null;
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
				false);
		try {
			jsonObject = (JSONObject) parser.parse(weatherResponse);
			jsonObject = (JSONObject) jsonObject.get("currentobservation");

			weatherData = mapper.readValue(jsonObject.toJSONString(),
					Weather.class);
			response.setData(weatherData);

		} catch (ParseException e) {
			errorFlag = 1;
			log.error("Error in getting weatherData", e);
		} catch (JsonParseException e) {
			errorFlag = 1;
			log.error("Error in getting weatherData", e);
		} catch (JsonMappingException e) {
			errorFlag = 1;
			log.error("Error in getting weatherData", e);
		} catch (IOException e) {
			errorFlag = 1;
			log.error("Error in getting weatherData", e);
		}

		if (errorFlag == 1) {
			response.setError(EnumTypeForErrorCodes.SCUS901.name(), EnumTypeForErrorCodes.SCUS901.errorMsg());
			log.error(utils.toJson(response.getError()));
		}

		return response;

	}


}
