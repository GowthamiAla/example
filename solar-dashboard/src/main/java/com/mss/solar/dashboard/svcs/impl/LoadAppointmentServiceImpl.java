package com.mss.solar.dashboard.svcs.impl;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.mss.solar.dashboard.common.EnumTypeForErrorCodes;
import com.mss.solar.dashboard.common.Utils;
import com.mss.solar.dashboard.domain.Driver;
import com.mss.solar.dashboard.domain.LoadAppointment;
import com.mss.solar.dashboard.domain.LoadAppointmentStatus;
import com.mss.solar.dashboard.domain.Location;
import com.mss.solar.dashboard.model.ServiceResponse;
import com.mss.solar.dashboard.repos.LoadAppointmentRepository;
import com.mss.solar.dashboard.repos.LoadAppointmentStatusRepository;
import com.mss.solar.dashboard.repos.LocationRepository;
import com.mss.solar.dashboard.svcs.LoadAppointmentService;

@RestController
@Validated
public class LoadAppointmentServiceImpl implements LoadAppointmentService {

	private static Logger log = LoggerFactory.getLogger(LoadAppointmentServiceImpl.class);

	@Autowired
	private LoadAppointmentRepository loadAppointmentRepo;

	@Autowired
	private LocationRepository locationRepo;

	@Autowired
	private LoadAppointmentStatusRepository loadAppointmentStatusRepo;

	@Autowired
	private DiscoveryClient discoveryClient;

	@Autowired
	private Utils utils;

	@Value("${addLoadAppointmentEventId}")
	private String addLoadAppointmentEventId;

	@Value("${updateLoadStatusEventId}")
	public String updateLoadStatusEventId;

	@Value("${updateLoadStatusEventIdForDriver}")
	public String updateLoadStatusEventIdForDriver;


	/**
	 * getAllLoadAppointments service implementation
	 * 
	 * @return ServiceResponse<Collection<LoadAppointment>>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointment>> getAllLoadAppointments() {

		log.info("getting all loadAppointments");
		ServiceResponse<Collection<LoadAppointment>> response = new ServiceResponse<>();
		try {
			Collection<LoadAppointment> loadAppointments = loadAppointmentRepo.findAll();
			response.setData(loadAppointments);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS001.name(), EnumTypeForErrorCodes.SCUS001.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * updateLoadAppointment Service implementation
	 * 
	 * @param loadAppointment
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<LoadAppointment> updateLoadAppointment(@Valid @RequestBody LoadAppointment loadAppointment) {

		log.info("update loadAppointment");
		ServiceResponse<LoadAppointment> response = new ServiceResponse<>();
		try {
			LoadAppointment loadAppointmentExists = loadAppointmentRepo.findByApptNbr(loadAppointment.getApptNbr());

			if (loadAppointmentExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS002.name(), EnumTypeForErrorCodes.SCUS002.errorMsg());
			} else if (loadAppointmentExists.getApptStatNbr().getId() == 1) {
				loadAppointment.setGeoStatus(0);
				loadAppointmentExists.setOriginLocNbr(loadAppointment.getOriginLocNbr());
				loadAppointmentExists.setDestLocNbr(loadAppointment.getDestLocNbr());
				loadAppointmentExists.setLastUpdatedTS(loadAppointment.getLastUpdatedTS());
				loadAppointmentExists.setLastUpdatedUser(loadAppointment.getLastUpdatedUser());
				loadAppointmentExists.setScheduledArrivalDate(loadAppointment.getScheduledArrivalDate());
				loadAppointmentExists.setActualArrivalDate(loadAppointment.getActualArrivalDate());
				loadAppointmentExists.setStartDate(loadAppointment.getStartDate());
				loadAppointmentExists.setEndDate(loadAppointment.getEndDate());
				loadAppointmentExists.setCartons(loadAppointment.getCartons());
				loadAppointmentExists.setDriver(loadAppointment.getDriver());
				loadAppointmentExists.setVndNbr(loadAppointment.getVndNbr());
				loadAppointmentExists.setApptTypNbr(loadAppointment.getApptTypNbr());
				loadAppointmentExists.setHighValueLoad(loadAppointment.getHighValueLoad());
				loadAppointmentExists.setHighPriorityLoad(loadAppointment.getHighPriorityLoad());
				loadAppointmentExists.setGeomiles(loadAppointment.getGeomiles());

				LoadAppointment updatedLoadAppointment = loadAppointmentRepo.save(loadAppointment);
				response.setData(updatedLoadAppointment);
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS011.name(), EnumTypeForErrorCodes.SCUS011.errorMsg());
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS003.name(), EnumTypeForErrorCodes.SCUS003.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;

	}

	/**
	 * deleteLoadAppointment Service implementation
	 * 
	 * @param apptNbr
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<LoadAppointment> deleteLoadAppointment(@NotNull @PathVariable String apptNbr) {

		log.info("deleting load");
		ServiceResponse<LoadAppointment> response = new ServiceResponse<>();
		try {
			LoadAppointment loadAppointment = loadAppointmentRepo.findOne(apptNbr);
			if (loadAppointment.getApptStatNbr().getId() == 1) {
				loadAppointmentRepo.delete(loadAppointment);
				response.setData(loadAppointment);
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS011.name(), EnumTypeForErrorCodes.SCUS011.errorMsg());
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS004.name(), EnumTypeForErrorCodes.SCUS004.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * addLoadAppointment Service implementation
	 * 
	 * @param loadAppointment
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<LoadAppointment> addLoadAppointment(@Valid @RequestBody LoadAppointment loadAppointment) {

		log.info("adding load");
		ServiceResponse<LoadAppointment> response = new ServiceResponse<>();
		try {
			LoadAppointment loadExists = loadAppointmentRepo.findByApptNbr(loadAppointment.getApptNbr());
			if (loadExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS005.name(), EnumTypeForErrorCodes.SCUS005.errorMsg());
			} else {
				loadAppointment.setGeoStatus(0);
				loadAppointmentRepo.save(loadAppointment);

				Map<String, String> data = new HashMap<>();
				// 700-1
				data.put("serviceEventId", addLoadAppointmentEventId);
				data.put("loadNum", loadAppointment.getApptNbr());
				notifyAdminService(data, addLoadAppointmentEventId);

				response.setData(loadAppointment);
			}
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS006.name(), EnumTypeForErrorCodes.SCUS006.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * getLoadAppointmentsByDriver Service implementation
	 * 
	 * @param loadAppointment
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointment>> getLoadAppointmentsByDriver(
			@NotNull @PathVariable Long driverId) {

		log.info("getLoadAppointments By Driver");
		ServiceResponse<Collection<LoadAppointment>> response = new ServiceResponse<>();
		try {
			Collection<LoadAppointment> loadAppointments = loadAppointmentRepo.findByDriverId(driverId);
			response.setData(loadAppointments);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS009.name(), EnumTypeForErrorCodes.SCUS009.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * getAllLoadAppointmentsByApptNbr Service implementation
	 * 
	 * @param apptNbr
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<LoadAppointment> getLoadAppointmentsByApptNbr(@NotNull @PathVariable String apptNbr) {

		ServiceResponse<LoadAppointment> response = new ServiceResponse<>();
		try {

			LoadAppointment loadAppointment = loadAppointmentRepo.findOne(apptNbr);
			response.setData(loadAppointment);

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS007.name(), EnumTypeForErrorCodes.SCUS007.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;

	}

	/**
	 * updateLoadStatus Service implementation
	 * 
	 * @param apptNbr
	 * @param status
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<LoadAppointment> updateLoadStatus(@Valid @PathVariable String apptNbr,
			@Valid @PathVariable Long status) {
		ServiceResponse<LoadAppointment> response = new ServiceResponse<>();
		try {
			LoadAppointment loadAppointment = loadAppointmentRepo.findOne(apptNbr);

			if (loadAppointment == null) {
				response.setError(EnumTypeForErrorCodes.SCUS003.name(), EnumTypeForErrorCodes.SCUS003.errorMsg());
			} else {
				LoadAppointmentStatus appointmentStatus = loadAppointmentStatusRepo.findOne(status);
				loadAppointment.setApptStatNbr(appointmentStatus);

				LoadAppointment load1 = loadAppointmentRepo.save(loadAppointment);

				Driver dvr = loadAppointment.getDriver();
				LoadAppointmentStatus loadAppointmentStatus = loadAppointment.getApptStatNbr();
				updateLoadStatus(loadAppointmentStatus.getStatus(), loadAppointment.getApptNbr(), dvr.getFirstName(),
						dvr.getUser().getId());

				response.setData(load1);
			}

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS008.name(), EnumTypeForErrorCodes.SCUS008.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getDriverAcceptedLoads Service implementation
	 * 
	 * @param driverId
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointment>> getDriverAcceptedLoads(Long driverId) {

		log.info("getLoadAppointments which are accepted by Driver");
		ServiceResponse<Collection<LoadAppointment>> response = new ServiceResponse<>();
		try {
			Collection<LoadAppointment> loadAppointments = loadAppointmentRepo.findByDriverIdAndApptStatNbrId(driverId,
					4l);
			response.setData(loadAppointments);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS009.name(), EnumTypeForErrorCodes.SCUS009.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	public void updateLoadStatus(String status, String loadNum, String driver, Long userId) {

		Map<String, String> data = new HashMap<>();
		data.put("loadNum", loadNum);
		data.put("driver", driver);
		switch (status) {
		case "Load Assigned":
			data.put("message", "assigned to");
			notifyService(data, updateLoadStatusEventId, userId);
			break;

		case "Load Accepted":
			data.put("message", "accepted by");
			notifyService(data, updateLoadStatusEventId, userId);
			break;

		case "Load Completed":
			data.put("message", "completed by");
			notifyService(data, updateLoadStatusEventId, userId);
			break;

		default:
		}

	}

	@Async
	public void notifyService(Map<String, String> data, String serviceEventId, Long userId) {

		// Sending email
		try {
			List<ServiceInstance> instances = discoveryClient.getInstances("solar-core");
			String baseURL = instances.get(0).getUri().toString();
			HttpEntity<Map<String, String>> request = new HttpEntity<>(data);
			RestTemplate restTemplate = new RestTemplate();

			String url = baseURL + "api/notifications/notify/" + serviceEventId + "/ADMIN";

			String url1 = baseURL + "api/notifications/notification/" + userId + "/" + updateLoadStatusEventIdForDriver;

			restTemplate.exchange(url1, HttpMethod.POST, request, Map.class);

			restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

		} catch (HttpClientErrorException e) {
			log.error(e.getStatusCode().toString());
		}
	}

	@Async
	public void notifyAdminService(Map<String, String> data, String serviceEventId) {

		// Sending email
		try {
			List<ServiceInstance> instances = discoveryClient.getInstances("solar-core");
			String baseURL = instances.get(0).getUri().toString();
			HttpEntity<Map<String, String>> request = new HttpEntity<>(data);
			RestTemplate restTemplate = new RestTemplate();

			String url = baseURL + "api/notifications/notify/" + serviceEventId + "/admins";

			restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

		} catch (HttpClientErrorException e) {
			log.error(e.getStatusCode().toString());
		}
	}

	/**
	 * getDriverNotCompletedLoads Service implementation
	 * 
	 * @return ServiceResponse<Collection<LoadAppointment>>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointment>> getDriverNotCompletedLoads(@Valid @PathVariable Long driverId) {

		ServiceResponse<Collection<LoadAppointment>> response = new ServiceResponse<>();

		try {
			Collection<LoadAppointment> loadAppointments = loadAppointmentRepo.getDriverNotCompletedLoads(driverId);
			response.setData(loadAppointments);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS010.name(), EnumTypeForErrorCodes.SCUS010.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}

		return response;
	}

	/**
	 * getAcceptedLoadsList Service implementation
	 * 
	 * @return ServiceResponse<Collection<LoadAppointment>>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointment>> getAcceptedLoadsList() {

		log.info("getLoadAppointments which are accepted by Driver");
		ServiceResponse<Collection<LoadAppointment>> response = new ServiceResponse<>();
		try {
			Collection<LoadAppointment> loadAppointments = loadAppointmentRepo.findByApptStatNbrId(4l);
			response.setData(loadAppointments);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS009.name(), EnumTypeForErrorCodes.SCUS009.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * updateHighValue Service implementation
	 * 
	 * @param loadAppt, highValueLoad, highPriorityLoad
	 */
	@Override
	public void updateHighValue(@PathVariable String loadAppt, @PathVariable Integer highValueLoad,
			@PathVariable Integer highPriorityLoad) {
		log.debug("Get loads Controller implementation");

		try {

			LoadAppointment loadAppointment = loadAppointmentRepo.findOne(loadAppt);

			loadAppointment.setHighValueLoad(highValueLoad);
			loadAppointment.setHighPriorityLoad(highPriorityLoad);

			loadAppointmentRepo.save(loadAppointment);

		} catch (Exception e) {
			log.error("Get loads Controller implementation");
		}
	}

	/**
	 * getLoadsBasedOnLocations Service implementation
	 * 
	 * @param locNbr
	 * @return ServiceResponse<Collection<LoadAppointment>>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointment>> getLoadsBasedOnLocations(@NotNull @PathVariable String locNbr) {
		ServiceResponse<Collection<LoadAppointment>> response = new ServiceResponse<>();
		try {
			Collection<LoadAppointment> loadAppointments = loadAppointmentRepo.getLoadsByLocations(locNbr);
			response.setData(loadAppointments);

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS012.name(), EnumTypeForErrorCodes.SCUS012.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * updateGeofenceMiles Service implementation
	 * 
	 * @param apptNbr, geomiles
	 * @return ServiceResponse<LoadAppointment>
	 */
	@Override
	public ServiceResponse<LoadAppointment> updateGeofenceMiles(@Valid @PathVariable String apptNbr,
			@Valid @PathVariable Long geomiles) {

		ServiceResponse<LoadAppointment> response = new ServiceResponse<>();
		try {
			LoadAppointment loadAppointment = loadAppointmentRepo.findOne(apptNbr);

			if (loadAppointment == null) {
				response.setError(EnumTypeForErrorCodes.SCUS002.name(), EnumTypeForErrorCodes.SCUS002.errorMsg());
			} else {
				if (loadAppointment.getApptStatNbr().getId() != 5) {

					loadAppointment.setGeomiles(geomiles);
					loadAppointmentRepo.save(loadAppointment);
					response.setData(loadAppointment);
				} else {
					response.setError(EnumTypeForErrorCodes.SCUS013.name(), EnumTypeForErrorCodes.SCUS013.errorMsg());
				}
			}

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS014.name(), EnumTypeForErrorCodes.SCUS014.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}
	
	/**
	 * getLoadsBasedOnDcManager Service implementation
	 * 
	 * @param email
	 * @return ServiceResponse<Collection<LoadAppointment>>
	 */
	@Override
	public ServiceResponse<Collection<LoadAppointment>> getLoadsBasedOnDcManager(@Email @PathVariable String email) {

		ServiceResponse<Collection<LoadAppointment>> response = new ServiceResponse<>();
		try {

			Location location = locationRepo.findByEmail(email);
			if (location != null) {
				Collection<LoadAppointment> loadAppointments = loadAppointmentRepo
						.getLoadsByLocations(location.getLocNbr());
				response.setData(loadAppointments);
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS015.name(), EnumTypeForErrorCodes.SCUS015.errorMsg());
			}

		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS012.name(), EnumTypeForErrorCodes.SCUS012.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

}
