export interface WebhookEvent {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers: Record<string, string>;
  payload: any;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  responseTime?: number;
  errorMessage?: string;
}

export interface WebhookSubscription {
  id: string;
  name: string;
  url: string;
  events: string[] | Set<string>;
  secret: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookStats {
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  averageResponseTime: number;
  eventsByStatus: {
    pending: number;
    success: number;
    failed: number;
    retrying: number;
  };
  recentEvents: WebhookEvent[];
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
  createdAt: string;
  lastLogin?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}