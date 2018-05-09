package com.mss.solar.core.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.core.domain.ServiceEvent;

public interface ServiceEventRepository extends JpaRepository<ServiceEvent, Long>{

	ServiceEvent findByCode(String code);

	ServiceEvent findByEvent(String event);

	ServiceEvent findByCodeAndEvent(String code, String event);

	ServiceEvent findById(Long id);


}
