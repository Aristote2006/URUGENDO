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
import { getLearningOverview } from '../controllers/adminLearningController.js';
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

// Learning Management Foundation
router.get('/learning', getLearningOverview);

// Admin Profile
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

export default router;

