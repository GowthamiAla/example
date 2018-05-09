package com.mss.solar.core.svcs.impl;

import java.util.Collection;

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
import com.mss.solar.core.common.MessageTemplateType;
import com.mss.solar.core.common.Utils;
import com.mss.solar.core.domain.MessageTemplate;
import com.mss.solar.core.model.ServiceResponse;
import com.mss.solar.core.repos.MessageTemplateRepository;
import com.mss.solar.core.svcs.MessageTemplateService;

@RestController
@Validated
public class MessageTemplateServiceImpl implements MessageTemplateService {

	private static Logger log = LoggerFactory.getLogger(MessageTemplateServiceImpl.class);

	@Autowired
	private Utils utils;

	@Autowired
	private MessageTemplateRepository messageTemplateRepo;

	/**
	 * findById service implementation
	 * 
	 * @param id
	 * @return ServiceResponse<MessageTemplate>
	 */
	@Override
	public ServiceResponse<MessageTemplate> findById(@NotNull @PathVariable Long id) {
		log.info("finding template by id");

		ServiceResponse<MessageTemplate> response = new ServiceResponse<>();

		try {
			MessageTemplate msg = messageTemplateRepo.findById(id);

			response.setData(msg);

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS101.name(), EnumTypeForErrorCodes.SCUS101.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * save service implementation
	 * 
	 * @param id
	 * @RequestBody template
	 * 
	 * @return ServiceResponse<MessageTemplate>
	 */
	@Override
	public ServiceResponse<MessageTemplate> save(@NotNull @PathVariable Long id,
			@Valid @RequestBody MessageTemplate template) {
		log.info("Update template");

		ServiceResponse<MessageTemplate> response = new ServiceResponse<>();
		try {
			MessageTemplate msgExists = messageTemplateRepo.findById(template.getId());
			if (msgExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS102.name(), EnumTypeForErrorCodes.SCUS102.errorMsg());
			} else {
				MessageTemplate templateExists = messageTemplateRepo.findByName(template.getName());
					if(templateExists == null || templateExists.getId() == msgExists.getId()){
						
						msgExists.setName(template.getName());
						msgExists.setType(template.getType());
						msgExists.setContent(template.getContent());
						MessageTemplate messageTemplate = messageTemplateRepo.save(msgExists);
						response.setData(messageTemplate);

					}else{
						response.setError(EnumTypeForErrorCodes.SCUS108.name(), EnumTypeForErrorCodes.SCUS108.errorMsg());
						}
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS103.name(), EnumTypeForErrorCodes.SCUS103.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;

	}

	/**
	 * delete service implementation
	 * 
	 * @param id
	 * 
	 * @return ServiceResponse<String>
	 */
	@Override
	public ServiceResponse<String> delete(@NotNull @PathVariable Long id) {
		log.info("deleting template");

		ServiceResponse<String> response = new ServiceResponse<>();

		try {
			MessageTemplate msg = messageTemplateRepo.findOne(id);

			messageTemplateRepo.delete(msg);

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS104.name(), EnumTypeForErrorCodes.SCUS104.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * add service implementation
	 * 
	 * @RequestBody template
	 * 
	 * @return ServiceResponse<MessageTemplate>
	 */
	@Override
	public ServiceResponse<MessageTemplate> add(@Valid @RequestBody MessageTemplate template) {
		log.info("Adding template");

		ServiceResponse<MessageTemplate> response = new ServiceResponse<>();

		try {
			MessageTemplate templateExists = messageTemplateRepo.findByName(template.getName());
			if (templateExists == null ) {

				MessageTemplate messageTemplate = messageTemplateRepo.save(template);

				response.setData(messageTemplate);
			} else {

				response.setError(EnumTypeForErrorCodes.SCUS105.name(), EnumTypeForErrorCodes.SCUS105.errorMsg() + template.getName());
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS106.name(), EnumTypeForErrorCodes.SCUS106.errorMsg()+ template.getName());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * findAll service implementation
	 * 
	 * @return ServiceResponse<Collection<MessageTemplate>>
	 */
	@Override
	public ServiceResponse<Collection<MessageTemplate>> findAll() {
		log.info("finding all templates");

		ServiceResponse<Collection<MessageTemplate>> response = new ServiceResponse<>();

		try {

			Collection<MessageTemplate> msg = messageTemplateRepo.findAll();

			response.setData(msg);

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS107.name(), EnumTypeForErrorCodes.SCUS107.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;

	}

	/**
	 * getMessageTemplateByName service implementation
	 * 
	 * @param name,
	 * @param template,
	 * @param content
	 * @return MessageTemplate
	 */
	@Override
	public MessageTemplate getMessageTemplateByName(String name, MessageTemplateType template, String content) {
		log.info("finding service events by code");

		MessageTemplate messageTemplate = new MessageTemplate();
		try {
			MessageTemplate messageTemplateExists = messageTemplateRepo.findByName(name);
			if (messageTemplateExists != null) {
				messageTemplate.setId(messageTemplateExists.getId());
				messageTemplate.setName(messageTemplateExists.getName());
				messageTemplate.setContent(messageTemplateExists.getContent());
				messageTemplate.setType(messageTemplateExists.getType());

			} else {
				messageTemplate.setName(name);
				messageTemplate.setContent(content);
				messageTemplate.setType(template);

				messageTemplate = messageTemplateRepo.save(messageTemplate);

			}

		} catch (Exception e) {
			log.error(utils.toJson("Failed to get service event by code"), e);
		
		}
		return messageTemplate;
	}
}
