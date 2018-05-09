package com.mss.solar.dashboard.repos;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mss.solar.dashboard.domain.Analytics;

public interface AnalyticsRepository extends JpaRepository<Analytics, String> {

	@Query("SELECT analytics from Analytics analytics WHERE analytics.scheduledArrivalDate >= ?1 AND analytics.scheduledArrivalDate <= ?2")
	Collection<Analytics> getAnalyticsData(String startDate, String endDate);

	Collection<Analytics> findAllByvndNameAndDestinationIn(String vendorName, Collection<String> destination);
	
	Collection<Analytics> findByvndName(String vendorName);

}
