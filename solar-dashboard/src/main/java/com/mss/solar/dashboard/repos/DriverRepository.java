package com.mss.solar.dashboard.repos;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mss.solar.dashboard.domain.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long> {

	Driver findByEmail(String email);

	Driver findById(Long id);

	Driver findByIdAndEmail(Long id, String email);

	Driver findByUserId(Long userId);

	@Query("SELECT d FROM Driver d where d.vendor.vendorNbr = ?1")
	Collection<Driver> getDriversByVndNbr(String vendorNbr);

}
