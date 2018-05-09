package com.mss.solar.maps.svcs.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.mss.solar.maps.svcs.DistanceAndTimeManageService;

@Service
@RestController
public class DistanceAndTimeServiceImpl implements DistanceAndTimeManageService {

	private static Logger log = LoggerFactory.getLogger(DistanceAndTimeServiceImpl.class);

	@Value("${googleApiKey}")
	private String googleApiKey;

	private static final int EARTH_RADIUS = 3959; // in miles

	/**
	 * getDistanceAndTimeInfo Service Implementation
	 * 
	 * @param sourcelat, sourcelong, destlat, destlong
	 * @return String
	 */
	// Distance and Time With Directions
	@Override
	public String getDistanceAndTimeInfo(@PathVariable("sourcelat") double sourcelat,
			@PathVariable("sourcelong") double sourcelong, @PathVariable("destlat") double destlat,
			@PathVariable("destlong") double destlong) {
		log.debug("Distance And Time impl");
		String uriResponse = null;
		try {
			RestTemplate restTemplate = new RestTemplate();
			String url = "https://maps.googleapis.com/maps/api/directions/json?";
			uriResponse = restTemplate
					.getForObject(
							url + "origin=" + sourcelat + ", " + sourcelong + "&destination=" + destlat + ", "
									+ destlong + "&sensor=false&mode=driving&alternatives=true&key=" + googleApiKey,
							String.class);
		} catch (Exception exception) {
			log.error("Unable to find the Distance and Time", exception);
		}
		return uriResponse;
	}

	/**
	 * getDistanceAndTime Service Implementation
	 * 
	 * @param sourcelat,
	 *            sourcelong, destlat, destlong
	 * @return String
	 */
	// Distance and Time Without Directions
	@Override
	public String getDistanceAndTime(@PathVariable("sourcelat") double sourcelat,
			@PathVariable("sourcelong") double sourcelong, @PathVariable("destlat") double destlat,
			@PathVariable("destlong") double destlong) {
		log.debug("Distance And Time impl");
		String uriResponse = null;
		try {
			RestTemplate restTemplate = new RestTemplate();
			String url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&";
			uriResponse = restTemplate
					.getForObject(
							url + "origins=" + sourcelat + ", " + sourcelong + "&destinations=" + destlat + ", "
									+ destlong + "&mode=driving&language=en-US&key=" + googleApiKey,
							String.class);
		} catch (Exception exception) {
			log.error("Unable to find the Distance and Time", exception);
		}
		return uriResponse;
	}
	
	
	/**
	 * calculating distance between two locations based on given latitude and
	 * longitude
	 * 
	 * @param startLat
	 * @param startLong
	 * @param endLat
	 * @param endLong
	 * @return double
	 */
	public double distance(double startLat, double startLong, double endLat, double endLong) {
		log.info("Calculate distance between two latlangs");

		double c = 0;
		try {
			double dLat = Math.toRadians(endLat - startLat);
			double dLong = Math.toRadians(endLong - startLong);

			startLat = Math.toRadians(startLat);
			endLat = Math.toRadians(endLat);

			double a = (Math.pow(Math.sin(dLat / 2), 2))
					+( Math.cos(startLat) * Math.cos(endLat) * Math.pow(Math.sin(dLong / 2), 2));
			c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		} catch (Exception exception) {
			log.error("Unable to find the Distance", exception);
		}
		return EARTH_RADIUS * c;
	}

	/**
	 * notifyGeofence Service Implementation
	 * 
	 * @param sourcelat, sourcelong, endLat, endLong, geomiles
	 * @return String
	 */
	@Override
	public String notifyGeofence(@PathVariable("startLat") double startLat, @PathVariable("startLong") double startLong,
			@PathVariable("endLat") double endLat, @PathVariable("endLong") double endLong,@PathVariable double geomiles) {
		log.info("notify Geofence");
		String response = null;
		try {
			double distance = distance(startLat, startLong, endLat, endLong);
			if (distance <= geomiles) {
				response = "driver entered into GeoLocation";
			}
		} catch (Exception exception) {
			log.error("Unable to find the Distance", exception);
		}
		return response;
	}

}
