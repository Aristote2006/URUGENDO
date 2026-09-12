import express from 'express';
import { getTrafficSigns } from '../controllers/trafficSignController.js';

const router = express.Router();

router.get('/', getTrafficSigns);

export default router;
