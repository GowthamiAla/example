package com.mss.solar.core.repos;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mss.solar.core.domain.NotificationEventSetting;
import com.mss.solar.core.domain.Role;
import com.mss.solar.core.domain.ServiceEvent;
import com.mss.solar.core.domain.User;

public interface NotificationEventSettingRepository extends JpaRepository<NotificationEventSetting, Long> {

	@Query("SELECT n from NotificationEventSetting n WHERE n.user.id=?1 OR n.user.id=null")
	List<NotificationEventSetting> getAllSettings(Long userId);

	NotificationEventSetting findByServiceEventAndUser(ServiceEvent serviceEvent, User user);

	NotificationEventSetting findByIdAndUser(Long id, User user);


	Integer deleteByServiceEvent(ServiceEvent serviceEvent);

	List<NotificationEventSetting> findByUserId(Long userId);
	
	default NotificationEventSetting getDefaultNotificationSettingsForEvent(Long event) {
		return findByServiceEventIdAndUser(event,null);
	}
	
	List<NotificationEventSetting> findAllByUser(User user);
	
	NotificationEventSetting findByServiceEventIdAndUser(Long serviceEvent, User user);

	List<NotificationEventSetting> findByServiceEventId(Long serviceEvntId);

	NotificationEventSetting findById(Long id);

	Set<NotificationEventSetting> findAllByRole(Role role);

	

}
