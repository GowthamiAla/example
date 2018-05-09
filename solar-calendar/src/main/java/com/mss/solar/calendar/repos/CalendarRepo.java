package com.mss.solar.calendar.repos;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mss.solar.calendar.domain.CalendarEvent;
import com.mss.solar.calendar.model.CalendarPriorityType;

@Repository
public interface CalendarRepo extends JpaRepository<CalendarEvent, Long> {
	
	CalendarEvent findById(Long calendarId);
	
	Set<CalendarEvent> findAllByPriority(CalendarPriorityType active);

	Set<CalendarEvent> findAllByTitle(String title);

	Set<CalendarEvent> findAllByActive(Boolean active);
	
	Set<CalendarEvent> findAllByStart(ZonedDateTime start);

	@Query("SELECT c from CalendarEvent c WHERE c.start >= ?1 AND c.start <= ?2")
	Set<CalendarEvent> getEvents(ZonedDateTime start, ZonedDateTime end);
	
	@Query("SELECT c FROM CalendarEvent  c where c.priority IN (?1) AND c.eventType IN (?2) AND c.active IN (?3)")
	Set<CalendarEvent> getFilterEvents(List<CalendarPriorityType> priorities, List<String> eventTypes,Boolean active);
	
	
	@Query("SELECT c FROM CalendarEvent  c where c.priority IN (?1)  AND c.active IN (?2)")
	Set<CalendarEvent> getFilterEventsByPriorityAndActive(List<CalendarPriorityType> priorities,Boolean active);
	
	
	@Query("SELECT c FROM CalendarEvent  c where c.eventType  IN (?1)  AND c.active IN (?2)")
	Set<CalendarEvent> getFilterEventsByEventTypesAndActive(List<String> eventTypes,Boolean active);
	
	
}
