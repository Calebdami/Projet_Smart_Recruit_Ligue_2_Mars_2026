import express from 'express';
import { AuditController } from '../controllers/audit.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { query } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply admin role requirement to all routes
router.use(requireRole('admin'));

// Validation rules
const auditQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('action').optional().isString().withMessage('Action must be a string'),
  query('entity_type').optional().isString().withMessage('Entity type must be a string'),
  query('user_id').optional().isUUID().withMessage('User ID must be a valid UUID'),
  query('start_date').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('end_date').optional().isISO8601().withMessage('End date must be a valid date'),
  query('is_sensitive').optional().isBoolean().withMessage('Is sensitive must be a boolean'),
];

// Routes
router.get('/',
  auditQueryValidation,
  validateRequest,
  AuditController.getAuditLogs
);

router.get('/stats',
  AuditController.getAuditStats
);

router.get('/export',
  auditQueryValidation,
  validateRequest,
  AuditController.exportAuditLogs
);

export default router;
