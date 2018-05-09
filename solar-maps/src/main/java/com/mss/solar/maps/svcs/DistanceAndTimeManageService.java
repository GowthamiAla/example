package com.mss.solar.maps.svcs;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.maps.common.RestApiUrlConstants;

@RequestMapping(value = "/api/maps")
public interface DistanceAndTimeManageService {

	@GetMapping(value = RestApiUrlConstants.GET_DISTANCE_INFO)
	@ResponseBody
	String getDistanceAndTimeInfo(@PathVariable("sourcelat") double sourcelat,
			@PathVariable("sourcelong") double sourcelong, @PathVariable("destlat") double destlat,
			@PathVariable("destlong") double destlong);

	@GetMapping(value = RestApiUrlConstants.GET_DISTANCE)
	@ResponseBody
	String getDistanceAndTime(@PathVariable("sourcelat") double sourcelat,
			@PathVariable("sourcelong") double sourcelong, @PathVariable("destlat") double destlat,
			@PathVariable("destlong") double destlong);
	
	
	@GetMapping(value = RestApiUrlConstants.NOTIFY_GEOFENCE)
	@ResponseBody
	String notifyGeofence(@PathVariable("startLat") double startLat, @PathVariable("startLong") double startLong,
			@PathVariable("endLat") double endLat, @PathVariable("endLong") double endLong,@PathVariable double geomiles);

}
