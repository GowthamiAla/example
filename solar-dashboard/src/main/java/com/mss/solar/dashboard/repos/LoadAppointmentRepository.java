package com.mss.solar.dashboard.repos;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mss.solar.dashboard.domain.LoadAppointment;
import com.mss.solar.dashboard.domain.Location;
import com.mss.solar.dashboard.domain.Vendor;

public interface LoadAppointmentRepository extends JpaRepository<LoadAppointment, String>{
	
	LoadAppointment findByApptNbr(String apptNbr);
	
	Collection<LoadAppointment> findByDriverId(Long driverId);

	Collection<LoadAppointment> findByDriverIdAndApptStatNbrId(Long driverId, Long status);
	
	@Query("SELECT l FROM LoadAppointment l where l.apptStatNbr IN (2,3,4) AND l.driver.id=?1")
	Collection<LoadAppointment> getDriverNotCompletedLoads(Long driverId);
	
	Collection<LoadAppointment> findByApptStatNbrId(Long status);
	

	@Query("SELECT l FROM LoadAppointment l where l.destLocNbr.locNbr = ?1")
	Collection<LoadAppointment> getLoadsByLocations(String locNbr);
	
	Collection<LoadAppointment> findByVndNbr(Vendor vndNbr);
	
	Collection<LoadAppointment> findByDestLocNbr( Location destLocNbr);
	
	Collection<LoadAppointment> findByOriginLocNbr(Location originLocNbr);

	@Query("SELECT l FROM LoadAppointment l where l.destLocNbr.locNbr = ?1 OR l.originLocNbr.locNbr = ?1")
	Collection<LoadAppointment> getLoadsByOriginLocNbrOrDestLocNbr(String locNbr);

	

	
}
