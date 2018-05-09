package com.mss.solar.dashboard.svcs.impl;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mss.solar.dashboard.common.EnumTypeForErrorCodes;
import com.mss.solar.dashboard.common.Utils;
import com.mss.solar.dashboard.domain.Driver;
import com.mss.solar.dashboard.domain.LoadAppointment;
import com.mss.solar.dashboard.domain.Role;
import com.mss.solar.dashboard.domain.User;
import com.mss.solar.dashboard.domain.Vendor;
import com.mss.solar.dashboard.model.ServiceResponse;
import com.mss.solar.dashboard.repos.DriverRepository;
import com.mss.solar.dashboard.repos.LoadAppointmentRepository;
import com.mss.solar.dashboard.repos.UserRepository;
import com.mss.solar.dashboard.repos.VendorRepository;
import com.mss.solar.dashboard.svcs.DriverService;

@RestController
@Validated
public class DriverServiceImpl implements DriverService {

	private static final Logger log = Logger.getLogger(DriverServiceImpl.class);

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private DriverRepository driverRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private LoadAppointmentRepository loadAppointmentRepo;

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private DiscoveryClient discoveryClient;

	@Autowired
	private Utils utils;

	/**
	 * getAllDrivers Service Implementation
	 * 
	 * @return ServiceResponse<Collection<Driver>>
	 */
	@Override
	public ServiceResponse<Collection<Driver>> getAllDrivers() {
		log.debug("Getting all driver details");
		ServiceResponse<Collection<Driver>> response = new ServiceResponse<>();
		try {
			List<Driver> driver = driverRepo.findAll();
			response.setData(driver);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS101.name(), EnumTypeForErrorCodes.SCUS101.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * addDriver Service Implementation
	 * 
	 * @param driver
	 * @return ServiceResponse<Driver>
	 */
	@Override
	public ServiceResponse<Driver> addDriver(@Valid @RequestBody Driver driver) {

		log.debug("Adding  new driver");

		ServiceResponse<Driver> response = new ServiceResponse<>();
		try {

			User driverExists = userRepo.findByEmail(driver.getEmail());
			User phoneExists = userRepo.findByPhone(driver.getPhoneNumber());

			Vendor vendorEmailExists = vendorRepo.findByEmail(driver.getEmail());

			Vendor vendoPhoneNumberExists = vendorRepo.findByPhoneNumber(driver.getPhoneNumber());

			if (driverExists != null || vendorEmailExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS109.name(), EnumTypeForErrorCodes.SCUS109.errorMsg());
			} else if (phoneExists != null || vendoPhoneNumberExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS311.name(), EnumTypeForErrorCodes.SCUS311.errorMsg());
			} else {

					String password = driver.getPassword();
					driver.setPassword(bCryptPasswordEncoder.encode(password));

					List<ServiceInstance> instances = discoveryClient.getInstances("solar-core");

					String baseURL = instances.get(0).getUri().toString();

					baseURL = baseURL + "api/users/addUser/";

					RestTemplate restTemplate = new RestTemplate();
					User user = new User();

					user.setEmail(driver.getEmail());
					user.setActive(true);
					user.setName(driver.getFirstName());
					user.setPhone(driver.getPhoneNumber());

					Role role = new Role();
					role.setName("DRIVER");
					user.setRoles(new HashSet<Role>(Arrays.asList(role)));

					HttpEntity<User> reqEntity = new HttpEntity<>(user);

					ResponseEntity<String> result = restTemplate.exchange(baseURL, HttpMethod.POST, reqEntity,
							String.class);

					Object obj = result.getBody();

					String stringResult = obj.toString();

					ObjectMapper mapper = new ObjectMapper();

					ServiceResponse userDetails = mapper.readValue(stringResult, ServiceResponse.class);

					User userObj = mapper.convertValue(userDetails.getData(), User.class);
					driver.setUser(userObj);

					Driver driverData = driverRepo.save(driver);

					response.setData(driverData);
				}
			
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS103.name(), EnumTypeForErrorCodes.SCUS103.errorMsg());
			log.error(utils.toJson(response.getError()), exception);

		}
		return response;
	}

	/**
	 * deleteDriver Service Implementation
	 * 
	 * @param id
	 * @return ServiceResponse<Driver>
	 */
	@Override
	public ServiceResponse<String> deleteDriver(@NotNull @PathVariable Long id) {

		log.debug("Delete driver");
		ServiceResponse<String> response = new ServiceResponse<>();
		try {
			Driver driverDetails = driverRepo.findById(id);
			Long userId = driverDetails.getUser().getId();
			Collection<LoadAppointment> loadDetails = loadAppointmentRepo.findByDriverId(id);

			if (loadDetails.isEmpty()) {
				driverRepo.delete(driverDetails);

				List<ServiceInstance> instances = discoveryClient.getInstances("solar-core");

				String baseURL = instances.get(0).getUri().toString();
				baseURL = baseURL + "api/users/deleteUser/" + userId;

				RestTemplate restTemplate = new RestTemplate();

				restTemplate.exchange(baseURL, HttpMethod.GET, null, String.class);

				response.setData("Driver deleted successfully");

			} else {
				response.setError(EnumTypeForErrorCodes.SCUS108.name(), EnumTypeForErrorCodes.SCUS108.errorMsg());
			}

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS104.name(), EnumTypeForErrorCodes.SCUS104.errorMsg());
			log.error(utils.toJson(response.getError()), exception);

		}
		return response;
	}

	/**
	 * updateDriver Service Implementation
	 * 
	 * @param driver
	 * @return ServiceResponse<Driver>
	 */
	@Override
	public ServiceResponse<Driver> updateDriver(@Valid @RequestBody Driver driver) {

		log.debug("Update driver");
		ServiceResponse<Driver> response = new ServiceResponse<>();
		try {
			Driver driverExists = driverRepo.findById(driver.getId());
			User phoneExists = userRepo.findByPhone(driver.getPhoneNumber());
			Vendor vendoPhoneNumberExists =vendorRepo.findByPhoneNumber(driver.getPhoneNumber());
			
			if (driverExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS105.name(), EnumTypeForErrorCodes.SCUS105.errorMsg());
			} else {
				if ((phoneExists == null || phoneExists.getId() == driverExists.getUser().getId()) && vendoPhoneNumberExists == null) {

					
				driverExists.setFirstName(driver.getFirstName());
				driverExists.setLastName(driver.getLastName());
				driverExists.setEmail(driver.getEmail());
				driverExists.setPhoneNumber(driver.getPhoneNumber().trim());
				driverExists.setLicenseNumber(driver.getLicenseNumber());
				driverExists.setLicenseExpiryDate(driver.getLicenseExpiryDate());
				driverExists.setVendor(driver.getVendor());

				String password = driver.getPassword();
				driverExists.setPassword(bCryptPasswordEncoder.encode(password));
				driverExists.setDateOfBirth(driver.getDateOfBirth());

				List<ServiceInstance> instances = discoveryClient.getInstances("solar-core");

				String baseURL = instances.get(0).getUri().toString();

				baseURL = baseURL + "api/users/updateUser/";

				RestTemplate restTemplate = new RestTemplate();
				User user = new User();
				user.setEmail(driver.getEmail());
				user.setActive(true);
				user.setName(driver.getFirstName());
				user.setPhone(driver.getPhoneNumber());

				Role role = new Role();
				role.setName("DRIVER");
				user.setRoles(new HashSet<Role>(Arrays.asList(role)));

				HttpEntity<User> reqEntity = new HttpEntity<>(user);

				ResponseEntity<String> result = restTemplate.exchange(baseURL, HttpMethod.PUT, reqEntity, String.class);

				Object obj = result.getBody();

				String stringResult = obj.toString();

				ObjectMapper mapper = new ObjectMapper();

				ServiceResponse userDetails = mapper.readValue(stringResult, ServiceResponse.class);

				User userObj = mapper.convertValue(userDetails.getData(), User.class);

				User userResult = new User();
				userResult.setEmail(userObj.getEmail());
				userResult.setId(userObj.getId());
				userResult.setName(userObj.getName());
				userResult.setPhone(userObj.getPhone());

				Role updateRole = new Role();
				updateRole.setName("DRIVER");
				userResult.setRoles(new HashSet<Role>(Arrays.asList(updateRole)));

				driverExists.setUser(userObj);

				Driver driverData = driverRepo.save(driverExists);

				response.setData(driverData);
				}else{
					response.setError(EnumTypeForErrorCodes.SCUS311.name(), EnumTypeForErrorCodes.SCUS311.errorMsg());
				}
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS106.name(), EnumTypeForErrorCodes.SCUS106.errorMsg());
			log.error(utils.toJson(response.getError()), exception);

		}
		return response;
	}

	/**
	 * getDriverById Service Implementation
	 * 
	 * @param driverId
	 * @return ServiceResponse<Driver>
	 */
	@Override
	public ServiceResponse<Driver> getDriverById(@NotNull @PathVariable Long id) {

		log.debug("Get the driver by id");
		ServiceResponse<Driver> response = new ServiceResponse<>();
		try {
			Driver driverDetails = driverRepo.findById(id);
			response.setData(driverDetails);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS107.name(), EnumTypeForErrorCodes.SCUS107.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * updateDriverById Service Implementation
	 * 
	 * @param id,latitude,longitude
	 * @return ServiceResponse<Driver>
	 */
	@Override
	public ServiceResponse<Driver> updateDriverById(@NotNull @PathVariable Long driverId,
			@NotNull @PathVariable Double latitude, @NotNull @PathVariable Double longitude) {
		log.debug("update the driver by id");
		ServiceResponse<Driver> response = new ServiceResponse<>();
		try {
			Driver driverExists = driverRepo.findById(driverId);
			if (driverExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS105.name(), EnumTypeForErrorCodes.SCUS105.errorMsg());
			} else {

				driverExists.setLatitude(latitude);
				driverExists.setLongitude(longitude);

				Driver driverData = driverRepo.save(driverExists);
				response.setData(driverData);
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS106.name(), EnumTypeForErrorCodes.SCUS106.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getDriverByUserId Service Implementation
	 * 
	 * @param userId
	 * @return ServiceResponse<Driver>
	 */
	@Override
	public ServiceResponse<Driver> getDriverByUserId(@NotNull @PathVariable Long userId) {

		log.debug("Get the driver by id");
		ServiceResponse<Driver> response = new ServiceResponse<>();
		try {
			Driver driverDetails = driverRepo.findByUserId(userId);
			response.setData(driverDetails);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS107.name(), EnumTypeForErrorCodes.SCUS107.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getDriverByVendorNbr Service Implementation
	 * 
	 * @param vendorNbr
	 * @return ServiceResponse<Collection<Driver>>
	 */
	@Override
	public ServiceResponse<Collection<Driver>> getDriverByVendorNbr(@NotNull @PathVariable String vendorNbr) {
		
		log.debug("Get the driver by vendor number");
		ServiceResponse<Collection<Driver>> response = new ServiceResponse<>();
		try {
			
			Vendor vendor = vendorRepo.findByVendorNbr(vendorNbr);
			
			Collection<Driver> driverDetails = driverRepo.getDriversByVndNbr(vendor.getVendorNbr());
			
			response.setData(driverDetails);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS110.name(), EnumTypeForErrorCodes.SCUS110.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

}
