import express from 'express';
import { AnalyticsController } from '../controllers/analytics.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes require authentication and admin/recruiter role
router.use(authenticate);
router.use(authorize(['admin', 'recruiter']));

// Dashboard stats
router.get('/dashboard', AnalyticsController.getDashboardStats);

// Overview stats (detailed)
router.get('/overview', AnalyticsController.getOverviewStats);

// Recent activity
router.get('/activity', AnalyticsController.getRecentActivity);

// Pipeline statistics
router.get('/pipeline', AnalyticsController.getPipelineStats);

// Time to hire metrics
router.get('/time-to-hire', AnalyticsController.getTimeToHire);

export default router;
