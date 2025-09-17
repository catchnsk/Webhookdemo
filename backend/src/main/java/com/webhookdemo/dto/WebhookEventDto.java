package com.webhookdemo.dto;

import com.webhookdemo.entity.WebhookEvent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class WebhookEventDto {
    
    private Long id;
    
    @NotBlank(message = "URL is required")
    private String url;
    
    @NotNull(message = "HTTP method is required")
    private WebhookEvent.HttpMethod method;
    
    private String headers;
    private String payload;
    private WebhookEvent.EventStatus status;
    private Integer attempts;
    private Integer maxAttempts;
    private Long responseTime;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public WebhookEventDto() {}
    
    public WebhookEventDto(WebhookEvent event) {
        this.id = event.getId();
        this.url = event.getUrl();
        this.method = event.getMethod();
        this.headers = event.getHeaders();
        this.payload = event.getPayload();
        this.status = event.getStatus();
        this.attempts = event.getAttempts();
        this.maxAttempts = event.getMaxAttempts();
        this.responseTime = event.getResponseTime();
        this.errorMessage = event.getErrorMessage();
        this.createdAt = event.getCreatedAt();
        this.updatedAt = event.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public WebhookEvent.HttpMethod getMethod() { return method; }
    public void setMethod(WebhookEvent.HttpMethod method) { this.method = method; }
    
    public String getHeaders() { return headers; }
    public void setHeaders(String headers) { this.headers = headers; }
    
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    
    public WebhookEvent.EventStatus getStatus() { return status; }
    public void setStatus(WebhookEvent.EventStatus status) { this.status = status; }
    
    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    
    public Integer getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }
    
    public Long getResponseTime() { return responseTime; }
    public void setResponseTime(Long responseTime) { this.responseTime = responseTime; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}