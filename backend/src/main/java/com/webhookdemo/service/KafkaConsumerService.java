package com.webhookdemo.service;

import com.webhookdemo.dto.WebhookNotificationDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {
    
    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
    
    @Autowired
    private WebhookDeliveryService deliveryService;
    
    @Autowired
    private NotificationService notificationService;
    
    @KafkaListener(topics = "${kafka.topics.webhook-events}", groupId = "webhook-events-group")
    public void consumeWebhookEvent(
            @Payload WebhookNotificationDto notification,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {
        
        logger.info("Received webhook event: eventId={}, topic={}, partition={}, offset={}", 
            notification.getEventId(), topic, partition, offset);
        
        try {
            // Process the webhook event asynchronously
            deliveryService.deliverWebhook(notification.getEventId());
            
            // Acknowledge the message
            acknowledgment.acknowledge();
            logger.info("Successfully processed webhook event: {}", notification.getEventId());
            
        } catch (Exception e) {
            logger.error("Error processing webhook event {}: {}", notification.getEventId(), e.getMessage(), e);
            // Don't acknowledge on error - message will be retried
        }
    }
    
    @KafkaListener(topics = "${kafka.topics.webhook-notifications}", groupId = "webhook-notifications-group")
    public void consumeWebhookNotification(
            @Payload WebhookNotificationDto notification,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {
        
        logger.info("Received webhook notification: eventId={}, type={}, topic={}, partition={}, offset={}", 
            notification.getEventId(), notification.getNotificationType(), topic, partition, offset);
        
        try {
            // Process the notification (send to external systems, update dashboards, etc.)
            notificationService.processNotification(notification);
            
            // Acknowledge the message
            acknowledgment.acknowledge();
            logger.info("Successfully processed webhook notification: {} - {}", 
                notification.getEventId(), notification.getNotificationType());
            
        } catch (Exception e) {
            logger.error("Error processing webhook notification {}: {}", 
                notification.getEventId(), e.getMessage(), e);
            // Don't acknowledge on error - message will be retried
        }
    }
    
    @KafkaListener(topics = "${kafka.topics.webhook-retries}", groupId = "webhook-retries-group")
    public void consumeRetryEvent(
            @Payload WebhookNotificationDto notification,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {
        
        logger.info("Received retry event: eventId={}, topic={}, partition={}, offset={}", 
            notification.getEventId(), topic, partition, offset);
        
        try {
            // Process the retry with exponential backoff
            deliveryService.deliverWebhookWithDelay(notification.getEventId(), notification.getAttempts());
            
            // Acknowledge the message
            acknowledgment.acknowledge();
            logger.info("Successfully processed retry event: {}", notification.getEventId());
            
        } catch (Exception e) {
            logger.error("Error processing retry event {}: {}", notification.getEventId(), e.getMessage(), e);
            // Don't acknowledge on error - message will be retried
        }
    }
}