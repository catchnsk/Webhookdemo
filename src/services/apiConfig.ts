// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Authentication configuration
export const AUTH_CONFIG = {
  USERNAME: 'admin',
  PASSWORD: 'password',
};

// Helper to create Basic Auth header
export const createAuthHeader = () => {
  return 'Basic ' + btoa(`${AUTH_CONFIG.USERNAME}:${AUTH_CONFIG.PASSWORD}`);
};

// Environment-specific configurations
export const getApiUrl = (endpoint: string) => {
  const baseUrl = API_CONFIG.BASE_URL;
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};