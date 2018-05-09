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

import com.mss.solar.core.common.MessageTemplateType;
import com.mss.solar.core.domain.MessageTemplate;
import com.mss.solar.core.model.ServiceResponse;
import com.mss.solar.core.common.RestApiUrlConstants;

@RequestMapping(value = "/api/templates")
public interface MessageTemplateService {
	
	final String MODULE_NAME="MessageTemplateService";
 
	@GetMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<MessageTemplate> findById(@NotNull @PathVariable Long id);

	@PutMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<MessageTemplate> save(@NotNull @PathVariable Long id, @Valid @RequestBody MessageTemplate template);

	@DeleteMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<String> delete(@NotNull @PathVariable Long id);

	@PostMapping(RestApiUrlConstants.MESSAGE_TEMPLATE)
	@ResponseBody
	ServiceResponse<MessageTemplate> add(@Valid @RequestBody MessageTemplate template);

	@GetMapping(RestApiUrlConstants.MESSAGE_TEMPLATE)
	@ResponseBody
	ServiceResponse<Collection<MessageTemplate>> findAll();

	MessageTemplate getMessageTemplateByName(String string, MessageTemplateType htmlEmail, String string2);

}
