package com.mss.solar.dashboard.svcs.impl;

import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import com.mss.solar.dashboard.common.EnumTypeForErrorCodes;
import com.mss.solar.dashboard.common.Utils;
import com.mss.solar.dashboard.domain.LoadAppointmentType;
import com.mss.solar.dashboard.model.ServiceResponse;
import com.mss.solar.dashboard.repos.LoadAppointmentTypeRepository;
import com.mss.solar.dashboard.svcs.LoadAppointmentTypeService;

@RestController
@Validated
public class LoadAppointmentTypeServiceImpl implements LoadAppointmentTypeService {

	private static Logger log = LoggerFactory.getLogger(LoadAppointmentTypeServiceImpl.class);

	@Autowired
	private LoadAppointmentTypeRepository loadAppointmentTypeRepo;

	@Autowired
	private Utils utils;

	/**
	 * getAllLoadAppointmentTypes service implementation
	 * 
	 * @return ServiceResponse<Collection<LoadAppointmentType>>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointmentType>> getAllLoadAppointmentTypes() {

		log.info("getting all loadAppointmentTypes");
		ServiceResponse<Collection<LoadAppointmentType>> response = new ServiceResponse<>();
		try {
			Collection<LoadAppointmentType> loadAppointments = loadAppointmentTypeRepo.findAll();
			response.setData(loadAppointments);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS401.name(), EnumTypeForErrorCodes.SCUS401.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

}
