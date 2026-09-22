import express from 'express';
import {
  getLessons,
  getLessonById,
  updateProgress,
  markVideoComplete,
} from '../controllers/lessonController.js';
import { authenticateUser, requireActiveSubscription } from '../middleware/auth.js';

const router = express.Router();

// Require user authentication & active subscription for learning access
router.use(authenticateUser);
router.use(requireActiveSubscription);

// List lessons with sequential access & user progress
router.get('/', getLessons);

// Get single lesson details & verify sequential unlocking
router.get('/:id', getLessonById);

// Sync video watch progress (with anti-cheating validation)
router.post('/:id/progress', updateProgress);

// Explicit video completion trigger
router.post('/:id/video-complete', markVideoComplete);

export default router;

