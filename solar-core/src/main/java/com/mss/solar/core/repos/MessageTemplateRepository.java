package com.mss.solar.core.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.core.domain.MessageTemplate;


public interface  MessageTemplateRepository extends JpaRepository<MessageTemplate, Long>
{
	MessageTemplate findById(Long id);
	
	MessageTemplate findByName(String name);
}
