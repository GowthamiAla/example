package com.mss.solar.core.repos;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.mss.solar.core.common.MessageTemplateType;
import com.mss.solar.core.domain.NotificationEvent;
import com.mss.solar.core.domain.ServiceEvent;

@Transactional
public interface NotificationEventRepository extends JpaRepository<NotificationEvent, Long>{

	List<NotificationEvent> findByUserId(Long userId);

	List<NotificationEvent> findByServiceevent(ServiceEvent serviceevent);

	List<NotificationEvent> findAllByUserId(Long userId);
	
	@Query("SELECT n from NotificationEvent n WHERE n.user.id=?1 AND n.readStatus=1 AND n.type=?2")
	List<NotificationEvent> getAllNotificationsForUser(Long userId, MessageTemplateType type);
	
	@Modifying
	@Query("UPDATE NotificationEvent n SET n.readStatus=0 WHERE n.user.id=?1 AND n.readStatus=1")
	Integer updateAllNotificationsOfUser(Long userId);
	
	List<NotificationEvent> findByUserIdAndType(Long userId, MessageTemplateType type);

	NotificationEvent findById(Long id);

}
