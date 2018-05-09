package com.mss.solar.maps.svcs;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.maps.common.RestApiUrlConstants;
import com.mss.solar.maps.model.ServiceResponse;
import com.mss.solar.maps.model.Weather;


@RequestMapping(value = "/api/maps")
public interface WeatherManageService {

	@GetMapping(value = RestApiUrlConstants.GET_WEATHER_INFO)
	@ResponseBody
	ServiceResponse<Weather> getWeatherInfo(@PathVariable("latitude") String latitude, @PathVariable("longitude") String longitude);

}
