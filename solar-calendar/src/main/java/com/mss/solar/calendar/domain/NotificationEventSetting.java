package com.mss.solar.calendar.domain;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "notificationeventsettings")
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationEventSetting {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name="user")
	private User user;
	
	@ManyToOne
	@JoinColumn(name="serviceevent")
	private ServiceEvent serviceEvent;
	
	private Boolean email;
	
	private Boolean sms;
	
	private Boolean notificationCenter;
	
	@ManyToOne
	@JoinColumn(name="email_template")
	private MessageTemplate emailTemplate;
	
	@ManyToOne
	@JoinColumn(name="phone_template")
	private MessageTemplate phoneTemplate;
	
	@ManyToOne
	@JoinColumn(name="notification_template")
	private MessageTemplate notificationTemplate;
	
	@ManyToMany
	@JoinTable(name = "notificationeventsettingrole", joinColumns = @JoinColumn(name = "notificationeventsetting_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> role;

	public Long getId() {
		return id;
	}

	public MessageTemplate getNotificationTemplate() {
		return notificationTemplate;
	}

	public void setNotificationTemplate(MessageTemplate notificationTemplate) {
		this.notificationTemplate = notificationTemplate;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	
	public ServiceEvent getServiceevent() {
		return serviceEvent;
	}

	public void setServiceevent(ServiceEvent serviceevent) {
		this.serviceEvent = serviceevent;
	}

	public Boolean getEmail() {
		return email;
	}

	public void setEmail(Boolean email) {
		this.email = email;
	}

	public Boolean getSms() {
		return sms;
	}

	public void setSms(Boolean sms) {
		this.sms = sms;
	}

	public Boolean getNotificationCenter() {
		return notificationCenter;
	}

	public void setNotificationCenter(Boolean notificationCenter) {
		this.notificationCenter = notificationCenter;
	}

	public MessageTemplate getEmailTemplate() {
		return emailTemplate;
	}

	public void setEmailTemplate(MessageTemplate emailTemplate) {
		this.emailTemplate = emailTemplate;
	}

	public MessageTemplate getPhoneTemplate() {
		return phoneTemplate;
	}

	public void setPhoneTemplate(MessageTemplate phoneTemplate) {
		this.phoneTemplate = phoneTemplate;
	}
	
	public Set<Role> getRole() {
		return role;
	}

	public void setRole(Set<Role> roles) {
		this.role = roles;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((email == null) ? 0 : email.hashCode());
		result = prime * result + ((emailTemplate == null) ? 0 : emailTemplate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((notificationCenter == null) ? 0 : notificationCenter.hashCode());
		result = prime * result + ((notificationTemplate == null) ? 0 : notificationTemplate.hashCode());
		result = prime * result + ((phoneTemplate == null) ? 0 : phoneTemplate.hashCode());
		result = prime * result + ((role == null) ? 0 : role.hashCode());
		result = prime * result + ((serviceEvent == null) ? 0 : serviceEvent.hashCode());
		result = prime * result + ((sms == null) ? 0 : sms.hashCode());
		result = prime * result + ((user == null) ? 0 : user.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		NotificationEventSetting other = (NotificationEventSetting) obj;
		if (email == null) {
			if (other.email != null)
				return false;
		} else if (!email.equals(other.email))
			return false;
		if (emailTemplate == null) {
			if (other.emailTemplate != null)
				return false;
		} else if (!emailTemplate.equals(other.emailTemplate))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (notificationCenter == null) {
			if (other.notificationCenter != null)
				return false;
		} else if (!notificationCenter.equals(other.notificationCenter))
			return false;
		if (notificationTemplate == null) {
			if (other.notificationTemplate != null)
				return false;
		} else if (!notificationTemplate.equals(other.notificationTemplate))
			return false;
		if (phoneTemplate == null) {
			if (other.phoneTemplate != null)
				return false;
		} else if (!phoneTemplate.equals(other.phoneTemplate))
			return false;
		if (role == null) {
			if (other.role != null)
				return false;
		} else if (!role.equals(other.role))
			return false;
		if (serviceEvent == null) {
			if (other.serviceEvent != null)
				return false;
		} else if (!serviceEvent.equals(other.serviceEvent))
			return false;
		if (sms == null) {
			if (other.sms != null)
				return false;
		} else if (!sms.equals(other.sms))
			return false;
		if (user == null) {
			if (other.user != null)
				return false;
		} else if (!user.equals(other.user))
			return false;
		return true;
	}

}
