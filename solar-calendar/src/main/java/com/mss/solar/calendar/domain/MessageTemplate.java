package com.mss.solar.calendar.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mss.solar.calendar.common.MessageTemplateType;

@Entity
@Table(name = "template")
@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageTemplate {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Size(min=5, max=25)
	private String name;
	
	private MessageTemplateType type;
	
	@Column(columnDefinition="LONGTEXT")
	private  String content;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public MessageTemplateType getType() {
		return type;
	}

	public void setType(MessageTemplateType type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
