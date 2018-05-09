package com.mss.solar.dashboard.svcs;

import java.util.Collection;

import javax.validation.constraints.NotNull;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.dashboard.common.RestApiUrlConstants;
import com.mss.solar.dashboard.domain.Analytics;
import com.mss.solar.dashboard.model.ServiceResponse;

@RequestMapping(value = "/api/analytics")
public interface AnalyticsService {

	final String MODULE_NAME = "AnalyticsService";

	@GetMapping(RestApiUrlConstants.GET_ANALYTICS_DATA)
	@ResponseBody
	ServiceResponse<Collection<Analytics>> getAnalyticsData();

	@GetMapping(RestApiUrlConstants.GET_ANALYTICS_BY_DATE)
	@ResponseBody
	ServiceResponse<Collection<Analytics>> getAnalyticsByDate(@NotNull @PathVariable String startDate,
			@NotNull @PathVariable String endDate);

	@GetMapping(RestApiUrlConstants.GET_VENDOR_RELATED_LOADS)
	@ResponseBody
	public ServiceResponse<Collection<Analytics>> getVendorRelatedLoadAppointments(
			@NotNull @PathVariable String vendorName,
			@NotNull @PathVariable("destination") Collection<String> destination);

	@GetMapping(RestApiUrlConstants.GET_VENDOR_RELATED_LOADS_NO_DESTINATION)
	@ResponseBody
	public ServiceResponse<Collection<Analytics>> getVendorRelatedLoadAppointmentsNoDestination(
			@NotNull @PathVariable String vendorName);

}
