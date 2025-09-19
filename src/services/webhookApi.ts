import { WebhookEvent, WebhookSubscription, WebhookStats, Admin } from '../types/webhook';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

// Helper function to make authenticated requests
const makeRequest = async (url: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('admin:password'), // Basic auth
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: defaultHeaders,
  });

  return handleResponse(response);
};

export class WebhookApi {
  // Publisher methods
  static async publishEvent(eventData: Omit<WebhookEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebhookEvent> {
    const payload = {
      url: eventData.url,
      method: eventData.method,
      headers: JSON.stringify(eventData.headers),
      payload: JSON.stringify(eventData.payload),
      maxAttempts: eventData.maxAttempts || 3
    };

    const response = await makeRequest('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      ...response,
      id: response.id.toString(),
      headers: JSON.parse(response.headers || '{}'),
      payload: JSON.parse(response.payload || '{}'),
      createdAt: response.createdAt,
      updatedAt: response.updatedAt
    };
  }

  static async getEvents(): Promise<WebhookEvent[]> {
    const response = await makeRequest('/events');
    
    return response.map((event: any) => ({
      ...event,
      id: event.id.toString(),
      headers: JSON.parse(event.headers || '{}'),
      payload: JSON.parse(event.payload || '{}'),
      status: event.status.toLowerCase()
    }));
  }

  static async retryEvent(eventId: string): Promise<WebhookEvent> {
    const response = await makeRequest(`/events/${eventId}/retry`, {
      method: 'POST',
    });

    return {
      ...response,
      id: response.id.toString(),
      headers: JSON.parse(response.headers || '{}'),
      payload: JSON.parse(response.payload || '{}'),
      status: response.status.toLowerCase()
    };
  }

  // Consumer methods
  static async getSubscriptions(): Promise<WebhookSubscription[]> {
    const response = await makeRequest('/subscriptions');
    
    return response.map((subscription: any) => ({
      ...subscription,
      id: subscription.id.toString(),
      events: Array.from(subscription.events || [])
    }));
  }

  static async createSubscription(subscription: Omit<WebhookSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebhookSubscription> {
    const payload = {
      name: subscription.name,
      url: subscription.url,
      events: subscription.events,
      secret: subscription.secret,
      isActive: subscription.isActive
    };

    const response = await makeRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      ...response,
      id: response.id.toString(),
      events: Array.from(response.events || [])
    };
  }

  static async updateSubscription(id: string, updates: Partial<WebhookSubscription>): Promise<WebhookSubscription> {
    const payload = {
      name: updates.name,
      url: updates.url,
      events: updates.events,
      secret: updates.secret,
      isActive: updates.isActive
    };

    const response = await makeRequest(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return {
      ...response,
      id: response.id.toString(),
      events: Array.from(response.events || [])
    };
  }

  static async deleteSubscription(id: string): Promise<void> {
    await makeRequest(`/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Stats methods
  static async getStats(): Promise<WebhookStats> {
    const response = await makeRequest('/events/stats');
    
    return {
      totalEvents: response.totalEvents || 0,
      successfulEvents: response.successfulEvents || 0,
      failedEvents: response.failedEvents || 0,
      averageResponseTime: Math.round(response.averageResponseTime || 0),
      eventsByStatus: {
        pending: response.eventsByStatus?.pending || 0,
        success: response.eventsByStatus?.success || 0,
        failed: response.eventsByStatus?.failed || 0,
        retrying: response.eventsByStatus?.retrying || 0
      },
      recentEvents: (response.recentEvents || []).map((event: any) => ({
        ...event,
        id: event.id.toString(),
        headers: JSON.parse(event.headers || '{}'),
        payload: JSON.parse(event.payload || '{}'),
        status: event.status.toLowerCase()
      }))
    };
  }

  // Admin methods
  static async registerAdmin(adminData: { email: string; name: string; password: string }): Promise<Admin> {
    const response = await fetch(`${API_BASE_URL}/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const admin = await response.json();
    return {
      ...admin,
      id: admin.id.toString(),
      role: admin.role.toLowerCase()
    };
  }

  static async loginAdmin(email: string, password: string): Promise<Admin> {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const admin = await response.json();
    return {
      ...admin,
      id: admin.id.toString(),
      role: admin.role.toLowerCase()
    };
  }

  // Error handling helper
  static handleError(error: any): string {
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}