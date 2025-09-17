package com.webhookdemo.dto;

import com.webhookdemo.entity.WebhookSubscription;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;
import java.util.Set;

public class WebhookSubscriptionDto {
    
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "URL is required")
    private String url;
    
    @NotEmpty(message = "At least one event is required")
    private Set<String> events;
    
    @NotBlank(message = "Secret is required")
    private String secret;
    
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public WebhookSubscriptionDto() {}
    
    public WebhookSubscriptionDto(WebhookSubscription subscription) {
        this.id = subscription.getId();
        this.name = subscription.getName();
        this.url = subscription.getUrl();
        this.events = subscription.getEvents();
        this.secret = subscription.getSecret();
        this.isActive = subscription.getIsActive();
        this.createdAt = subscription.getCreatedAt();
        this.updatedAt = subscription.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public Set<String> getEvents() { return events; }
    public void setEvents(Set<String> events) { this.events = events; }
    
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}