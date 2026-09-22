/**
 * Urugendo Customer Lesson Service
 * Interacts with /api/lessons endpoints for curriculum and video progress tracking.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('urugendo_customer_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.locked = data.locked;
    error.requiredLesson = data.requiredLesson;
    throw error;
  }
  return data;
};

export const lessonService = {
  /**
   * Fetch all published lessons with user progress & locking state
   */
  async getLessons() {
    const res = await fetch(`${API_BASE_URL}/lessons`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Fetch a single lesson by ID with sequential unlocking validation
   */
  async getLessonById(id) {
    const res = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Sync current playback position, furthest point, and check for completion
   */
  async updateProgress(lessonId, { currentTime, duration }) {
    const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentTime, duration }),
    });
    return handleResponse(res);
  },

  /**
   * Explicit video completion trigger (on video end)
   */
  async markVideoComplete(lessonId) {
    const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}/video-complete`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

export default lessonService;

