import express from 'express';
import { ApplicationController } from '../controllers/applications.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const applicationValidation = [
  body('job_id').isUUID().withMessage('Job ID is required'),
  body('cover_letter').optional().isString(),
  body('screening_answers').optional().isObject(),
];

const updateStatusValidation = [
  body('status').isIn(['new', 'reviewing', 'screening', 'interview', 'technical_test', 'offer', 'rejected', 'hired', 'withdrawn']).withMessage('Invalid status'),
  body('next_step').optional().isString(),
  body('notes').optional().isArray(),
];

// Candidate routes
router.post('/apply',
  authenticate,
  authorize(['candidate']),
  applicationValidation,
  validateRequest,
  ApplicationController.apply
);

router.get('/my-applications',
  authenticate,
  authorize(['candidate']),
  ApplicationController.getMyApplications
);

// Recruiter/Admin routes
router.get('/job/:jobId',
  authenticate,
  authorize(['recruiter', 'admin']),
  ApplicationController.getJobApplications
);

router.patch('/:id/status',
  authenticate,
  authorize(['recruiter', 'admin']),
  updateStatusValidation,
  validateRequest,
  ApplicationController.updateStatus
);

export default router;
