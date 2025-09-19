package com.webhookdemo.service;

import com.webhookdemo.entity.WebhookEvent;
import com.webhookdemo.repository.WebhookEventRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class WebhookDeliveryService {
    
    @Autowired
    private WebhookEventRepository eventRepository;
    
    @Autowired
    private KafkaProducerService kafkaProducerService;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Async
    public void deliverWebhook(Long eventId) {
        Optional<WebhookEvent> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            WebhookEvent event = eventOpt.get();
            deliverWebhookEvent(event);
        }
    }
    
    @Async
    public void deliverWebhookWithDelay(Long eventId, Integer attemptNumber) {
        try {
            // Exponential backoff: 2^attempt seconds
            long delaySeconds = (long) Math.pow(2, attemptNumber != null ? attemptNumber : 1);
            TimeUnit.SECONDS.sleep(delaySeconds);
            
            deliverWebhook(eventId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Retry delivery interrupted for event {}", eventId);
        }
    }
    
    private void deliverWebhookEvent(WebhookEvent event) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Parse headers
            HttpHeaders headers = new HttpHeaders();
            if (event.getHeaders() != null && !event.getHeaders().isEmpty()) {
                Map<String, String> headerMap = objectMapper.readValue(
                    event.getHeaders(), 
                    new TypeReference<Map<String, String>>() {}
                );
                headerMap.forEach(headers::add);
            }
            
            // Parse payload
            Object payload = null;
            if (event.getPayload() != null && !event.getPayload().isEmpty()) {
                payload = objectMapper.readValue(event.getPayload(), Object.class);
            }
            
            HttpEntity<Object> requestEntity = new HttpEntity<>(payload, headers);
            
            // Convert enum to HttpMethod
            org.springframework.http.HttpMethod httpMethod = switch (event.getMethod()) {
                case POST -> HttpMethod.POST;
                case PUT -> HttpMethod.PUT;
                case PATCH -> HttpMethod.PATCH;
            };
            
            // Make the HTTP request
            ResponseEntity<String> response = restTemplate.exchange(
                event.getUrl(),
                httpMethod,
                requestEntity,
                String.class
            );
            
            long responseTime = System.currentTimeMillis() - startTime;
            
            // Update event with success
            event.setStatus(WebhookEvent.EventStatus.SUCCESS);
            event.setResponseTime(responseTime);
            event.setAttempts(event.getAttempts() + 1);
            event.setErrorMessage(null);
            event.setUpdatedAt(LocalDateTime.now());
            
            // Publish success notification to Kafka
            kafkaProducerService.publishWebhookNotification(event, "SUCCESS");
            
        } catch (Exception e) {
            long responseTime = System.currentTimeMillis() - startTime;
            
            // Update event with failure
            event.setStatus(WebhookEvent.EventStatus.FAILED);
            event.setResponseTime(responseTime);
            event.setAttempts(event.getAttempts() + 1);
            event.setErrorMessage(e.getMessage());
            event.setUpdatedAt(LocalDateTime.now());
            
            // If we haven't reached max attempts, set status to pending for retry
            if (event.getAttempts() < event.getMaxAttempts()) {
                event.setStatus(WebhookEvent.EventStatus.PENDING);
            } else {
                // Publish failure notification to Kafka
                kafkaProducerService.publishWebhookNotification(event, "FAILURE");
            }
        }
        
        eventRepository.save(event);
    }
    
    @Scheduled(fixedDelay = 60000) // Run every minute
    public void retryFailedWebhooks() {
        List<WebhookEvent> pendingEvents = eventRepository.findByStatusAndAttemptsLessThan(
            WebhookEvent.EventStatus.PENDING, 3
        );
        
        for (WebhookEvent event : pendingEvents) {
            // Add some delay between retries based on attempt count
            LocalDateTime nextRetryTime = event.getUpdatedAt().plusMinutes(event.getAttempts() * 5L);
            if (LocalDateTime.now().isAfter(nextRetryTime)) {
                deliverWebhookEvent(event);
            }
        }
    }
}