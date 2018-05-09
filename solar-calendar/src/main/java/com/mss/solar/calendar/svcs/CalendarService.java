package com.mss.solar.calendar.svcs;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mss.solar.calendar.common.RestApiUrlConstants;
import com.mss.solar.calendar.domain.CalendarEvent;
import com.mss.solar.calendar.model.CalendarFilter;
import com.mss.solar.calendar.model.CalendarPriorityType;
import com.mss.solar.calendar.model.ServiceResponse;

@RequestMapping(value = "/api/calendar")
public interface CalendarService {

	final String MODULE_NAME = "CalendarService";

	@PostMapping(RestApiUrlConstants.CREATE_EVENT)
	@ResponseBody
	ServiceResponse<CalendarEvent> createEvent(@Valid @RequestBody CalendarEvent calendarEvent,@RequestHeader(value="Authorization") String authorization);

	@PostMapping(RestApiUrlConstants.CREATE_EVENT_NEW)
	@ResponseBody
	ServiceResponse<CalendarEvent> createQuartzEvent(@RequestBody CalendarEvent calendarEvent);

	@PutMapping(RestApiUrlConstants.EVENT_ID)
	@ResponseBody
	ServiceResponse<CalendarEvent> updateEvent(@NotNull @PathVariable Long calenderId,
			@RequestBody CalendarEvent calendarEvent,@RequestHeader(value = "Authorization") String authorization);

	@GetMapping(RestApiUrlConstants.GET_EVENTS)
	@ResponseBody
	ServiceResponse<List<CalendarEvent>> getEvents();

	@PutMapping(RestApiUrlConstants.UPDATE_STATUS)
	@ResponseBody
	ServiceResponse<CalendarEvent> updateStatus(@NotNull @PathVariable Long calenderId,
			@NotNull @PathVariable Boolean active);

	@GetMapping(RestApiUrlConstants.EVENT_ID)
	@ResponseBody
	ServiceResponse<CalendarEvent> getEvent(@NotNull @PathVariable Long calenderId);

	@GetMapping(RestApiUrlConstants.GET_EVENT_BY_TIME_RANGE)
	@ResponseBody
	ServiceResponse<Set<CalendarEvent>> getEventsByTimeRange(
			@NotNull @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime startTime,
			@NotNull @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime endTime);

	@GetMapping(RestApiUrlConstants.GET_EVENT_BY_PRIORITY)
	@ResponseBody
	ServiceResponse<Set<CalendarEvent>> getEventsByPriority(@NotNull @PathVariable CalendarPriorityType priority);

	@PostMapping(RestApiUrlConstants.GET_EVENT_BY_FILTER)
	@ResponseBody
	ServiceResponse<Set<CalendarEvent>> getEventsByFilter(@NotNull @RequestBody CalendarFilter filter);

	@GetMapping(RestApiUrlConstants.GET_EVENT_BY_TITLE)
	@ResponseBody
	ServiceResponse<Set<CalendarEvent>> getEventsByTitle(@NotNull @PathVariable String title);

	@GetMapping(RestApiUrlConstants.GET_ACTIVE_EVENTS)
	@ResponseBody
	ServiceResponse<Set<CalendarEvent>> getActiveEvents(@NotNull @PathVariable Boolean active);

	@GetMapping(RestApiUrlConstants.GET_CURRENT_EVENTS)
	@ResponseBody
	ServiceResponse<Set<CalendarEvent>> getCurrentEvents();

	void notifyService(String eventStartTime);

}


