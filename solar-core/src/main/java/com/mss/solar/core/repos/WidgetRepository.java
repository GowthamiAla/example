package com.mss.solar.core.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.core.domain.Widget;

public interface WidgetRepository extends JpaRepository<Widget, Long> {

	Widget findById(Long id);
	Widget findByName(String name);
}
