package com.webhookdemo.dto;

import com.webhookdemo.entity.WebhookEvent;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class WebhookNotificationDto {
    
    private Long eventId;
    private String url;
    private String method;
    private String headers;
    private String payload;
    private String status;
    private Integer attempts;
    private Integer maxAttempts;
    private String errorMessage;
    private String notificationType; // NEW_EVENT, RETRY, SUCCESS, FAILURE
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    // Constructors
    public WebhookNotificationDto() {
        this.timestamp = LocalDateTime.now();
    }
    
    public WebhookNotificationDto(WebhookEvent event, String notificationType) {
        this.eventId = event.getId();
        this.url = event.getUrl();
        this.method = event.getMethod().name();
        this.headers = event.getHeaders();
        this.payload = event.getPayload();
        this.status = event.getStatus().name();
        this.attempts = event.getAttempts();
        this.maxAttempts = event.getMaxAttempts();
        this.errorMessage = event.getErrorMessage();
        this.notificationType = notificationType;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    
    public String getHeaders() { return headers; }
    public void setHeaders(String headers) { this.headers = headers; }
    
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    
    public Integer getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}