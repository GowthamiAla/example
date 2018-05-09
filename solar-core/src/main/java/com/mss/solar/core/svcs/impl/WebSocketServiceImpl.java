package com.mss.solar.core.svcs.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.mss.solar.core.svcs.WebSocketService;

@Controller
public class WebSocketServiceImpl implements WebSocketService {

	private static final Logger log = Logger.getLogger(WebSocketServiceImpl.class);

	@Autowired
	private SimpMessagingTemplate template;

	/**
	 * sendChannelNotifications controller implementation
	 * 
	 * @param userID
	 * @param channelType
	 * @param notificationMessage
	 */
	@MessageMapping("/{userID}/{channelType}")
	@Override
	public void sendChannelNotifications(@DestinationVariable String userID, @DestinationVariable String channelType,
			String userWebsocketMessage) {
		
		log.info("Sending notification to the user through websocket");

		try {
			template.convertAndSend("/topic/"+userID+"/"+channelType,userWebsocketMessage);


		} catch (Exception e) {
			log.error("Error in sending notification to the user", e);
		}

	}
	/**
	 * websocketNotificationCount controller implementation
	 * 
	 * @param userID
	 * @param notificationCount
	 */
	@MessageMapping("/{userID}/notificationCount")
	@Override
	public void websocketNotificationCount(@DestinationVariable String userID, Integer notificationCOunt) {

		log.info("Sending notification to the user through websocket");

		try {
			template.convertAndSend("/topic/" + userID + "/notificationCount", notificationCOunt);
		} catch (Exception e) {
			log.error("Error in sending notification to the user", e);
		}

	}
}
