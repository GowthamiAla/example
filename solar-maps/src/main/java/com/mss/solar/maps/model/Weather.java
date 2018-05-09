package com.mss.solar.maps.model;

/**
 * Weather Class
 *
 */
public class Weather {

	private String id;
	private String name;
	private String elev;
	private String latitude;
	private String longitude;
	private String date;
	private String temp;
	private String dewp;
	private String relh;
	private String winds;
	private String windd;
	private String gust;
	private String weather;
	private String weatherimage;
	private String visibility;
	private String altimeter;
	private String SLP;
	private String timezone;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getElev() {
		return elev;
	}

	public void setElev(String elev) {
		this.elev = elev;
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

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTemp() {
		return temp;
	}

	public void setTemp(String temp) {
		this.temp = temp;
	}

	public String getDewp() {
		return dewp;
	}

	public void setDewp(String dewp) {
		this.dewp = dewp;
	}

	public String getRelh() {
		return relh;
	}

	public void setRelh(String relh) {
		this.relh = relh;
	}

	public String getWinds() {
		return winds;
	}

	public void setWinds(String winds) {
		this.winds = winds;
	}

	public String getWindd() {
		return windd;
	}

	public void setWindd(String windd) {
		this.windd = windd;
	}

	public String getGust() {
		return gust;
	}

	public void setGust(String gust) {
		this.gust = gust;
	}

	public String getWeather() {
		return weather;
	}

	public void setWeather(String weather) {
		this.weather = weather;
	}

	public String getWeatherimage() {
		return weatherimage;
	}

	public void setWeatherimage(String weatherimage) {
		this.weatherimage = weatherimage;
	}

	public String getVisibility() {
		return visibility;
	}

	public void setVisibility(String visibility) {
		this.visibility = visibility;
	}

	public String getAltimeter() {
		return altimeter;
	}

	public void setAltimeter(String altimeter) {
		this.altimeter = altimeter;
	}

	public String getSLP() {
		return SLP;
	}

	public void setSLP(String sLP) {
		SLP = sLP;
	}

	public String getTimezone() {
		return timezone;
	}

	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}

}
