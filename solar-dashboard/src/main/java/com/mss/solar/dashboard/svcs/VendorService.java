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
import com.mss.solar.dashboard.domain.Vendor;
import com.mss.solar.dashboard.model.ServiceResponse;

@RequestMapping(value = "/api/vendors")
public interface VendorService {

	final String MODULE_NAME = "VendorService";

	@GetMapping(RestApiUrlConstants.GET_ALL_VENDORS)
	@ResponseBody
	ServiceResponse<Collection<Vendor>> getVendors();

	@PostMapping(RestApiUrlConstants.ADD_VENDOR)
	@ResponseBody
	ServiceResponse<Vendor> addVendor(@Valid @RequestBody Vendor vendor);

	@DeleteMapping(RestApiUrlConstants.DELETE_VENDOR)
	@ResponseBody
	ServiceResponse<String> deleteVendor(@NotNull @PathVariable("vendorNbr") String vendorNbr);

	@PutMapping(RestApiUrlConstants.UPDATE_VENDOR)
	@ResponseBody
	ServiceResponse<Vendor> updateVendor(@Valid @RequestBody Vendor vendorData);

	@GetMapping(RestApiUrlConstants.GET_VENDOR_BY_NUMBER)
	@ResponseBody
	ServiceResponse<Vendor> getvendorByNumber(@NotNull @PathVariable("vendorNbr") String vendorNbr);

}
