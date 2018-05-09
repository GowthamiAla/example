package com.mss.solar.calendar.domain;
import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import org.json.JSONException;
import org.json.JSONObject;

@MappedSuperclass
public class Properties {
	@Transient
	private JSONObject jsonProps = new JSONObject();

	@Access(AccessType.PROPERTY)
	public String getProperties() {
		return jsonProps.toString();
	}

	public void setProperties(String properties) throws JSONException {
		if (properties != null) {
			jsonProps = new JSONObject(properties);
		}
	}

	public void setProperty(String key, Object value) throws JSONException {
		jsonProps.put(key, value);
	}

	public String getStringProperty(String key) throws JSONException {
		return jsonProps.getString(key);
	}

	public double getDoubleProperty(String key) throws JSONException {
		return jsonProps.getDouble(key);
	}

}
