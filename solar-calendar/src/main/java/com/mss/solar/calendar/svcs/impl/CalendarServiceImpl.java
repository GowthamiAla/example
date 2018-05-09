package com.mss.solar.calendar.svcs.impl;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.quartz.CronTriggerFactoryBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.mss.solar.calendar.auth.JobWithSimpleTrigger;
import com.mss.solar.calendar.common.EnumTypeForErrorCodes;
import com.mss.solar.calendar.common.Utils;
import com.mss.solar.calendar.domain.CalendarEvent;
import com.mss.solar.calendar.domain.User;
import com.mss.solar.calendar.model.CalendarFilter;
import com.mss.solar.calendar.model.CalendarPriorityType;
import com.mss.solar.calendar.model.CronUtil;
import com.mss.solar.calendar.model.ServiceResponse;
import com.mss.solar.calendar.repos.CalendarRepo;
import com.mss.solar.calendar.repos.UserRepository;
import com.mss.solar.calendar.svcs.CalendarService;

import io.jsonwebtoken.Jwts;

@RestController
@Validated
public class CalendarServiceImpl implements CalendarService {

	private static Logger log = LoggerFactory.getLogger(CalendarServiceImpl.class);

	@Autowired
	public CalendarRepo calendarRepo;

	@Autowired
	private Utils utils;

	@Autowired
	private DiscoveryClient discoveryClient;

	@Autowired
	private UserRepository userRepo;

	@Value("${serviceEvntId}")
	private Long serviceEvntId;

	@Autowired
	private SchedulerFactoryBean schedulerFactoryBean;

	@Autowired
	private CronTriggerFactoryBean cronJobTrigger;

	/**
	 * createEvent service implementation
	 * 
	 * @param calendarEvent
	 * @return ServiceResponse<CalendarEvent>
	 */
	@Override
	@Transactional
	public ServiceResponse<CalendarEvent> createEvent(@Valid @RequestBody CalendarEvent calendarEvent,
			@RequestHeader(value = "Authorization") String authorization) {
		log.info("creating an event");

		String email = Jwts.parser().setSigningKey("SecretKeyToGenJWTs")
				.parseClaimsJws(authorization.replace("Bearer ", "")).getBody().getSubject();

		User user = userRepo.findByEmail(email);

		ServiceResponse<CalendarEvent> response = new ServiceResponse<>();
		try {
			calendarEvent.setCreatedUser(user);
			CalendarEvent createdEvent = calendarRepo.save(calendarEvent);

			createQuartzEvent(createdEvent);

			response.setData(createdEvent);

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS601.name(), EnumTypeForErrorCodes.SCUS601.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}

		return response;
	}

	/**
	 * createQuartzEvent service implementation
	 * 
	 * @param calendarEvent
	 * @return ServiceResponse<CalendarEvent>
	 */
	@Override
	@Transactional
	public ServiceResponse<CalendarEvent> createQuartzEvent(@RequestBody CalendarEvent calendarEvent) {
		log.info("creating an event");

		ServiceResponse<CalendarEvent> response = new ServiceResponse<>();

		Scheduler scheduler = schedulerFactoryBean.getScheduler();

		try {

			JobKey jobKey = new JobKey("solarJob" + calendarEvent.getId());
			JobDetail job = newJob(JobWithSimpleTrigger.class).withIdentity(jobKey)
					.usingJobData("eventStartTime", Date.from(calendarEvent.getStart().toInstant()).toString()).build();

			String cronExpression = generateCronExpression(calendarEvent.getStart());

			TriggerKey t = new TriggerKey("solarTrigger" + calendarEvent.getId());

			Trigger trigger = newTrigger().withIdentity(t).withSchedule(cronSchedule(cronExpression)).build();

			scheduler.scheduleJob(job, trigger);

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS601.name(), EnumTypeForErrorCodes.SCUS601.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * updateEvent service implementation
	 * 
	 * @param calenderID
	 * @param calendarEvent
	 * @return ServiceResponse<CalendarEvent>
	 */
	@Override
	@Transactional
	public ServiceResponse<CalendarEvent> updateEvent(@NotNull @PathVariable Long calendarId,
			@RequestBody CalendarEvent calendarEvent, @RequestHeader(value = "Authorization") String authorization) {

		log.info("updating an event");
		ServiceResponse<CalendarEvent> response = new ServiceResponse<>();

		String email = Jwts.parser().setSigningKey("SecretKeyToGenJWTs")
				.parseClaimsJws(authorization.replace("Bearer ", "")).getBody().getSubject();

		User user = userRepo.findByEmail(email);

		try {

			CalendarEvent eventExists = calendarRepo.findById(calendarEvent.getId());
			if (eventExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS602.name(),
						EnumTypeForErrorCodes.SCUS602.errorMsg() + utils.toJson(calendarEvent));
			} else {

				eventExists.setProperties(calendarEvent.getProperties());
				eventExists.setActive(calendarEvent.getActive());
				eventExists.setStart(calendarEvent.getStart());
				eventExists.setEnd(calendarEvent.getEnd());
				eventExists.setCreateTime(calendarEvent.getCreateTime());
				eventExists.setLastUpdateTime(calendarEvent.getLastUpdateTime());
				eventExists.setTitle(calendarEvent.getTitle());
				eventExists.setPriority(calendarEvent.getPriority());
				eventExists.setDescription(calendarEvent.getDescription());
				eventExists.setCreatedUser(eventExists.getCreatedUser());
				eventExists.setLastUpdatedUser(user);
				eventExists.setEventType(calendarEvent.getEventType());

				CalendarEvent updatedEvent = calendarRepo.save(eventExists);

				updateQuartzEvent(updatedEvent);

				response.setData(updatedEvent);
			}

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS603.name(), EnumTypeForErrorCodes.SCUS603.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}

		return response;
	}

	/**
	 * updateQuartzEvent service implementation
	 * 
	 * @param calendarEvent
	 * @return ServiceResponse<CalendarEvent>
	 */
	@Transactional
	public ServiceResponse<CalendarEvent> updateQuartzEvent(CalendarEvent calendarEvent) {
		log.info("creating an event");

		ServiceResponse<CalendarEvent> response = new ServiceResponse<>();

		Scheduler scheduler = schedulerFactoryBean.getScheduler();

		try {

			String cronExpression = generateCronExpression(calendarEvent.getStart());

			TriggerKey t = new TriggerKey("solarTrigger" + calendarEvent.getId());

			Trigger oldTrigger = scheduler.getTrigger(t);

			TriggerBuilder tb = oldTrigger.getTriggerBuilder();

			Trigger newTrigger = tb.withSchedule(cronSchedule(cronExpression)).build();

			scheduler.rescheduleJob(oldTrigger.getKey(), newTrigger);

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS601.name(), EnumTypeForErrorCodes.SCUS601.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getEvents service implementation
	 * 
	 * @return ServiceResponse<List<CalendarEvent>>
	 */
	@Override
	public ServiceResponse<List<CalendarEvent>> getEvents() {
		log.info("Getting current events");

		ServiceResponse<List<CalendarEvent>> response = new ServiceResponse<>();
		try {
			List<CalendarEvent> events = calendarRepo.findAll();
			response.setData(events);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS604.name(), EnumTypeForErrorCodes.SCUS604.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * updateStatus service implementation
	 * 
	 * @param calenderID
	 * @param active
	 * @return ServiceResponse<CalendarEvent>
	 */
	@Override
	public ServiceResponse<CalendarEvent> updateStatus(@NotNull @PathVariable Long calenderId,
			@NotNull @PathVariable Boolean active) {
		log.info("update status");

		ServiceResponse<CalendarEvent> response = new ServiceResponse<>();
		try {
			CalendarEvent eventExists = calendarRepo.findById(calenderId);
			if (eventExists == null) {
				response.setError(EnumTypeForErrorCodes.SCUS605.name(), EnumTypeForErrorCodes.SCUS605.errorMsg());
			} else {
				eventExists.setActive(active);
				CalendarEvent updatedEvent = calendarRepo.save(eventExists);

				response.setData(updatedEvent);
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS606.name(), EnumTypeForErrorCodes.SCUS606.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getEvent service implementation
	 * 
	 * @param calenderID
	 * @return ServiceResponse<CalendarEvent>
	 */
	@Override
	public ServiceResponse<CalendarEvent> getEvent(@NotNull @PathVariable Long calendarId) {
		log.info("getting events");

		ServiceResponse<CalendarEvent> response = new ServiceResponse<>();
		try {
			CalendarEvent event = calendarRepo.findById(calendarId);

			response.setData(event);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS607.name(), EnumTypeForErrorCodes.SCUS607.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getEventsByDateRange service implementation
	 * 
	 * @param startTime,endTime
	 * @return ServiceResponse<CalendarEvent>
	 */

	@Override
	public ServiceResponse<Set<CalendarEvent>> getEventsByTimeRange(
			@NotNull @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime startTime,
			@NotNull @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime endTime) {
		log.info("Getting events by giving date range");

		ServiceResponse<Set<CalendarEvent>> response = new ServiceResponse<Set<CalendarEvent>>();
		System.out.println(ZonedDateTime.now());
		try {

			Set<CalendarEvent> event = calendarRepo.getEvents(startTime, endTime);

			response.setData(event);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS608.name(), EnumTypeForErrorCodes.SCUS608.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getEventsByPriority service implementation
	 * 
	 * @param priority
	 * @return ServiceResponse<Set<CalendarEvent>>
	 */
	@Override
	public ServiceResponse<Set<CalendarEvent>> getEventsByPriority(
			@NotNull @PathVariable CalendarPriorityType priority) {
		log.info("Getting events by Priority");

		ServiceResponse<Set<CalendarEvent>> response = new ServiceResponse<>();
		try {
			Set<CalendarEvent> events = calendarRepo.findAllByPriority(priority);

			response.setData(events);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS609.name(), EnumTypeForErrorCodes.SCUS609.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getEventsByTitle service implementation
	 * 
	 * @param title
	 * @return ServiceResponse<Set<CalendarEvent>>
	 */
	@Override
	public ServiceResponse<Set<CalendarEvent>> getEventsByTitle(@NotNull @PathVariable String title) {
		log.info("Getting events by title");

		ServiceResponse<Set<CalendarEvent>> response = new ServiceResponse<>();
		try {
			Set<CalendarEvent> events = calendarRepo.findAllByTitle(title);

			response.setData(events);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS610.name(), EnumTypeForErrorCodes.SCUS610.errorMsg() + title);
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getActiveEvents service implementation
	 * 
	 * @param active
	 * @return ServiceResponse<Set<CalendarEvent>>
	 */

	@Override
	public ServiceResponse<Set<CalendarEvent>> getActiveEvents(@NotNull @PathVariable Boolean active) {
		log.info("Getting Active events");

		ServiceResponse<Set<CalendarEvent>> response = new ServiceResponse<>();
		try {
			Set<CalendarEvent> events = calendarRepo.findAllByActive(active);

			response.setData(events);

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS611.name(), EnumTypeForErrorCodes.SCUS611.errorMsg() + active);
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getCurrentEvents service implementation
	 * 
	 * @return ServiceResponse<Set<CalendarEvent>>
	 */
	@Override
	public ServiceResponse<Set<CalendarEvent>> getCurrentEvents() {
		log.info("Getting current events");

		ServiceResponse<Set<CalendarEvent>> response = new ServiceResponse<>();
		ZonedDateTime currentTime = ZonedDateTime.now();
		try {
			Set<CalendarEvent> events = calendarRepo.findAllByStart(currentTime);

			response.setData(events);
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS612.name(), EnumTypeForErrorCodes.SCUS612.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * notifyUser service implementation
	 * 
	 * @param userId
	 * @param payload
	 */
	@Async
	@Override
	public void notifyService(String eventStartTime) {

		// Sending email
		try {
			List<ServiceInstance> instances = discoveryClient.getInstances("solar-core");
			String baseURL = instances.get(0).getUri().toString();

			Map<String, String> Eventdata = new HashMap<String, String>();
			Eventdata.put("event", "Event");
			Eventdata.put("start", eventStartTime);

			HttpEntity<Map<String, String>> request = new HttpEntity<>(Eventdata);

			RestTemplate restTemplate = new RestTemplate();

			String url = baseURL + "api/notifications/notify/roles/" + serviceEvntId;
			restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

		} catch (HttpClientErrorException e) {
			log.error(e.getStatusCode().toString());
		}
	}

	/**
	 * getEventsByFilter service implementation
	 * 
	 * @param filter
	 */
	@Override
	public ServiceResponse<Set<CalendarEvent>> getEventsByFilter(@RequestBody CalendarFilter filter) {
		log.info("getting events by filter");
		ServiceResponse<Set<CalendarEvent>> response = new ServiceResponse<>();
		try {
			String prior = "T", event = "T";
			Set<CalendarEvent> eventsByFilter = null;
			List<CalendarPriorityType> priorities = filter.getPriorities();
			List<String> eventTypes = filter.getEventTypes();
			Boolean active = filter.getActive();

			if (priorities.isEmpty()) {
				prior = "F";
			}
			if (eventTypes.isEmpty()) {

				event = "F";
			}
			String condition = prior + event;

			switch (condition) {
			case "TF":
				eventsByFilter = calendarRepo.getFilterEventsByPriorityAndActive(priorities, active);
				response.setData(eventsByFilter);
				break;
			case "FT":
				eventsByFilter = calendarRepo.getFilterEventsByEventTypesAndActive(eventTypes, active);
				response.setData(eventsByFilter);
				break;

			case "FF":
				eventsByFilter = calendarRepo.findAllByActive(active);
				response.setData(eventsByFilter);
				break;

			case "TT":
				eventsByFilter = calendarRepo.getFilterEvents(priorities, eventTypes, active);
				response.setData(eventsByFilter);
				break;
			}

		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS613.name(), EnumTypeForErrorCodes.SCUS613.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	public String generateCronExpression(ZonedDateTime date) {
		String cron = "";
		try {

			Date convertedDate = Date.from(date.toInstant());

			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String dt = dateFormat.format(convertedDate);

			Date cronDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dt);

			cronDate.setMinutes(cronDate.getMinutes() - 30);

			CronUtil calHelper = new CronUtil(cronDate);
			cron = calHelper.getmSeconds() + " " + calHelper.getmMins() + " " + calHelper.getmHours() + " "
					+ calHelper.getmDaysOfMonth() + " " + calHelper.getmMonths() + " " + calHelper.getmDaysOfWeek()
					+ " " + calHelper.getmYears();

		} catch (Exception exception) {
		}
		return cron;
	}

	public ResponseEntity<User> getuserByemail(String email) {

		List<ServiceInstance> instances = discoveryClient.getInstances("solar-core");

		String baseURL = instances.get(0).getUri().toString();

		baseURL = baseURL + "/api/users/getUserByEmail/" + email;

		RestTemplate restTemplate = new RestTemplate();

		ResponseEntity<String> result = restTemplate.exchange(baseURL, HttpMethod.GET, null, String.class);

		return null;
	}

}
