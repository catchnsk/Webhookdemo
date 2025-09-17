package com.webhookdemo.controller;

import com.webhookdemo.dto.WebhookEventDto;
import com.webhookdemo.dto.WebhookStatsDto;
import com.webhookdemo.service.WebhookEventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class WebhookEventController {
    
    @Autowired
    private WebhookEventService eventService;
    
    @PostMapping
    public ResponseEntity<WebhookEventDto> createEvent(@Valid @RequestBody WebhookEventDto eventDto) {
        try {
            WebhookEventDto createdEvent = eventService.createEvent(eventDto);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<WebhookEventDto>> getAllEvents() {
        List<WebhookEventDto> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<WebhookEventDto>> getEventsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        Page<WebhookEventDto> events = eventService.getEventsPaginated(page, size, status, search);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<WebhookEventDto> getEventById(@PathVariable Long id) {
        Optional<WebhookEventDto> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{id}/retry")
    public ResponseEntity<WebhookEventDto> retryEvent(@PathVariable Long id) {
        try {
            WebhookEventDto retriedEvent = eventService.retryEvent(id);
            return ResponseEntity.ok(retriedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<WebhookStatsDto> getStatistics() {
        WebhookStatsDto stats = eventService.getStatistics();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/failed")
    public ResponseEntity<List<WebhookEventDto>> getFailedEvents() {
        List<WebhookEventDto> failedEvents = eventService.getFailedEvents();
        return ResponseEntity.ok(failedEvents);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}