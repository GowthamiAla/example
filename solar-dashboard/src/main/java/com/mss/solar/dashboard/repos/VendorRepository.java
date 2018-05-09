package com.mss.solar.dashboard.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.dashboard.domain.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

	Vendor findByVendorNbr(String vendorNbr);

	Vendor findByEmail(String email);

	Vendor findByPhoneNumber(String phoneNumber);

}
