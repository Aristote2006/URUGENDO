import express from 'express';
import {
  getAllPublishedExercises,
  getExerciseByLessonId,
  startOrResumeAttempt,
  submitAnswer,
  getAttemptById,
} from '../controllers/customerExerciseController.js';
import { authenticateUser, requireActiveSubscription } from '../middleware/auth.js';

const router = express.Router();

// Require user authentication & active subscription for customer exercise routes
router.use(authenticateUser);
router.use(requireActiveSubscription);

// List all published exercises for customers
router.get('/', getAllPublishedExercises);

// Get published exercise for a lesson (customer sanitized)
router.get('/lesson/:lessonId', getExerciseByLessonId);

// Start a new attempt or resume active attempt
router.post('/:exerciseId/start', startOrResumeAttempt);

// Submit an answer to a question in an active attempt
router.post('/:exerciseId/attempts/:attemptId/answer', submitAnswer);

// Get attempt details & full review
router.get('/:exerciseId/attempts/:attemptId', getAttemptById);

export default router;

