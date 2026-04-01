import api from './api.js';
import { useAuthStore } from '../stores/auth.js';

// Base API endpoints
const WEBINAR_ENDPOINTS = {
  list: '/api/webinars',
  create: '/api/webinars',
  register: (id) => `/api/webinars/${id}/register`,
  stats: (id) => `/api/analytics/webinar/${id}`
};

// Create webinar
export const createWebinar = async (webinarData) => {
  const authStore = useAuthStore();
  
  try {
    const response = await api.post(WEBINAR_ENDPOINTS.create, webinarData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create webinar',
      status: error.response?.status
    };
  }
};

// Register for webinar (supports guest registration)
export const registerForWebinar = async (webinarId, registrationData) => {
  try {
    const response = await api.post(WEBINAR_ENDPOINTS.register(webinarId), registrationData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Registration failed',
      status: error.response?.status
    };
  }
};

// Get webinar statistics (host only)
export const getWebinarStats = async (webinarId) => {
  const authStore = useAuthStore();
  
  try {
    const response = await api.get(WEBINAR_ENDPOINTS.stats(webinarId), {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch stats',
      status: error.response?.status
    };
  }
};

// Get upcoming webinars (public)
export const getUpcomingWebinars = async (filters = {}) => {
  try {
    const params = new URLSearchParams({
      status: 'scheduled',
      limit: 10,
      ...filters
    });

    const response = await api.get(`${WEBINAR_ENDPOINTS.list}?${params}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch webinars'
    };
  }
};

// Batch operations
export const bulkRegister = async (webinarId, emails) => {
  const results = [];
  
  for (const emailData of emails) {
    const result = await registerForWebinar(webinarId, emailData);
    results.push(result);
  }
  
  return {
    success: results.every(r => r.success),
    results,
    total: results.length
  };
};

export default {
  createWebinar,
  registerForWebinar,
  getWebinarStats,
  getUpcomingWebinars,
  bulkRegister
};

