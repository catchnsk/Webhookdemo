package com.webhookdemo.service;

import com.webhookdemo.dto.WebhookNotificationDto;
import com.webhookdemo.entity.WebhookEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {
    
    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${kafka.topics.webhook-events}")
    private String webhookEventsTopic;
    
    @Value("${kafka.topics.webhook-notifications}")
    private String webhookNotificationsTopic;
    
    @Value("${kafka.topics.webhook-retries}")
    private String webhookRetriesTopic;
    
    public void publishWebhookEvent(WebhookEvent event) {
        try {
            WebhookNotificationDto notification = new WebhookNotificationDto(event, "NEW_EVENT");
            
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                webhookEventsTopic, 
                event.getId().toString(), 
                notification
            );
            
            future.whenComplete((result, exception) -> {
                if (exception == null) {
                    logger.info("Sent webhook event [{}] to topic [{}] with offset=[{}]", 
                        event.getId(), webhookEventsTopic, result.getRecordMetadata().offset());
                } else {
                    logger.error("Unable to send webhook event [{}] to topic [{}] due to: {}", 
                        event.getId(), webhookEventsTopic, exception.getMessage());
                }
            });
            
        } catch (Exception e) {
            logger.error("Error publishing webhook event to Kafka: {}", e.getMessage(), e);
        }
    }
    
    public void publishWebhookNotification(WebhookEvent event, String notificationType) {
        try {
            WebhookNotificationDto notification = new WebhookNotificationDto(event, notificationType);
            
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                webhookNotificationsTopic, 
                event.getId().toString(), 
                notification
            );
            
            future.whenComplete((result, exception) -> {
                if (exception == null) {
                    logger.info("Sent webhook notification [{}] type [{}] to topic [{}] with offset=[{}]", 
                        event.getId(), notificationType, webhookNotificationsTopic, result.getRecordMetadata().offset());
                } else {
                    logger.error("Unable to send webhook notification [{}] to topic [{}] due to: {}", 
                        event.getId(), webhookNotificationsTopic, exception.getMessage());
                }
            });
            
        } catch (Exception e) {
            logger.error("Error publishing webhook notification to Kafka: {}", e.getMessage(), e);
        }
    }
    
    public void publishRetryEvent(WebhookEvent event) {
        try {
            WebhookNotificationDto notification = new WebhookNotificationDto(event, "RETRY");
            
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                webhookRetriesTopic, 
                event.getId().toString(), 
                notification
            );
            
            future.whenComplete((result, exception) -> {
                if (exception == null) {
                    logger.info("Sent retry event [{}] to topic [{}] with offset=[{}]", 
                        event.getId(), webhookRetriesTopic, result.getRecordMetadata().offset());
                } else {
                    logger.error("Unable to send retry event [{}] to topic [{}] due to: {}", 
                        event.getId(), webhookRetriesTopic, exception.getMessage());
                }
            });
            
        } catch (Exception e) {
            logger.error("Error publishing retry event to Kafka: {}", e.getMessage(), e);
        }
    }
}