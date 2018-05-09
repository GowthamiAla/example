package com.mss.solar.core.svcs.impl;

import java.util.Collection;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mss.solar.core.common.EnumTypeForErrorCodes;
import com.mss.solar.core.common.Utils;
import com.mss.solar.core.domain.Widget;
import com.mss.solar.core.model.ServiceResponse;
import com.mss.solar.core.repos.RoleRepository;
import com.mss.solar.core.repos.WidgetRepository;
import com.mss.solar.core.svcs.WidgetService;

@RestController
@Validated
public class WidgetServiceImpl implements WidgetService {

	private static final Logger log = Logger.getLogger(WidgetServiceImpl.class);

	@Autowired
	public WidgetRepository widgetRepo;

	@Autowired
	public RoleRepository roleRepo;

	@Autowired
	private Utils utils;

	@Autowired
	private UserServiceImpl userSvc;

	
	/**
	 * find widget by id
	 * 
	 * @param id
	 * @return ServiceResponse<Widget>
	 */
	@Override
	public ServiceResponse<Widget> findById(@NotNull @PathVariable("id") Long id) {

		log.info("Find widget by id");
		ServiceResponse<Widget> response = new ServiceResponse<>();
		try {
			Widget widget = widgetRepo.findById(id);
			response.setData(widget);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS501.name(), EnumTypeForErrorCodes.SCUS501.errorMsg());
			log.error(utils.toJson(response.getError()), e);
			userSvc.sendErrorNotification("Failed to find the widget");
		}
		return response;
	}

	/**
	 * update the widget
	 * 
	 * @param id
	 * @param widget
	 * @return ServiceResponse<Widget>
	 */
	@Override
	public ServiceResponse<Widget> update(@PathVariable("id") Long id, @RequestBody Widget widget) {

		log.info("updating widget");
		ServiceResponse<Widget> response = new ServiceResponse<>();
		try {
			Widget widgetExists = widgetRepo.findById(id);
			if (widgetExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS502.name(), EnumTypeForErrorCodes.SCUS502.errorMsg());
			} else {
				Widget nameExists = widgetRepo.findByName(widget.getName());
				if (nameExists == null || nameExists.getId() == id) {
					widgetExists.setRole(widget.getRole());
					widgetExists.setContent(widget.getContent());
					widgetExists.setName(widget.getName());
					widgetRepo.save(widgetExists);
					response.setData(widgetExists);
				} else {
					response.setError(EnumTypeForErrorCodes.SCUS503.name(), EnumTypeForErrorCodes.SCUS503.errorMsg());
				}
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS504.name(), EnumTypeForErrorCodes.SCUS504.errorMsg());
			log.error(utils.toJson(response.getError()), e);
			userSvc.sendErrorNotification("Failed to update widget");
		}
		return response;
	}

	/**
	 * Delete widget
	 * 
	 * @param id
	 * @return ServiceResponse<String>
	 */

	@Override
	public ServiceResponse<String> delete(@NotNull @PathVariable("id") Long id) {

		log.info("Delete widget");
		ServiceResponse<String> response = new ServiceResponse<>();

		try {
			Widget widget = widgetRepo.findById(id);
			widgetRepo.delete(widget);
			response.setData("widget Deleted Successfully");
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS505.name(), EnumTypeForErrorCodes.SCUS505.errorMsg());
			log.error(utils.toJson(response.getError()), e);
			userSvc.sendErrorNotification("Failed to delete widget");
		}
		return response;
	}

	/**
	 * adding widget
	 * 
	 * @param widget
	 * @return ServiceResponse<Widget>
	 */
	@Override
	public ServiceResponse<Widget> add(@Valid @RequestBody Widget widget) {

		log.info("adding widget");
		ServiceResponse<Widget> response = new ServiceResponse<>();
		try {
			Widget widgetExists = widgetRepo.findByName(widget.getName());
			if (widgetExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS506.name(), EnumTypeForErrorCodes.SCUS506.errorMsg());
			} else {
				if (widget.getRole() == null) {
					response.setError(EnumTypeForErrorCodes.SCUS507.name(), EnumTypeForErrorCodes.SCUS507.errorMsg());
				} else {
					widgetRepo.save(widget);
					response.setData(widget);
				}

			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS508.name(), EnumTypeForErrorCodes.SCUS508.errorMsg());
			log.error(utils.toJson(response.getError()), e);
			userSvc.sendErrorNotification("Failed to add new widget");
		}
		return response;
	}

	/**
	 * Getting all widget
	 * 
	 * 
	 * @return ServiceResponse<Collection<Widget>>
	 */
	@Override
	public ServiceResponse<Collection<Widget>> getAllWidgets() {
		log.info("Getting all widget");
		ServiceResponse<Collection<Widget>> response = new ServiceResponse<>();
		try {
			Collection<Widget> widget = widgetRepo.findAll();
			response.setData(widget);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS509.name(), EnumTypeForErrorCodes.SCUS509.errorMsg());
			log.error(utils.toJson(response.getError()), e);
			userSvc.sendErrorNotification("Failed to get all widget");
		}
		return response;
	}
}
