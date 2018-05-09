package com.mss.solar.dashboard.svcs.impl;

import java.util.Collection;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.mss.solar.dashboard.common.EnumTypeForErrorCodes;
import com.mss.solar.dashboard.common.Utils;
import com.mss.solar.dashboard.domain.Analytics;
import com.mss.solar.dashboard.model.ServiceResponse;
import com.mss.solar.dashboard.repos.AnalyticsRepository;
import com.mss.solar.dashboard.svcs.AnalyticsService;

@RestController
@Validated
public class AnalyticsServiceImpl implements AnalyticsService {

	private static final Logger log = Logger.getLogger(AnalyticsServiceImpl.class);

	@Autowired
	private AnalyticsRepository analyticsRepo;

	@Autowired
	private Utils utils;

	/**
	 * getAnalyticsData Service Implementation
	 * 
	 * @return ServiceResponse<Collection<Analytics>>
	 */
	@Override
	public ServiceResponse<Collection<Analytics>> getAnalyticsData() {
		log.debug("Getting all analytics data details");
		ServiceResponse<Collection<Analytics>> response = new ServiceResponse<>();
		try {
			List<Analytics> analytics = analyticsRepo.findAll();
			response.setData(analytics);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS601.name(), EnumTypeForErrorCodes.SCUS601.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getAnalyticsByDate Service Implementation
	 * 
	 * @return ServiceResponse<Collection<Analytics>>
	 */
	@Override
	public ServiceResponse<Collection<Analytics>> getAnalyticsByDate(@NotNull @PathVariable String startDate,
			@NotNull @PathVariable String endDate) {
		log.debug("Getting all analytics data by startDate and endDate");
		ServiceResponse<Collection<Analytics>> response = new ServiceResponse<>();
		try {
			Collection<Analytics> analytics = analyticsRepo.getAnalyticsData(startDate, endDate);
			response.setData(analytics);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS602.name(), EnumTypeForErrorCodes.SCUS602.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getVendorRelatedLoadAppointments Service Implementation
	 * 
	 * @return ServiceResponse<Collection<Analytics>>
	 */
	@Override
	public ServiceResponse<Collection<Analytics>> getVendorRelatedLoadAppointments(
			@NotNull @PathVariable String vendorName,
			@NotNull @PathVariable("destination") Collection<String> destination) {
		log.debug("Getting all VendorRelated LoadAppointments");
		ServiceResponse<Collection<Analytics>> response = new ServiceResponse<>();
		try {
			Collection<Analytics> analytics = analyticsRepo.findAllByvndNameAndDestinationIn(vendorName, destination);
			response.setData(analytics);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS603.name(), EnumTypeForErrorCodes.SCUS603.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getVendorRelatedLoadAppointmentsNoDestination Service Implementation
	 * 
	 * @return ServiceResponse<Collection<Analytics>>
	 */
	@Override
	public ServiceResponse<Collection<Analytics>> getVendorRelatedLoadAppointmentsNoDestination(
			@NotNull @PathVariable String vendorName) {
		log.debug("Getting all VendorRelated LoadAppointments");
		ServiceResponse<Collection<Analytics>> response = new ServiceResponse<>();
		try {
			Collection<Analytics> analytics = analyticsRepo.findByvndName(vendorName);
			response.setData(analytics);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS603.name(), EnumTypeForErrorCodes.SCUS603.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}
}
