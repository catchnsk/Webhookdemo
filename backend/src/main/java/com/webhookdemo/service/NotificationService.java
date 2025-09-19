package com.webhookdemo.service;

import com.webhookdemo.dto.WebhookNotificationDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    public void processNotification(WebhookNotificationDto notification) {
        logger.info("Processing notification for event {} with type {}", 
            notification.getEventId(), notification.getNotificationType());
        
        switch (notification.getNotificationType()) {
            case "NEW_EVENT":
                handleNewEvent(notification);
                break;
            case "SUCCESS":
                handleSuccessEvent(notification);
                break;
            case "FAILURE":
                handleFailureEvent(notification);
                break;
            case "RETRY":
                handleRetryEvent(notification);
                break;
            default:
                logger.warn("Unknown notification type: {}", notification.getNotificationType());
        }
    }
    
    private void handleNewEvent(WebhookNotificationDto notification) {
        logger.info("New webhook event created: {} -> {}", notification.getEventId(), notification.getUrl());
        // Add logic for new event notifications (email, dashboard updates, etc.)
    }
    
    private void handleSuccessEvent(WebhookNotificationDto notification) {
        logger.info("Webhook event succeeded: {} -> {}", notification.getEventId(), notification.getUrl());
        // Add logic for success notifications
    }
    
    private void handleFailureEvent(WebhookNotificationDto notification) {
        logger.warn("Webhook event failed: {} -> {} (Attempt {}/{})", 
            notification.getEventId(), notification.getUrl(), 
            notification.getAttempts(), notification.getMaxAttempts());
        
        if (notification.getErrorMessage() != null) {
            logger.warn("Error message: {}", notification.getErrorMessage());
        }
        
        // Add logic for failure notifications (alerts, monitoring, etc.)
    }
    
    private void handleRetryEvent(WebhookNotificationDto notification) {
        logger.info("Webhook event retry: {} -> {} (Attempt {}/{})", 
            notification.getEventId(), notification.getUrl(), 
            notification.getAttempts(), notification.getMaxAttempts());
        // Add logic for retry notifications
    }
}