package com.mss.solar.calendar.domain;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "role")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Role {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Size(min = 4, max = 15)
	private String name;
	
	@JsonIgnore
	@ManyToMany(mappedBy = "roles")
	private Set<User> users;
	
	@JsonIgnore
	@ManyToMany(mappedBy = "role")
	private Set<Widget> widget;

	@JsonIgnore
	@ManyToMany(mappedBy = "roles")
	private Set<User> notificationEventSettings;
	
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

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}
	
	public Set<Widget> getWidget() {
		return widget;
	}

	public void setWidget(Set<Widget> widget) {
		this.widget = widget;
	}

	public Set<User> getNotificationEventSettings() {
		return notificationEventSettings;
	}

	public void setNotificationEventSettings(Set<User> notificationEventSettings) {
		this.notificationEventSettings = notificationEventSettings;
	}
}
