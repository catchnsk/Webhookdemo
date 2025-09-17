package com.webhookdemo.service;

import com.webhookdemo.dto.WebhookEventDto;
import com.webhookdemo.dto.WebhookStatsDto;
import com.webhookdemo.entity.WebhookEvent;
import com.webhookdemo.repository.WebhookEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class WebhookEventService {
    
    @Autowired
    private WebhookEventRepository eventRepository;
    
    @Autowired
    private WebhookDeliveryService deliveryService;
    
    public WebhookEventDto createEvent(WebhookEventDto eventDto) {
        WebhookEvent event = new WebhookEvent();
        event.setUrl(eventDto.getUrl());
        event.setMethod(eventDto.getMethod());
        event.setHeaders(eventDto.getHeaders());
        event.setPayload(eventDto.getPayload());
        event.setStatus(WebhookEvent.EventStatus.PENDING);
        event.setAttempts(0);
        event.setMaxAttempts(eventDto.getMaxAttempts() != null ? eventDto.getMaxAttempts() : 3);
        
        WebhookEvent savedEvent = eventRepository.save(event);
        
        // Trigger async delivery
        deliveryService.deliverWebhook(savedEvent.getId());
        
        return new WebhookEventDto(savedEvent);
    }
    
    public List<WebhookEventDto> getAllEvents() {
        return eventRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(WebhookEventDto::new)
                .collect(Collectors.toList());
    }
    
    public Page<WebhookEventDto> getEventsPaginated(int page, int size, String status, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<WebhookEvent> events;
        if (status != null && !status.equals("all")) {
            WebhookEvent.EventStatus eventStatus = WebhookEvent.EventStatus.valueOf(status.toUpperCase());
            events = eventRepository.findByStatusOrderByCreatedAtDesc(eventStatus, pageable);
        } else if (search != null && !search.isEmpty()) {
            events = eventRepository.findByUrlContainingIgnoreCaseOrderByCreatedAtDesc(search, pageable);
        } else {
            events = eventRepository.findAll(pageable);
        }
        
        return events.map(WebhookEventDto::new);
    }
    
    public Optional<WebhookEventDto> getEventById(Long id) {
        return eventRepository.findById(id).map(WebhookEventDto::new);
    }
    
    public WebhookEventDto retryEvent(Long id) {
        Optional<WebhookEvent> eventOpt = eventRepository.findById(id);
        if (eventOpt.isPresent()) {
            WebhookEvent event = eventOpt.get();
            if (event.getAttempts() < event.getMaxAttempts()) {
                event.setStatus(WebhookEvent.EventStatus.RETRYING);
                event.setErrorMessage(null);
                WebhookEvent savedEvent = eventRepository.save(event);
                
                // Trigger async retry
                deliveryService.deliverWebhook(savedEvent.getId());
                
                return new WebhookEventDto(savedEvent);
            } else {
                throw new RuntimeException("Maximum retry attempts reached");
            }
        } else {
            throw new RuntimeException("Event not found");
        }
    }
    
    public WebhookStatsDto getStatistics() {
        Long totalEvents = eventRepository.count();
        Long successfulEvents = eventRepository.countByStatus(WebhookEvent.EventStatus.SUCCESS);
        Long failedEvents = eventRepository.countByStatus(WebhookEvent.EventStatus.FAILED);
        Long pendingEvents = eventRepository.countByStatus(WebhookEvent.EventStatus.PENDING);
        Long retryingEvents = eventRepository.countByStatus(WebhookEvent.EventStatus.RETRYING);
        
        Double averageResponseTime = eventRepository.getAverageResponseTime();
        if (averageResponseTime == null) {
            averageResponseTime = 0.0;
        }
        
        Map<String, Long> eventsByStatus = new HashMap<>();
        eventsByStatus.put("success", successfulEvents);
        eventsByStatus.put("failed", failedEvents);
        eventsByStatus.put("pending", pendingEvents);
        eventsByStatus.put("retrying", retryingEvents);
        
        List<WebhookEventDto> recentEvents = eventRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(WebhookEventDto::new)
                .collect(Collectors.toList());
        
        return new WebhookStatsDto(totalEvents, successfulEvents, failedEvents, 
                                  averageResponseTime, eventsByStatus, recentEvents);
    }
    
    public List<WebhookEventDto> getFailedEvents() {
        return eventRepository.findByStatusOrderByCreatedAtDesc(WebhookEvent.EventStatus.FAILED)
                .stream()
                .map(WebhookEventDto::new)
                .collect(Collectors.toList());
    }
    
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}