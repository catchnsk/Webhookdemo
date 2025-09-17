package com.webhookdemo.dto;

import java.util.List;
import java.util.Map;

public class WebhookStatsDto {
    
    private Long totalEvents;
    private Long successfulEvents;
    private Long failedEvents;
    private Double averageResponseTime;
    private Map<String, Long> eventsByStatus;
    private List<WebhookEventDto> recentEvents;
    
    // Constructors
    public WebhookStatsDto() {}
    
    public WebhookStatsDto(Long totalEvents, Long successfulEvents, Long failedEvents, 
                          Double averageResponseTime, Map<String, Long> eventsByStatus, 
                          List<WebhookEventDto> recentEvents) {
        this.totalEvents = totalEvents;
        this.successfulEvents = successfulEvents;
        this.failedEvents = failedEvents;
        this.averageResponseTime = averageResponseTime;
        this.eventsByStatus = eventsByStatus;
        this.recentEvents = recentEvents;
    }
    
    // Getters and Setters
    public Long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Long totalEvents) { this.totalEvents = totalEvents; }
    
    public Long getSuccessfulEvents() { return successfulEvents; }
    public void setSuccessfulEvents(Long successfulEvents) { this.successfulEvents = successfulEvents; }
    
    public Long getFailedEvents() { return failedEvents; }
    public void setFailedEvents(Long failedEvents) { this.failedEvents = failedEvents; }
    
    public Double getAverageResponseTime() { return averageResponseTime; }
    public void setAverageResponseTime(Double averageResponseTime) { this.averageResponseTime = averageResponseTime; }
    
    public Map<String, Long> getEventsByStatus() { return eventsByStatus; }
    public void setEventsByStatus(Map<String, Long> eventsByStatus) { this.eventsByStatus = eventsByStatus; }
    
    public List<WebhookEventDto> getRecentEvents() { return recentEvents; }
    public void setRecentEvents(List<WebhookEventDto> recentEvents) { this.recentEvents = recentEvents; }
}