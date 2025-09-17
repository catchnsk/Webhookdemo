package com.webhookdemo.service;

import com.webhookdemo.dto.WebhookSubscriptionDto;
import com.webhookdemo.entity.WebhookSubscription;
import com.webhookdemo.repository.WebhookSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class WebhookSubscriptionService {
    
    @Autowired
    private WebhookSubscriptionRepository subscriptionRepository;
    
    public WebhookSubscriptionDto createSubscription(WebhookSubscriptionDto subscriptionDto) {
        if (subscriptionRepository.existsByUrl(subscriptionDto.getUrl())) {
            throw new RuntimeException("Subscription with this URL already exists");
        }
        
        WebhookSubscription subscription = new WebhookSubscription();
        subscription.setName(subscriptionDto.getName());
        subscription.setUrl(subscriptionDto.getUrl());
        subscription.setEvents(subscriptionDto.getEvents());
        subscription.setSecret(subscriptionDto.getSecret());
        subscription.setIsActive(subscriptionDto.getIsActive() != null ? subscriptionDto.getIsActive() : true);
        
        WebhookSubscription savedSubscription = subscriptionRepository.save(subscription);
        return new WebhookSubscriptionDto(savedSubscription);
    }
    
    public List<WebhookSubscriptionDto> getAllSubscriptions() {
        return subscriptionRepository.findAll()
                .stream()
                .map(WebhookSubscriptionDto::new)
                .collect(Collectors.toList());
    }
    
    public List<WebhookSubscriptionDto> getActiveSubscriptions() {
        return subscriptionRepository.findByIsActiveTrue()
                .stream()
                .map(WebhookSubscriptionDto::new)
                .collect(Collectors.toList());
    }
    
    public Optional<WebhookSubscriptionDto> getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id).map(WebhookSubscriptionDto::new);
    }
    
    public WebhookSubscriptionDto updateSubscription(Long id, WebhookSubscriptionDto subscriptionDto) {
        Optional<WebhookSubscription> subscriptionOpt = subscriptionRepository.findById(id);
        if (subscriptionOpt.isPresent()) {
            WebhookSubscription subscription = subscriptionOpt.get();
            
            if (subscriptionDto.getName() != null) {
                subscription.setName(subscriptionDto.getName());
            }
            if (subscriptionDto.getUrl() != null) {
                subscription.setUrl(subscriptionDto.getUrl());
            }
            if (subscriptionDto.getEvents() != null) {
                subscription.setEvents(subscriptionDto.getEvents());
            }
            if (subscriptionDto.getSecret() != null) {
                subscription.setSecret(subscriptionDto.getSecret());
            }
            if (subscriptionDto.getIsActive() != null) {
                subscription.setIsActive(subscriptionDto.getIsActive());
            }
            
            WebhookSubscription updatedSubscription = subscriptionRepository.save(subscription);
            return new WebhookSubscriptionDto(updatedSubscription);
        } else {
            throw new RuntimeException("Subscription not found");
        }
    }
    
    public void deleteSubscription(Long id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new RuntimeException("Subscription not found");
        }
        subscriptionRepository.deleteById(id);
    }
    
    public List<WebhookSubscriptionDto> searchSubscriptions(String query) {
        List<WebhookSubscription> subscriptions = subscriptionRepository.findByNameContainingIgnoreCase(query);
        subscriptions.addAll(subscriptionRepository.findByUrlContainingIgnoreCase(query));
        
        return subscriptions.stream()
                .distinct()
                .map(WebhookSubscriptionDto::new)
                .collect(Collectors.toList());
    }
    
    public List<WebhookSubscriptionDto> getSubscriptionsByEvent(String eventName) {
        return subscriptionRepository.findActiveSubscriptionsByEvent(eventName)
                .stream()
                .map(WebhookSubscriptionDto::new)
                .collect(Collectors.toList());
    }
}