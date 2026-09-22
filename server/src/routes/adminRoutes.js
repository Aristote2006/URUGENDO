import express from 'express';
import {
  adminLogin,
  getAdminMe,
  adminLogout,
} from '../controllers/adminAuthController.js';
import { getDashboardStats } from '../controllers/adminDashboardController.js';
import { getUsers, getUserById } from '../controllers/adminUserController.js';
import {
  getPayments,
  getPaymentById,
  verifyPayment,
  rejectPayment,
} from '../controllers/adminPaymentController.js';
import { getSubscriptions } from '../controllers/adminSubscriptionController.js';
import {
  getLearningOverview,
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  togglePublishLesson,
  deleteLesson,
} from '../controllers/adminLearningController.js';
import {
  uploadExerciseDocs,
  getExercises,
  createExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
  importExerciseDocuments,
  getExerciseQuestions,
  updateExerciseQuestion,
  approveExerciseQuestion,
  approveAllValidQuestions,
  publishExercise,
  unpublishExercise,
} from '../controllers/adminExerciseController.js';
import {
  getAdminProfile,
  updateAdminProfile,
} from '../controllers/adminProfileController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public Admin Authentication Endpoint
router.post('/auth/login', adminLogin);
router.post('/auth/logout', adminLogout);

// Protected Admin Endpoints (Require valid JWT and role === 'admin')
router.use(authenticateUser, requireAdmin);

// Auth verification
router.get('/auth/me', getAdminMe);

// Dashboard Metrics
router.get('/dashboard/stats', getDashboardStats);

// Customer Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

// Payment Management & Manual Verification
router.get('/payments', getPayments);
router.get('/payments/:id', getPaymentById);
router.patch('/payments/:id/verify', verifyPayment);
router.patch('/payments/:id/reject', rejectPayment);

// Subscription Management
router.get('/subscriptions', getSubscriptions);

// Learning Management
router.get('/learning', getLearningOverview);
router.get('/lessons', getLessons);
router.post('/lessons', createLesson);
router.get('/lessons/:id', getLessonById);
router.patch('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);
router.patch('/lessons/:id/publish', togglePublishLesson);

// Exercise & Question Bank Management (Phase 3A)
router.get('/exercises', getExercises);
router.post('/exercises', createExercise);
router.get('/exercises/:id', getExerciseById);
router.put('/exercises/:id', updateExercise);
router.delete('/exercises/:id', deleteExercise);

router.post('/exercises/:id/import', uploadExerciseDocs, importExerciseDocuments);
router.get('/exercises/:id/questions', getExerciseQuestions);
router.put('/exercises/:id/questions/:questionId', updateExerciseQuestion);
router.post('/exercises/:id/questions/:questionId/approve', approveExerciseQuestion);
router.post('/exercises/:id/approve-valid', approveAllValidQuestions);
router.post('/exercises/:id/publish', publishExercise);
router.post('/exercises/:id/unpublish', unpublishExercise);

// Admin Profile
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

export default router;

