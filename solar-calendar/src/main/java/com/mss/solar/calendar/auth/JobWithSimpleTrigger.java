package com.mss.solar.calendar.auth;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mss.solar.calendar.svcs.CalendarService;

/**
 * @author pavan.solapure
 *
 */
@Component
@DisallowConcurrentExecution
public class JobWithSimpleTrigger implements Job {

	@Value("${cron.frequency.jobwithsimpletrigger}")
	private long frequency;

	@Autowired
	private CalendarService calendarService;

	@Override
	public void execute(JobExecutionContext jobExecutionContext) {
		String eventStartTime = jobExecutionContext.getJobDetail().getJobDataMap().getString("eventStartTime");
		calendarService.notifyService(eventStartTime);
	}

}