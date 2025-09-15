import { WebhookEvent, WebhookSubscription, WebhookStats, Admin } from '../types/webhook';

// Mock data for demonstration
const mockEvents: WebhookEvent[] = [
  {
    id: '1',
    url: 'https://api.example.com/webhooks/user-created',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': 'secret123' },
    payload: { userId: '123', action: 'user.created' },
    status: 'success',
    attempts: 1,
    maxAttempts: 3,
    createdAt: '2025-01-27T10:30:00Z',
    updatedAt: '2025-01-27T10:30:05Z',
    responseTime: 150
  },
  {
    id: '2',
    url: 'https://api.partner.com/notifications',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: { orderId: '456', status: 'completed' },
    status: 'failed',
    attempts: 3,
    maxAttempts: 3,
    createdAt: '2025-01-27T09:15:00Z',
    updatedAt: '2025-01-27T09:45:00Z',
    errorMessage: 'Connection timeout'
  }
];

const mockSubscriptions: WebhookSubscription[] = [
  {
    id: '1',
    name: 'User Management Webhook',
    url: 'https://api.example.com/webhooks/user-events',
    events: ['user.created', 'user.updated', 'user.deleted'],
    secret: 'webhook_secret_123',
    isActive: true,
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-27T10:00:00Z'
  },
  {
    id: '2',
    name: 'Order Processing Webhook',
    url: 'https://api.partner.com/notifications',
    events: ['order.created', 'order.completed', 'order.cancelled'],
    secret: 'webhook_secret_456',
    isActive: false,
    createdAt: '2025-01-18T14:30:00Z',
    updatedAt: '2025-01-26T16:20:00Z'
  }
];

export class WebhookApi {
  // Publisher methods
  static async publishEvent(eventData: Omit<WebhookEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebhookEvent> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const event: WebhookEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockEvents.unshift(event);
    return event;
  }

  static async getEvents(): Promise<WebhookEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockEvents];
  }

  static async retryEvent(eventId: string): Promise<WebhookEvent> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const eventIndex = mockEvents.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        attempts: mockEvents[eventIndex].attempts + 1,
        status: Math.random() > 0.5 ? 'success' : 'failed',
        updatedAt: new Date().toISOString()
      };
      return mockEvents[eventIndex];
    }
    throw new Error('Event not found');
  }

  // Consumer methods
  static async getSubscriptions(): Promise<WebhookSubscription[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockSubscriptions];
  }

  static async createSubscription(subscription: Omit<WebhookSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebhookSubscription> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newSubscription: WebhookSubscription = {
      ...subscription,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockSubscriptions.push(newSubscription);
    return newSubscription;
  }

  static async updateSubscription(id: string, updates: Partial<WebhookSubscription>): Promise<WebhookSubscription> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockSubscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSubscriptions[index] = {
        ...mockSubscriptions[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockSubscriptions[index];
    }
    throw new Error('Subscription not found');
  }

  static async deleteSubscription(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockSubscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSubscriptions.splice(index, 1);
    }
  }

  // Stats methods
  static async getStats(): Promise<WebhookStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalEvents = mockEvents.length;
    const successfulEvents = mockEvents.filter(e => e.status === 'success').length;
    const failedEvents = mockEvents.filter(e => e.status === 'failed').length;
    const avgResponseTime = mockEvents
      .filter(e => e.responseTime)
      .reduce((sum, e) => sum + (e.responseTime || 0), 0) / 
      mockEvents.filter(e => e.responseTime).length || 0;

    return {
      totalEvents,
      successfulEvents,
      failedEvents,
      averageResponseTime: Math.round(avgResponseTime),
      eventsByStatus: {
        pending: mockEvents.filter(e => e.status === 'pending').length,
        success: successfulEvents,
        failed: failedEvents,
        retrying: mockEvents.filter(e => e.status === 'retrying').length
      },
      recentEvents: mockEvents.slice(0, 10)
    };
  }

  // Admin methods
  static async registerAdmin(adminData: { email: string; name: string; password: string }): Promise<Admin> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      email: adminData.email,
      name: adminData.name,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
  }

  static async loginAdmin(email: string, password: string): Promise<Admin> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock authentication
    if (email === 'admin@webhook.com' && password === 'password') {
      return {
        id: '1',
        email: 'admin@webhook.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      };
    }
    throw new Error('Invalid credentials');
  }
}