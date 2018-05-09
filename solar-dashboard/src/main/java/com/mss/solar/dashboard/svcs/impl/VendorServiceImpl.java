package com.mss.solar.dashboard.svcs.impl;

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

import com.mss.solar.dashboard.common.EnumTypeForErrorCodes;
import com.mss.solar.dashboard.common.Utils;
import com.mss.solar.dashboard.domain.LoadAppointment;
import com.mss.solar.dashboard.domain.User;
import com.mss.solar.dashboard.domain.Vendor;
import com.mss.solar.dashboard.model.ServiceResponse;
import com.mss.solar.dashboard.repos.LoadAppointmentRepository;
import com.mss.solar.dashboard.repos.UserRepository;
import com.mss.solar.dashboard.repos.VendorRepository;
import com.mss.solar.dashboard.svcs.VendorService;

@RestController
@Validated
public class VendorServiceImpl implements VendorService {

	private static Logger log = LoggerFactory.getLogger(VendorServiceImpl.class);

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private LoadAppointmentRepository loadRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private Utils utils;

	/**
	 * getVendors service implementation
	 * 
	 * @return ServiceResponse<Collection<Vendor>>
	 */
	@Override
	public ServiceResponse<Collection<Vendor>> getVendors() {

		log.info("getting all vendors");
		ServiceResponse<Collection<Vendor>> response = new ServiceResponse<>();
		try {
			Collection<Vendor> vendors = vendorRepo.findAll();
			response.setData(vendors);
		} catch (Exception e) {
			response.setError(EnumTypeForErrorCodes.SCUS501.name(), EnumTypeForErrorCodes.SCUS501.errorMsg());
			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * addVendor Service Implementation
	 * 
	 * @RequestBody vendorData
	 * @return ServiceResponse<Vendor>
	 */
	@Override
	public ServiceResponse<Vendor> addVendor(@Valid @RequestBody Vendor vendor) {

		log.debug("Adding  new Vendor details");

		ServiceResponse<Vendor> response = new ServiceResponse<>();
		try {
			Vendor vendorExists = vendorRepo.findByVendorNbr(vendor.getVendorNbr());

			User userEmailExists = userRepo.findByEmail(vendor.getEmail());
			User userPhoneExists = userRepo.findByPhone(vendor.getPhoneNumber());
			Vendor vendorEmailExists = vendorRepo.findByEmail(vendor.getEmail());
			Vendor vendorPnoneNumberExists = vendorRepo.findByPhoneNumber(vendor.getPhoneNumber());

			if (vendorExists != null) {
				response.setError(EnumTypeForErrorCodes.SCUS502.name(), EnumTypeForErrorCodes.SCUS502.errorMsg());
			} else {
				if (vendorEmailExists != null || userEmailExists != null) {
					response.setError(EnumTypeForErrorCodes.SCUS109.name(), EnumTypeForErrorCodes.SCUS109.errorMsg());
				} else if (vendorPnoneNumberExists != null || userPhoneExists != null) {
					response.setError(EnumTypeForErrorCodes.SCUS509.name(), EnumTypeForErrorCodes.SCUS509.errorMsg());
				} else {
					Vendor vendorData = vendorRepo.save(vendor);

					response.setData(vendorData);
				}
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS503.name(), EnumTypeForErrorCodes.SCUS503.errorMsg());
			log.error(utils.toJson(response.getError()), exception);

		}
		return response;
	}

	/**
	 * deleteVendor Service Implementation
	 * 
	 * @param vendorNbr
	 * @return ServiceResponse<Vendor>
	 */
	@Override
	public ServiceResponse<String> deleteVendor(@NotNull @PathVariable("vendorNbr") String vendorNbr) {

		log.debug("Delete vendor");
		ServiceResponse<String> response = new ServiceResponse<>();
		try {
			Vendor vendorDetails = vendorRepo.findByVendorNbr(vendorNbr);
			Collection<LoadAppointment> loadDetails = loadRepo.findByVndNbr(vendorDetails);
			if (loadDetails.isEmpty()) {
				vendorRepo.delete(vendorDetails);
				response.setData("Vendor deleted successfully");
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS504.name(), EnumTypeForErrorCodes.SCUS504.errorMsg());
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS505.name(), EnumTypeForErrorCodes.SCUS505.errorMsg());
			log.error(utils.toJson(response.getError()), exception);

		}
		return response;
	}

	/**
	 * updateVendor Service Implementation
	 * 
	 * @RequestBody vendor
	 * @return ServiceResponse<Vendor>
	 */
	@Override
	public ServiceResponse<Vendor> updateVendor(@Valid @RequestBody Vendor vendor) {
		log.debug("Update vendor details");
		ServiceResponse<Vendor> response = new ServiceResponse<>();
		try {
			Vendor vendorExists = vendorRepo.findByVendorNbr(vendor.getVendorNbr());
			User userPhoneExists = userRepo.findByPhone(vendor.getPhoneNumber());
			Vendor vendorPhoneNumberExists = vendorRepo.findByPhoneNumber(vendor.getPhoneNumber());

			if (vendorExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS506.name(), EnumTypeForErrorCodes.SCUS506.errorMsg());
			} else {
				Collection<LoadAppointment> vendorDetails = loadRepo.findByVndNbr(vendorExists);

				if ((vendorDetails.size() == 0) || vendor.equals(vendorExists)) {
					if (userPhoneExists != null) {
						response.setError(EnumTypeForErrorCodes.SCUS509.name(),
								EnumTypeForErrorCodes.SCUS509.errorMsg());
					} else {

						vendorExists.setVendorName(vendor.getVendorName());
						vendorExists.setEmail(vendor.getEmail());
						vendorExists.setAddress(vendor.getAddress());
						vendorExists.setState(vendor.getState());
						vendorExists.setCity(vendor.getCity());
						vendorExists.setCountry(vendor.getCountry());
						vendorExists.setZipCode(vendor.getZipCode());

					if (vendorPhoneNumberExists == null
							|| (vendorPhoneNumberExists.getVendorNbr()).equals(vendor.getVendorNbr())) {
						vendorExists.setPhoneNumber(vendor.getPhoneNumber());
						Vendor vendorData = vendorRepo.save(vendorExists);

						response.setData(vendorData);

					} else {
						response.setError(EnumTypeForErrorCodes.SCUS510.name(),
								EnumTypeForErrorCodes.SCUS510.errorMsg());
					}

					}
				} else {
					response.setError(EnumTypeForErrorCodes.SCUS604.name(), EnumTypeForErrorCodes.SCUS604.errorMsg());
				}
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS507.name(), EnumTypeForErrorCodes.SCUS507.errorMsg());
			log.error(utils.toJson(response.getError()), exception);

		}
		return response;
	}

	/**
	 * getvendorByNumber Service Implementation
	 * 
	 * @param vendorNbr
	 * @return ServiceResponse<Vendor>
	 */
	@Override
	public ServiceResponse<Vendor> getvendorByNumber(@NotNull @PathVariable("vendorNbr") String vendorNbr) {

		log.debug("Get the vendor details by number");
		ServiceResponse<Vendor> response = new ServiceResponse<>();
		try {
			Vendor vendorExists = vendorRepo.findByVendorNbr(vendorNbr);
			response.setData(vendorExists);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS508.name(), EnumTypeForErrorCodes.SCUS508.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}
}
