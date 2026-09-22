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

const safeFetch = async (url, options, retries = 1) => {
  try {
    const res = await fetch(url, options);
    if (res.status === 502 && retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return await safeFetch(url, options, retries - 1);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return await safeFetch(url, options, retries - 1);
    }
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

  // Learning Management
  async getLearningOverview() {
    const res = await safeFetch(`${API_BASE_URL}/admin/lessons`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getLessons() {
    const res = await safeFetch(`${API_BASE_URL}/admin/lessons`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getLessonById(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/lessons/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createLesson(data) {
    const res = await safeFetch(`${API_BASE_URL}/admin/lessons`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateLesson(id, data) {
    const res = await safeFetch(`${API_BASE_URL}/admin/lessons/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteLesson(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/lessons/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async togglePublishLesson(id, isPublished) {
    const res = await safeFetch(`${API_BASE_URL}/admin/lessons/${id}/publish`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ isPublished }),
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

  // Exercise & Question Bank Management (Phase 3A)
  async getExercises(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises?${query}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getExerciseById(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createExercise(data) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateExercise(id, data) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteExercise(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async importExerciseDocuments(id, formData) {
    const token = localStorage.getItem('urugendo_admin_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}/import`, {
      method: 'POST',
      headers, // Do NOT set Content-Type so browser sets multipart boundary
      body: formData,
    });
    return handleResponse(res);
  },

  async getExerciseQuestions(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}/questions`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateExerciseQuestion(id, questionId, data) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}/questions/${questionId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async approveExerciseQuestion(id, questionId) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}/questions/${questionId}/approve`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async approveAllValidQuestions(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}/approve-valid`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async publishExercise(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}/publish`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async unpublishExercise(id) {
    const res = await safeFetch(`${API_BASE_URL}/admin/exercises/${id}/unpublish`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

