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
import com.mss.solar.core.domain.Widget;
import com.mss.solar.core.model.ServiceResponse;

@RequestMapping(value = "/api/widgets")
public interface WidgetService {
	
	final String MODULE_NAME="WidgetService";
	
	@GetMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<Widget> findById(@NotNull @PathVariable("id") Long id);
	
	@PutMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<Widget> update(@NotNull @PathVariable("id") Long id, @Valid @RequestBody Widget widget);
	
	@DeleteMapping(RestApiUrlConstants.GET_DETAILS_BY_ID)
	@ResponseBody
	ServiceResponse<String> delete(@NotNull @PathVariable("id") Long id);
	
	@PostMapping(RestApiUrlConstants.WIDGET)
	@ResponseBody
	ServiceResponse<Widget> add(@Valid @RequestBody Widget widget);
	
	@GetMapping(RestApiUrlConstants.WIDGET)
	@ResponseBody
	ServiceResponse<Collection<Widget>> getAllWidgets();
}

