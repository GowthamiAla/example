package com.mss.solar.calendar.model;

import java.util.List;

public class CalendarFilter {

	private List<CalendarPriorityType> priorities;
	private List<String> eventTypes;
	private Boolean active;

	public List<CalendarPriorityType> getPriorities() {
		return priorities;
	}

	public void setPriorities(List<CalendarPriorityType> priorities) {
		this.priorities = priorities;
	}

	public List<String> getEventTypes() {
		return eventTypes;
	}

	public void setEventTypes(List<String> eventTypes) {
		this.eventTypes = eventTypes;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

}
