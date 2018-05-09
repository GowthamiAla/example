package com.mss.solar.dashboard.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "analytics")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Analytics {
	
	@Id
	private String apptNbr;	
	private String destination;
	private String createDate;
	private String scheduledArrivalDate;
	private String actualArrivalDate;
	private String fullCreateDate;
	private String fullSchedDate;
	private String fullActualDate;
	private String appointmentStatus;
	private String cartons;
	private String locnName;
	private String address;
	private String city;
	private String state;
	private String zipCode;
	private String trlrNbr;
	private String frgtTypNbr;
	private String yardNbr;
	private String yardAreaNbr;
	private String vndNbr;
	private String vndName;
	private String scac;
	private String carrierTypNbr;
	private String destLocNbr;
	private String apptTypNbr;
	private String createUseridV;
	private String highValue;
	private String highPriority;
	private String latitude;
	private String longitude;

	public String getApptNbr() {
		return apptNbr;
	}

	public void setApptNbr(String apptNbr) {
		this.apptNbr = apptNbr;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getScheduledArrivalDate() {
		return scheduledArrivalDate;
	}

	public void setScheduledArrivalDate(String scheduledArrivalDate) {
		this.scheduledArrivalDate = scheduledArrivalDate;
	}

	public String getActualArrivalDate() {
		return actualArrivalDate;
	}

	public void setActualArrivalDate(String actualArrivalDate) {
		this.actualArrivalDate = actualArrivalDate;
	}

	public String getFullCreateDate() {
		return fullCreateDate;
	}

	public void setFullCreateDate(String fullCreateDate) {
		this.fullCreateDate = fullCreateDate;
	}

	public String getFullSchedDate() {
		return fullSchedDate;
	}

	public void setFullSchedDate(String fullSchedDate) {
		this.fullSchedDate = fullSchedDate;
	}

	public String getFullActualDate() {
		return fullActualDate;
	}

	public void setFullActualDate(String fullActualDate) {
		this.fullActualDate = fullActualDate;
	}

	public String getAppointmentStatus() {
		return appointmentStatus;
	}

	public void setAppointmentStatus(String appointmentStatus) {
		this.appointmentStatus = appointmentStatus;
	}

	public String getCartons() {
		return cartons;
	}

	public void setCartons(String cartons) {
		this.cartons = cartons;
	}

	public String getLocnName() {
		return locnName;
	}

	public void setLocnName(String locnName) {
		this.locnName = locnName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public String getTrlrNbr() {
		return trlrNbr;
	}

	public void setTrlrNbr(String trlrNbr) {
		this.trlrNbr = trlrNbr;
	}

	public String getFrgtTypNbr() {
		return frgtTypNbr;
	}

	public void setFrgtTypNbr(String frgtTypNbr) {
		this.frgtTypNbr = frgtTypNbr;
	}

	public String getYardNbr() {
		return yardNbr;
	}

	public void setYardNbr(String yardNbr) {
		this.yardNbr = yardNbr;
	}

	public String getYardAreaNbr() {
		return yardAreaNbr;
	}

	public void setYardAreaNbr(String yardAreaNbr) {
		this.yardAreaNbr = yardAreaNbr;
	}

	public String getVndNbr() {
		return vndNbr;
	}

	public void setVndNbr(String vndNbr) {
		this.vndNbr = vndNbr;
	}

	public String getVndName() {
		return vndName;
	}

	public void setVndName(String vndName) {
		this.vndName = vndName;
	}

	public String getScac() {
		return scac;
	}

	public void setScac(String scac) {
		this.scac = scac;
	}

	public String getCarrierTypNbr() {
		return carrierTypNbr;
	}

	public void setCarrierTypNbr(String carrierTypNbr) {
		this.carrierTypNbr = carrierTypNbr;
	}

	public String getDestLocNbr() {
		return destLocNbr;
	}

	public void setDestLocNbr(String destLocNbr) {
		this.destLocNbr = destLocNbr;
	}

	public String getApptTypNbr() {
		return apptTypNbr;
	}

	public void setApptTypNbr(String apptTypNbr) {
		this.apptTypNbr = apptTypNbr;
	}

	public String getCreateUseridV() {
		return createUseridV;
	}

	public void setCreateUseridV(String createUseridV) {
		this.createUseridV = createUseridV;
	}

	public String getHighValue() {
		return highValue;
	}

	public void setHighValue(String highValue) {
		this.highValue = highValue;
	}

	public String getHighPriority() {
		return highPriority;
	}

	public void setHighPriority(String highPriority) {
		this.highPriority = highPriority;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

}
