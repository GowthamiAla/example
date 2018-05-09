package com.mss.solar.core.domain;

import java.time.ZonedDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "otp")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Otp {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private Integer code;

	@ManyToOne
	@JoinColumn(name = "user")
	private User user;
	
	private ZonedDateTime expiryTime;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public ZonedDateTime getExpiryTime() {
		return expiryTime;
	}

	public void setExpiryTime(ZonedDateTime expiryTime) {
		this.expiryTime = expiryTime;
	}

}
