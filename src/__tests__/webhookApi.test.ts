import { WebhookApi } from '../services/webhookApi';
import { WebhookEvent, WebhookSubscription } from '../types/webhook';

// Mock implementation for testing
describe('WebhookApi Tests', () => {
  describe('Publisher functionality', () => {
    test('should publish a webhook event', async () => {
      const eventData = {
        url: 'https://test.example.com/webhook',
        method: 'POST' as const,
        headers: { 'Content-Type': 'application/json' },
        payload: { test: true },
        status: 'pending' as const,
        attempts: 0,
        maxAttempts: 3
      };

      const result = await WebhookApi.publishEvent(eventData);
      
      expect(result.url).toBe(eventData.url);
      expect(result.method).toBe(eventData.method);
      expect(result.status).toBe(eventData.status);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    test('should get all events', async () => {
      const events = await WebhookApi.getEvents();
      expect(Array.isArray(events)).toBe(true);
    });

    test('should retry a failed event', async () => {
      // First publish an event
      const eventData = {
        url: 'https://test.example.com/webhook',
        method: 'POST' as const,
        headers: { 'Content-Type': 'application/json' },
        payload: { test: true },
        status: 'failed' as const,
        attempts: 1,
        maxAttempts: 3
      };

      const event = await WebhookApi.publishEvent(eventData);
      const retriedEvent = await WebhookApi.retryEvent(event.id);
      
      expect(retriedEvent.attempts).toBeGreaterThan(event.attempts);
      expect(retriedEvent.id).toBe(event.id);
    });
  });

  describe('Consumer functionality', () => {
    test('should create a webhook subscription', async () => {
      const subscriptionData = {
        name: 'Test Subscription',
        url: 'https://api.test.com/webhook',
        events: ['user.created', 'user.updated'],
        secret: 'test_secret_123',
        isActive: true
      };

      const result = await WebhookApi.createSubscription(subscriptionData);
      
      expect(result.name).toBe(subscriptionData.name);
      expect(result.url).toBe(subscriptionData.url);
      expect(result.events).toEqual(subscriptionData.events);
      expect(result.secret).toBe(subscriptionData.secret);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });

    test('should get all subscriptions', async () => {
      const subscriptions = await WebhookApi.getSubscriptions();
      expect(Array.isArray(subscriptions)).toBe(true);
    });

    test('should update a subscription', async () => {
      const subscriptions = await WebhookApi.getSubscriptions();
      if (subscriptions.length > 0) {
        const subscription = subscriptions[0];
        const updatedSubscription = await WebhookApi.updateSubscription(
          subscription.id, 
          { name: 'Updated Name' }
        );
        
        expect(updatedSubscription.name).toBe('Updated Name');
        expect(updatedSubscription.id).toBe(subscription.id);
      }
    });

    test('should delete a subscription', async () => {
      // Create a subscription first
      const subscriptionData = {
        name: 'To Delete',
        url: 'https://api.test.com/webhook',
        events: ['test.event'],
        secret: 'test_secret',
        isActive: true
      };

      const created = await WebhookApi.createSubscription(subscriptionData);
      
      // Delete it
      await expect(WebhookApi.deleteSubscription(created.id)).resolves.not.toThrow();
    });
  });

  describe('Statistics functionality', () => {
    test('should get webhook statistics', async () => {
      const stats = await WebhookApi.getStats();
      
      expect(stats.totalEvents).toBeDefined();
      expect(stats.successfulEvents).toBeDefined();
      expect(stats.failedEvents).toBeDefined();
      expect(stats.averageResponseTime).toBeDefined();
      expect(stats.eventsByStatus).toBeDefined();
      expect(stats.recentEvents).toBeDefined();
      expect(Array.isArray(stats.recentEvents)).toBe(true);
    });
  });

  describe('Admin functionality', () => {
    test('should register an admin', async () => {
      const adminData = {
        email: 'test@example.com',
        name: 'Test Admin',
        password: 'testpassword'
      };

      const result = await WebhookApi.registerAdmin(adminData);
      
      expect(result.email).toBe(adminData.email);
      expect(result.name).toBe(adminData.name);
      expect(result.role).toBe('admin');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });

    test('should login admin with correct credentials', async () => {
      const result = await WebhookApi.loginAdmin('admin@webhook.com', 'password');
      
      expect(result.email).toBe('admin@webhook.com');
      expect(result.role).toBe('admin');
      expect(result.lastLogin).toBeDefined();
    });

    test('should reject login with incorrect credentials', async () => {
      await expect(
        WebhookApi.loginAdmin('wrong@email.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Error handling', () => {
    test('should handle non-existent event retry', async () => {
      await expect(
        WebhookApi.retryEvent('non-existent-id')
      ).rejects.toThrow('Event not found');
    });

    test('should handle non-existent subscription update', async () => {
      await expect(
        WebhookApi.updateSubscription('non-existent-id', { name: 'Updated' })
      ).rejects.toThrow('Subscription not found');
    });
  });
});