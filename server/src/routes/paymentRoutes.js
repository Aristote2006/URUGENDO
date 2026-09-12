import express from 'express';
import {
  initiatePayment,
  verifyPayment,
  submitPaymentProof,
  getMyPaymentStatus,
} from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.get('/verify/:reference', verifyPayment);
router.post('/submit-proof', authenticateUser, submitPaymentProof);
router.get('/status', authenticateUser, getMyPaymentStatus);

export default router;
