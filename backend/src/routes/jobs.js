import express from 'express';
import { JobController } from '../controllers/jobs.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const jobCreateValidation = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('status').optional().isIn(['draft', 'open', 'closed', 'paused', 'archived']),
  body('salary_min').optional().isNumeric(),
  body('salary_max').optional().isNumeric(),
  body('experience_level').optional().isIn(['junior', 'mid', 'senior', 'executive']),
  body('employment_type').optional().isString(),
  body('location').optional().isString(),
  body('department').optional().isString(),
];

const jobUpdateValidation = [
  body('title').optional().notEmpty().withMessage('Job title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Job description cannot be empty'),
  body('status').optional().isIn(['draft', 'open', 'closed', 'paused', 'archived']),
  body('salary_min').optional().isNumeric(),
  body('salary_max').optional().isNumeric(),
  body('experience_level').optional().isIn(['junior', 'mid', 'senior', 'executive']),
  body('employment_type').optional().isString(),
  body('location').optional().isString(),
  body('department').optional().isString(),
];

// Public routes (anyone can view jobs)
router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);

// Recruiter/Admin routes
router.post('/',
  authenticate,
  authorize(['recruiter', 'admin']),
  jobCreateValidation,
  validateRequest,
  JobController.createJob
);

router.patch('/:id',
  authenticate,
  authorize(['recruiter', 'admin']),
  jobUpdateValidation,
  validateRequest,
  JobController.updateJob
);

router.delete('/:id',
  authenticate,
  authorize(['recruiter', 'admin']),
  JobController.deleteJob
);

export default router;
