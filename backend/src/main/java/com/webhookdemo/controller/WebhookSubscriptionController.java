package com.webhookdemo.controller;

import com.webhookdemo.dto.WebhookSubscriptionDto;
import com.webhookdemo.service.WebhookSubscriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = "*")
public class WebhookSubscriptionController {
    
    @Autowired
    private WebhookSubscriptionService subscriptionService;
    
    @PostMapping
    public ResponseEntity<WebhookSubscriptionDto> createSubscription(@Valid @RequestBody WebhookSubscriptionDto subscriptionDto) {
        try {
            WebhookSubscriptionDto createdSubscription = subscriptionService.createSubscription(subscriptionDto);
            return new ResponseEntity<>(createdSubscription, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<WebhookSubscriptionDto>> getAllSubscriptions() {
        List<WebhookSubscriptionDto> subscriptions = subscriptionService.getAllSubscriptions();
        return ResponseEntity.ok(subscriptions);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<WebhookSubscriptionDto>> getActiveSubscriptions() {
        List<WebhookSubscriptionDto> activeSubscriptions = subscriptionService.getActiveSubscriptions();
        return ResponseEntity.ok(activeSubscriptions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<WebhookSubscriptionDto> getSubscriptionById(@PathVariable Long id) {
        Optional<WebhookSubscriptionDto> subscription = subscriptionService.getSubscriptionById(id);
        return subscription.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<WebhookSubscriptionDto> updateSubscription(
            @PathVariable Long id, 
            @Valid @RequestBody WebhookSubscriptionDto subscriptionDto) {
        try {
            WebhookSubscriptionDto updatedSubscription = subscriptionService.updateSubscription(id, subscriptionDto);
            return ResponseEntity.ok(updatedSubscription);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        try {
            subscriptionService.deleteSubscription(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<WebhookSubscriptionDto>> searchSubscriptions(@RequestParam String query) {
        List<WebhookSubscriptionDto> subscriptions = subscriptionService.searchSubscriptions(query);
        return ResponseEntity.ok(subscriptions);
    }
    
    @GetMapping("/by-event/{eventName}")
    public ResponseEntity<List<WebhookSubscriptionDto>> getSubscriptionsByEvent(@PathVariable String eventName) {
        List<WebhookSubscriptionDto> subscriptions = subscriptionService.getSubscriptionsByEvent(eventName);
        return ResponseEntity.ok(subscriptions);
    }
}