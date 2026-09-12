import express from 'express';
import { getMockExams, submitExamAttempt } from '../controllers/examController.js';

const router = express.Router();

router.get('/', getMockExams);
router.post('/submit', submitExamAttempt);

export default router;
