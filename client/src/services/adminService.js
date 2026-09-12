/**
 * Urugendo Admin API Service
 * Handles communication with the backend administration endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('urugendo_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const safeFetch = async (url, options) => {
  try {
    return await fetch(url, options);
  } catch (err) {
    console.error('[AdminAPI] Network error:', err);
    throw new Error('Cannot connect to the server. Please ensure the backend server is running on port 5000.');
  }
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const adminService = {
  // Authentication
  async login(email, password) {
    const res = await safeFetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await safeFetch(`${API_BASE_URL}/admin/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async logout() {
    const res = await safeFetch(`${API_BASE_URL}/admin/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await safeFetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Users Management
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${API_BASE_URL}/admin/users?${query}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getUserById(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Payments Management
  async getPayments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${API_BASE_URL}/admin/payments?${query}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getPaymentById(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/payments/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async verifyPayment(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/payments/${id}/verify`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async rejectPayment(id, reason) {
    const res = await safeFetch(`${API_BASE_URL}/admin/payments/${id}/reject`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },

  // Subscriptions Management
  async getSubscriptions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${API_BASE_URL}/admin/subscriptions?${query}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Learning Management Foundation
  async getLearningOverview() {
    const res = await safeFetch(`${API_BASE_URL}/admin/learning`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Profile
  async getProfile() {
    const res = await safeFetch(`${API_BASE_URL}/admin/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(data) {
    const res = await safeFetch(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};

