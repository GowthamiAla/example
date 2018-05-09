package com.mss.solar.dashboard.svcs;

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

import com.mss.solar.dashboard.common.RestApiUrlConstants;
import com.mss.solar.dashboard.domain.Driver;
import com.mss.solar.dashboard.model.ServiceResponse;

@RequestMapping(value = "/api/drivers")
public interface DriverService {

	final String MODULE_NAME = "DriverService";

	@GetMapping(RestApiUrlConstants.GET_ALL_DRIVERS)
	@ResponseBody
	ServiceResponse<Collection<Driver>> getAllDrivers();

	@PostMapping(RestApiUrlConstants.ADD_DRIVER)
	@ResponseBody
	ServiceResponse<Driver> addDriver(@Valid @RequestBody Driver driverData);

	@DeleteMapping(RestApiUrlConstants.DELETE_DRIVER)
	@ResponseBody
	ServiceResponse<String> deleteDriver(@NotNull @PathVariable Long id);

	@PutMapping(RestApiUrlConstants.UPDATE_DRIVER)
	@ResponseBody
	ServiceResponse<Driver> updateDriver(@Valid @RequestBody Driver driver);

	@GetMapping(RestApiUrlConstants.GET_DRIVERS_BY_ID)
	@ResponseBody
	ServiceResponse<Driver> getDriverById(@NotNull @PathVariable Long id);

	@PutMapping(RestApiUrlConstants.UPDATE_DRIVER_BY_ID)
	@ResponseBody
	ServiceResponse<Driver> updateDriverById(@NotNull @PathVariable Long driverId,
			@NotNull @PathVariable Double latitude, @NotNull @PathVariable Double longitude);

	@GetMapping(RestApiUrlConstants.GET_DRIVER_BY_USER_ID)
	@ResponseBody
	ServiceResponse<Driver> getDriverByUserId(@NotNull @PathVariable Long userId);

	@GetMapping(RestApiUrlConstants.GET_DRIVERS_BY_VENDOR_NUMBER)
	@ResponseBody
	ServiceResponse<Collection<Driver>> getDriverByVendorNbr(@NotNull @PathVariable String vendorNbr);
}
