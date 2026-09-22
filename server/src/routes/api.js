import express from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import trafficSignRoutes from './trafficSignRoutes.js';
import examRoutes from './examRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import exerciseRoutes from './exerciseRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'urugendo-api',
    version: '1.0.0',
  });
});

// Admin Domain Routes
router.use('/admin', adminRoutes);

// Customer & Public Domain Routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/traffic-signs', trafficSignRoutes);
router.use('/exams', examRoutes);
router.use('/payments', paymentRoutes);
router.use('/lessons', lessonRoutes);
router.use('/exercises', exerciseRoutes);

export default router;
