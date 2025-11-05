import express from 'express';
import { getStudentDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/student', getStudentDashboard)

export default router;