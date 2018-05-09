package com.mss.solar.dashboard.domain;

import java.time.ZonedDateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "loadappointment")
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoadAppointment {
	
	@Id
	private String apptNbr;
	
	@ManyToOne
	@JoinColumn(name="originLocNbr")
	private Location originLocNbr;
	
	@ManyToOne
	@JoinColumn(name="destLocNbr")
	private Location destLocNbr;
	
	private ZonedDateTime createdTS;
	
	@ManyToOne
	@JoinColumn(name="createdUser")
	private User createdUser;
	
	private ZonedDateTime lastUpdatedTS;
	
	@ManyToOne
	@JoinColumn(name="lastUpdatedUser")
	private User lastUpdatedUser;
	
	private ZonedDateTime scheduledArrivalDate;
	
	private ZonedDateTime actualArrivalDate;
	
	private ZonedDateTime startDate;
	
	private ZonedDateTime endDate;
	
	private Integer cartons;
	
	@ManyToOne
	@JoinColumn(name="driver")
	private Driver driver;
	
	@ManyToOne
	@JoinColumn(name="vndNbr")
	private Vendor vndNbr;
	
	@ManyToOne
	@JoinColumn(name="apptTypNbr")
	private LoadAppointmentType apptTypNbr;
	
	@ManyToOne
	@JoinColumn(name="apptStatNbr")
	private LoadAppointmentStatus apptStatNbr;
	
	private Integer highValueLoad;
	
	private Integer highPriorityLoad;
	
	private double geomiles;
	
	private Integer geoStatus;

	public double getGeomiles() {
		return geomiles;
	}

	public void setGeomiles(double geomiles) {
		this.geomiles = geomiles;
	}

	public String getApptNbr() {
		return apptNbr;
	}

	public void setApptNbr(String apptNbr) {
		this.apptNbr = apptNbr;
	}

	public Location getOriginLocNbr() {
		return originLocNbr;
	}

	public void setOriginLocNbr(Location originLocNbr) {
		this.originLocNbr = originLocNbr;
	}

	public Location getDestLocNbr() {
		return destLocNbr;
	}

	public void setDestLocNbr(Location destLocNbr) {
		this.destLocNbr = destLocNbr;
	}

	public ZonedDateTime getCreatedTS() {
		return createdTS;
	}

	public void setCreatedTS(ZonedDateTime createdTS) {
		this.createdTS = createdTS;
	}

	public User getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(User createdUser) {
		this.createdUser = createdUser;
	}

	public ZonedDateTime getLastUpdatedTS() {
		return lastUpdatedTS;
	}

	public void setLastUpdatedTS(ZonedDateTime lastUpdatedTS) {
		this.lastUpdatedTS = lastUpdatedTS;
	}

	public User getLastUpdatedUser() {
		return lastUpdatedUser;
	}

	public void setLastUpdatedUser(User lastUpdatedUser) {
		this.lastUpdatedUser = lastUpdatedUser;
	}

	public ZonedDateTime getScheduledArrivalDate() {
		return scheduledArrivalDate;
	}

	public void setScheduledArrivalDate(ZonedDateTime scheduledArrivalDate) {
		this.scheduledArrivalDate = scheduledArrivalDate;
	}

	public ZonedDateTime getActualArrivalDate() {
		return actualArrivalDate;
	}

	public void setActualArrivalDate(ZonedDateTime actualArrivalDate) {
		this.actualArrivalDate = actualArrivalDate;
	}

	public ZonedDateTime getStartDate() {
		return startDate;
	}

	public void setStartDate(ZonedDateTime startDate) {
		this.startDate = startDate;
	}

	public ZonedDateTime getEndDate() {
		return endDate;
	}

	public void setEndDate(ZonedDateTime endDate) {
		this.endDate = endDate;
	}

	public Integer getCartons() {
		return cartons;
	}

	public void setCartons(Integer cartons) {
		this.cartons = cartons;
	}

	public Driver getDriver() {
		return driver;
	}

	public void setDriver(Driver driver) {
		this.driver = driver;
	}

	public Vendor getVndNbr() {
		return vndNbr;
	}

	public void setVndNbr(Vendor vndNbr) {
		this.vndNbr = vndNbr;
	}

	public LoadAppointmentType getApptTypNbr() {
		return apptTypNbr;
	}

	public void setApptTypNbr(LoadAppointmentType apptTypNbr) {
		this.apptTypNbr = apptTypNbr;
	}

	public LoadAppointmentStatus getApptStatNbr() {
		return apptStatNbr;
	}

	public void setApptStatNbr(LoadAppointmentStatus apptStatNbr) {
		this.apptStatNbr = apptStatNbr;
	}

	public Integer getHighValueLoad() {
		return highValueLoad;
	}

	public void setHighValueLoad(Integer highValueLoad) {
		this.highValueLoad = highValueLoad;
	}

	public Integer getHighPriorityLoad() {
		return highPriorityLoad;
	}

	public void setHighPriorityLoad(Integer highPriorityLoad) {
		this.highPriorityLoad = highPriorityLoad;
	}
	
	public Integer getGeoStatus() {
		return geoStatus;
	}

	public void setGeoStatus(Integer geoStatus) {
		this.geoStatus = geoStatus;
	}

}
