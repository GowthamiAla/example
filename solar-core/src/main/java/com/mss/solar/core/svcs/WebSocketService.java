package com.mss.solar.core.svcs;

public interface WebSocketService {
	
	public void sendChannelNotifications(String userID, String channelType, String notificationMessage);

	public void websocketNotificationCount(String userID, Integer notificationCOunt);
	
}
