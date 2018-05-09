package com.mss.solar.calendar.domain;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mss.solar.calendar.model.CalendarPriorityType;

@Entity
@Table(name = "calendarevent")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CalendarEvent extends Properties {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(columnDefinition = "varchar(256)")
	private String title;

	@Column(columnDefinition = "varchar(1000)")
	private String description;

	private CalendarPriorityType priority;

	private String eventType;

	private Boolean active;

	private ZonedDateTime start;

	private ZonedDateTime end;

	@ManyToOne
	@JoinColumn(name = "createdUser")
	private User createdUser;

	@ManyToOne
	@JoinColumn(name = "lastUpdatedUser")
	private User lastUpdatedUser;

	public User getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(User createdUser) {
		this.createdUser = createdUser;
	}

	public User getLastUpdatedUser() {
		return lastUpdatedUser;
	}

	public void setLastUpdatedUser(User lastUpdatedUser) {
		this.lastUpdatedUser = lastUpdatedUser;
	}

	private ZonedDateTime createTime;

	private ZonedDateTime lastUpdateTime;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public CalendarPriorityType getPriority() {
		return priority;
	}

	public void setPriority(CalendarPriorityType priority) {
		this.priority = priority;
	}

	public String getEventType() {
		return eventType;
	}

	public void setEventType(String eventType) {
		this.eventType = eventType;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public ZonedDateTime getStart() {
		return start;
	}

	public void setStart(ZonedDateTime start) {
		this.start = start;
	}

	public ZonedDateTime getEnd() {
		return end;
	}

	public void setEnd(ZonedDateTime end) {
		this.end = end;
	}

	public ZonedDateTime getCreateTime() {
		return createTime;
	}

	public void setCreateTime(ZonedDateTime createTime) {
		this.createTime = createTime;
	}

	public ZonedDateTime getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(ZonedDateTime lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

}
