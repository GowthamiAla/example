package com.mss.solar.core.svcs;

import java.util.Collection;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.core.common.RestApiUrlConstants;
import com.mss.solar.core.domain.MessageTemplate;
import com.mss.solar.core.domain.ServiceEvent;
import com.mss.solar.core.model.ServiceResponse;

@RequestMapping(value = "/api/serviceevents")
public interface ServiceEventService {
	final String MODULE_NAME="ServiceEventService";
	@GetMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<ServiceEvent> findById(@NotNull @PathVariable Long id);

	@PutMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<ServiceEvent> save(@NotNull @PathVariable Long id, @Valid @RequestBody ServiceEvent serviceEvent);

	@DeleteMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<String> delete(@NotNull @PathVariable Long id);

	@PostMapping(RestApiUrlConstants.SERVICE_EVENT)
	@ResponseBody
	ServiceResponse<ServiceEvent> add(@Valid @RequestBody ServiceEvent serviceEvent);

	@GetMapping(RestApiUrlConstants.SERVICE_EVENT)
	@ResponseBody
	ServiceResponse<Collection<ServiceEvent>> findAll();
	
	ServiceEvent getServiceEventByCode(String code, String event, String module, MessageTemplate emailTemplate , MessageTemplate websocketTemplate);
}
