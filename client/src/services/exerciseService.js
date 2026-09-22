/**
 * Urugendo Customer Exercise Service
 * Interacts with /api/exercises endpoints for published exercises,
 * question attempts, answer submission, immediate feedback, and scoring.
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
    error.data = data;
    throw error;
  }
  return data;
};

export const exerciseService = {
  /**
   * Fetch all published exercises for the student
   */
  async getExercises() {
    const res = await fetch(`${API_BASE_URL}/exercises`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Fetch published exercise for a specific lesson (customer sanitized)
   * @param {string} lessonId
   */
  async getExerciseForLesson(lessonId) {
    const res = await fetch(`${API_BASE_URL}/exercises/lesson/${lessonId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Start a new attempt or resume active attempt
   * @param {string} exerciseId
   * @param {boolean} [retake=false]
   */
  async startOrResumeAttempt(exerciseId, retake = false) {
    const res = await fetch(`${API_BASE_URL}/exercises/${exerciseId}/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ retake }),
    });
    return handleResponse(res);
  },

  /**
   * Submit an answer to a question in an active attempt
   * @param {string} exerciseId
   * @param {string} attemptId
   * @param {string} questionId
   * @param {string} selectedOption - e.g. 'A', 'B', 'C'
   */
  async submitAnswer(exerciseId, attemptId, questionId, selectedOption) {
    const res = await fetch(
      `${API_BASE_URL}/exercises/${exerciseId}/attempts/${attemptId}/answer`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ questionId, selectedOption }),
      }
    );
    return handleResponse(res);
  },

  /**
   * Get attempt details and full review questions
   * @param {string} exerciseId
   * @param {string} attemptId
   */
  async getAttempt(exerciseId, attemptId) {
    const res = await fetch(
      `${API_BASE_URL}/exercises/${exerciseId}/attempts/${attemptId}`,
      {
        headers: getHeaders(),
      }
    );
    return handleResponse(res);
  },
};

export default exerciseService;

