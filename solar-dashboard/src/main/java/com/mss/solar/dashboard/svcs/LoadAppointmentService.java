package com.mss.solar.dashboard.svcs;

import java.util.Collection;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.dashboard.common.RestApiUrlConstants;
import com.mss.solar.dashboard.domain.LoadAppointment;
import com.mss.solar.dashboard.model.ServiceResponse;

@RequestMapping(value = "/api/loadAppointments")
public interface LoadAppointmentService {
	
	final String MODULE_NAME = "LoadAppointmentService";

	@GetMapping(RestApiUrlConstants.GET_ALL_LOADAPPOINTMENTS)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointment>> getAllLoadAppointments();
	
	@GetMapping(RestApiUrlConstants.GET_LOADAPPOINTMENTS_BY_DRIVER)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointment>> getLoadAppointmentsByDriver(@NotNull @PathVariable Long driverId);

	@PutMapping(RestApiUrlConstants.UPDATE_LOADAPPOINTMENT)
	@ResponseBody
	ServiceResponse<LoadAppointment> updateLoadAppointment( @Valid @RequestBody LoadAppointment loadAppointment);

	@DeleteMapping(RestApiUrlConstants.DELETE_LOADAPPOINTMENT)
	@ResponseBody
	ServiceResponse<LoadAppointment> deleteLoadAppointment(@NotNull @PathVariable String apptNbr);

	@PostMapping(RestApiUrlConstants.ADD_LOADAPPOINTMENT)
	@ResponseBody
	ServiceResponse<LoadAppointment> addLoadAppointment(@Valid @RequestBody LoadAppointment loadAppointment); 
	
	@GetMapping(RestApiUrlConstants.GET_LOADAPPOINTMENTS_BY_APPTNBR)
	@ResponseBody
	ServiceResponse<LoadAppointment> getLoadAppointmentsByApptNbr(@NotNull @PathVariable String apptNbr);
	
	@PutMapping(RestApiUrlConstants.UPDATE_lOAD_STATUS)
	@ResponseBody
	ServiceResponse<LoadAppointment> updateLoadStatus( @Valid @PathVariable String apptNbr,@Valid @PathVariable Long status);
	
	@GetMapping(RestApiUrlConstants.GET_ACCEPTED_LOADS_BY_DRIVER)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointment>> getDriverAcceptedLoads(@Valid @PathVariable Long driverId);
	
	@GetMapping(RestApiUrlConstants.GET_NOT_COMPLETED_LOADS)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointment>> getDriverNotCompletedLoads(@Valid @PathVariable Long driverId);
	
	@GetMapping(RestApiUrlConstants.GET_ALL_ACCEPTED_LOADS)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointment>> getAcceptedLoadsList();
	
	@GetMapping(RestApiUrlConstants.UPDATE_HIGH_VALUE)
	@ResponseBody
	public void updateHighValue(@PathVariable String loadAppt, @PathVariable Integer highValueLoad,
			@PathVariable Integer highPriorityLoad);
	
	@GetMapping(RestApiUrlConstants.GET_LOADS_BASED_LOCATIONS)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointment>> getLoadsBasedOnLocations(@NotNull @PathVariable String locNbr);
	

	
	@GetMapping(RestApiUrlConstants.GET_LOADS_BASED_DCMANAGER)
	@ResponseBody
	ServiceResponse<Collection<LoadAppointment>> getLoadsBasedOnDcManager(@Email @PathVariable String email);

	@PutMapping(RestApiUrlConstants.UPDATE_GEOMILES)
	@ResponseBody
	ServiceResponse<LoadAppointment> updateGeofenceMiles(@Valid @PathVariable String apptNbr,
			@Valid @PathVariable Long geomiles);

	
}
