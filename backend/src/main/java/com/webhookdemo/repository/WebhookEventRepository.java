package com.webhookdemo.repository;

import com.webhookdemo.entity.WebhookEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {
    
    List<WebhookEvent> findByStatusOrderByCreatedAtDesc(WebhookEvent.EventStatus status);
    
    List<WebhookEvent> findByStatusAndAttemptsLessThan(WebhookEvent.EventStatus status, Integer maxAttempts);
    
    Page<WebhookEvent> findByUrlContainingIgnoreCaseOrderByCreatedAtDesc(String url, Pageable pageable);
    
    Page<WebhookEvent> findByStatusOrderByCreatedAtDesc(WebhookEvent.EventStatus status, Pageable pageable);
    
    List<WebhookEvent> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(e) FROM WebhookEvent e WHERE e.status = :status")
    Long countByStatus(@Param("status") WebhookEvent.EventStatus status);
    
    @Query("SELECT AVG(e.responseTime) FROM WebhookEvent e WHERE e.responseTime IS NOT NULL")
    Double getAverageResponseTime();
    
    @Query("SELECT e FROM WebhookEvent e WHERE e.createdAt >= :startDate ORDER BY e.createdAt DESC")
    List<WebhookEvent> findEventsAfterDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(e) FROM WebhookEvent e WHERE e.createdAt >= :startDate AND e.createdAt <= :endDate")
    Long countEventsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}