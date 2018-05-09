package com.mss.solar.dashboard.svcs;

import java.util.Collection;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.dashboard.common.RestApiUrlConstants;
import com.mss.solar.dashboard.domain.LoadAppointmentType;
import com.mss.solar.dashboard.model.ServiceResponse;

@RequestMapping(value = "/api/loadAppointmentType")
public interface LoadAppointmentTypeService {

	
	final String MODULE_NAME = "LoadAppointmentTypeService";

	@GetMapping(RestApiUrlConstants.GET_ALL_LOADAPPOINTMENTTYPES)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointmentType>> getAllLoadAppointmentTypes();
}
