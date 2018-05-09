package com.mss.solar.dashboard.domain;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.mss.solar.dashboard.common.MessageTemplateType;

@Entity
@Table(name="notificationevent")
public class NotificationEvent {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name="user")
	private User user;
	
	@ManyToOne
	@JoinColumn(name="serviceevent")
	private ServiceEvent serviceevent;
	
	@Column(columnDefinition="LONGTEXT")
 	private String notificationContext;
 	
 	private ZonedDateTime lastUpdateTime;
 	
 	private Integer readStatus;
 	
 	private MessageTemplateType type;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public MessageTemplateType getType() {
		return type;
	}

	public void setType(MessageTemplateType type) {
		this.type = type;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public ServiceEvent getServiceevent() {
		return serviceevent;
	}

	public void setServiceevent(ServiceEvent serviceevent) {
		this.serviceevent = serviceevent;
	}

	public String getNotificationContext() {
		return notificationContext;
	}

	public void setNotificationContext(String notificationContext) {
		this.notificationContext = notificationContext;
	}

	public ZonedDateTime getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(ZonedDateTime lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

	public Integer getReadStatus() {
		return readStatus;
	}

	public void setReadStatus(Integer readStatus) {
		this.readStatus = readStatus;
	}
	
}
