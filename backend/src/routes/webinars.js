import express from 'express';
import { WebinarController } from '../controllers/webinars.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const webinarValidation = [
  body('title').notEmpty().withMessage('Webinar title is required'),
  body('scheduled_at').isISO8601().withMessage('Scheduled at must be a valid ISO 8601 date'),
  body('duration_minutes').optional().isInt({ min: 1 }),
  body('is_public').optional().isBoolean(),
];

const registrationValidation = [
  body('webinar_id').isUUID().withMessage('Webinar ID is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('first_name').isLength({ min: 2 }).trim().withMessage('First name must be at least 2 characters long'),
  body('last_name').isLength({ min: 2 }).trim().withMessage('Last name must be at least 2 characters long'),
  body('phone').optional().matches(/^[\d\s-+()]+$/).withMessage('Invalid phone number format'),
];

// Public routes
router.get('/', WebinarController.getAllWebinars);
router.get('/:identifier', WebinarController.getWebinar);

// Registration (with optional authentication)
router.post('/register',
  optionalAuthenticate,
  registrationValidation,
  validateRequest,
  WebinarController.register
);

// Recruiter/Admin routes
router.post('/',
  authenticate,
  authorize(['recruiter', 'admin']),
  webinarValidation,
  validateRequest,
  WebinarController.createWebinar
);

export default router;
