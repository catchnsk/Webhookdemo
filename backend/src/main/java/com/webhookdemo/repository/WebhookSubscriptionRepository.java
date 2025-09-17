package com.webhookdemo.repository;

import com.webhookdemo.entity.WebhookSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookSubscriptionRepository extends JpaRepository<WebhookSubscription, Long> {
    
    List<WebhookSubscription> findByIsActiveTrue();
    
    List<WebhookSubscription> findByIsActiveFalse();
    
    @Query("SELECT s FROM WebhookSubscription s JOIN s.events e WHERE e = :eventName AND s.isActive = true")
    List<WebhookSubscription> findActiveSubscriptionsByEvent(@Param("eventName") String eventName);
    
    List<WebhookSubscription> findByNameContainingIgnoreCase(String name);
    
    List<WebhookSubscription> findByUrlContainingIgnoreCase(String url);
    
    boolean existsByUrl(String url);
}