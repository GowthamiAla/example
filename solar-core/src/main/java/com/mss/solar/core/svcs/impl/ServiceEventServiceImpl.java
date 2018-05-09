package com.mss.solar.core.svcs.impl;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mss.solar.core.common.EnumTypeForErrorCodes;
import com.mss.solar.core.common.Utils;
import com.mss.solar.core.domain.MessageTemplate;
import com.mss.solar.core.domain.NotificationEventSetting;
import com.mss.solar.core.domain.Role;
import com.mss.solar.core.domain.ServiceEvent;
import com.mss.solar.core.model.ServiceResponse;
import com.mss.solar.core.repos.RoleRepository;
import com.mss.solar.core.repos.ServiceEventRepository;
import com.mss.solar.core.svcs.NotificationService;
import com.mss.solar.core.svcs.ServiceEventService;

@RestController
@Validated
public class ServiceEventServiceImpl implements ServiceEventService {

	private static Logger log = LoggerFactory.getLogger(MessageTemplateServiceImpl.class);

	@Autowired
	private Utils utils;

	@Autowired
	private ServiceEventRepository serviceEventRepo;

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private NotificationService notificationServicesvc;

	/**
	 * findById service implementation
	 * 
	 * @param id
	 * @return ServiceResponse<ServiceEvent>
	 */
	@Override
	public ServiceResponse<ServiceEvent> findById(@NotNull @PathVariable Long id) {
		log.info("finding Service Event by id");

		ServiceResponse<ServiceEvent> response = new ServiceResponse<>();

		try {
			ServiceEvent serviceEvent = serviceEventRepo.findById(id);

			response.setData(serviceEvent);

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS301.name(), EnumTypeForErrorCodes.SCUS301.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * save service implementation
	 * 
	 * @param id,serviceEvent
	 * @return ServiceResponse<ServiceEvent>
	 */
	@Override
	public ServiceResponse<ServiceEvent> save(@NotNull @PathVariable Long id,
			@Valid @RequestBody ServiceEvent serviceEvent) {
		log.info("Update service event");

		ServiceResponse<ServiceEvent> response = new ServiceResponse<>();
		try {
			ServiceEvent serviceEventExists = serviceEventRepo.findById(serviceEvent.getId());
			if (serviceEventExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS302.name(), EnumTypeForErrorCodes.SCUS302.errorMsg());
			} else {
				ServiceEvent eventCodeExists = serviceEventRepo.findByCode(serviceEvent.getCode());
				ServiceEvent eventExists = serviceEventRepo.findByEvent(serviceEvent.getEvent());

				if (eventCodeExists == null || eventCodeExists.getId() == serviceEvent.getId()) {
					serviceEventExists.setCode(serviceEvent.getCode());
					if (eventExists == null || eventExists.getId() == serviceEvent.getId()) {
						serviceEventExists.setEvent(serviceEvent.getEvent());
					} else {
						response.setError(EnumTypeForErrorCodes.SCUS309.name(),
								EnumTypeForErrorCodes.SCUS309.errorMsg());
					}
					
				} else {
					response.setError(EnumTypeForErrorCodes.SCUS308.name(), EnumTypeForErrorCodes.SCUS308.errorMsg());
				}
				serviceEventExists.setModule(serviceEvent.getModule());
				ServiceEvent updatedServiceEvent = serviceEventRepo.save(serviceEventExists);
				response.setData(updatedServiceEvent);
				
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS303.name(),
					EnumTypeForErrorCodes.SCUS303.errorMsg() + utils.toJson(serviceEvent));
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * delete service implementation
	 * 
	 * @param id
	 * @return ServiceResponse<String>
	 */
	@Override
	public ServiceResponse<String> delete(@NotNull @PathVariable Long id) {
		log.info("deleting service event");

		ServiceResponse<String> response = new ServiceResponse<>();

		try {
			ServiceEvent serviceEvent = serviceEventRepo.findOne(id);

			serviceEventRepo.delete(serviceEvent);

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS304.name(), EnumTypeForErrorCodes.SCUS304.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * add service implementation
	 * 
	 * @param serviceEvent
	 * @return ServiceResponse<ServiceEvent>
	 */
	@Override
	public ServiceResponse<ServiceEvent> add(@Valid @RequestBody ServiceEvent serviceEvent) {
		log.info("Adding service event");

		ServiceResponse<ServiceEvent> response = new ServiceResponse<>();

		try {
			ServiceEvent eventCodeExists = serviceEventRepo.findByCode(serviceEvent.getCode());
			ServiceEvent eventExists = serviceEventRepo.findByEvent(serviceEvent.getEvent());
			
			if (eventCodeExists != null )  {
				response.setError(EnumTypeForErrorCodes.SCUS308.name(), EnumTypeForErrorCodes.SCUS308.errorMsg());
			} else if (eventExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS309.name(), EnumTypeForErrorCodes.SCUS309.errorMsg());
			} else {
				
				ServiceEvent newServiceEvent = serviceEventRepo.save(serviceEvent);
				response.setData(newServiceEvent);
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS306.name(), EnumTypeForErrorCodes.SCUS306.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * findAll service implementation
	 * 
	 * @return ServiceResponse<Collection<ServiceEvent>>
	 */
	@Override
	public ServiceResponse<Collection<ServiceEvent>> findAll() {
		log.info("finding all service events");

		ServiceResponse<Collection<ServiceEvent>> response = new ServiceResponse<>();

		try {

			Collection<ServiceEvent> serviceEvents = serviceEventRepo.findAll();

			response.setData(serviceEvents);

		}catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS307.name(), EnumTypeForErrorCodes.SCUS307.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * getServiceEventByCode service implementation
	 * 
	 * @param code,event,module,emailTemplate,websocketTemplate
	 * @return ServiceEvent
	 */
	@Override
	public ServiceEvent getServiceEventByCode(String code, String event, String module, MessageTemplate emailTemplate , MessageTemplate websocketTemplate) {

		log.info("finding service events by code");

		ServiceEvent serviceEvent = new ServiceEvent();
		try {
			ServiceEvent serviceEventExists = serviceEventRepo.findByCode(code);
			if (serviceEventExists != null) {
				serviceEvent.setId(serviceEventExists.getId()); 
				serviceEvent.setCode(serviceEventExists.getCode()); 
				serviceEvent.setEvent(serviceEventExists.getEvent()); 
				serviceEvent.setModule(serviceEventExists.getModule());
				
			} else {
				serviceEvent.setCode(code);
				serviceEvent.setEvent(event);
				serviceEvent.setModule(module);
				serviceEvent = serviceEventRepo.save(serviceEvent);
				
				NotificationEventSetting notificationEventSetting = new NotificationEventSetting();
				notificationEventSetting.setServiceevent(serviceEvent);
				notificationEventSetting.setEmail(true);
				notificationEventSetting.setSms(false);
				notificationEventSetting.setNotificationCenter(false);
				notificationEventSetting.setEmailTemplate(emailTemplate);
				notificationEventSetting.setNotificationTemplate(websocketTemplate);

				Set<Role> roles = new HashSet<>();
				Role role = roleRepo.findByName("ADMIN");
				roles.add(role);
				
				notificationEventSetting.setRole(roles);

				notificationServicesvc.addNotificationEventSetting(notificationEventSetting);
			}

		}catch (Exception e) {
			log.error(utils.toJson("Failed to get service event by code"), e);
		}
		return serviceEvent;
	}

}
