import express from 'express';
import { 
  createWebinar, 
  registerForWebinar, 
  getWebinarStats 
} from '../controllers/webinars.js';
import { authenticate, authorize, rateLimitMiddleware } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Create webinar - Recruiter only
router.post(
  '/',
  rateLimitMiddleware(10, 60 * 60 * 1000), // 10/hour
  authenticate,
  authorize(['recruiter', 'admin']),
  [
    // Add validation middleware here later
  ],
  validateRequest,
  createWebinar
);

// Register for webinar - Public/Guest
router.post(
  '/:webinar_id/register',
  rateLimitMiddleware(50, 60 * 60 * 1000), // 50/hour per IP
  registerForWebinar
);

// Get webinar analytics - Host only  
router.get(
  '/analytics/:webinar_id',
  authenticate,
  authorize(['recruiter', 'admin']),
  getWebinarStats
);

export default router;

