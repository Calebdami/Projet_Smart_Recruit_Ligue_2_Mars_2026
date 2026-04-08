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

const assignRecruiterValidation = [
  // Pas de validation stricte - le contrôleur gère null et les UUID
];

const bulkAssignRecruiterValidation = [
  body('application_ids').isArray().withMessage('Application IDs must be an array'),
  body('application_ids.*').isUUID().withMessage('Each application ID must be a valid UUID'),
  // recruiter_id pas de validation stricte - le contrôleur gère null et les UUID
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
router.get('/',
  authenticate,
  authorize(['recruiter', 'admin']),
  ApplicationController.getApplications
);

router.get('/job/:jobId',
  authenticate,
  authorize(['recruiter', 'admin']),
  ApplicationController.getJobApplications
);

router.get('/:id',
  authenticate,
  authorize(['recruiter', 'admin', 'candidate']),
  ApplicationController.getApplication
);

router.patch('/:id/status',
  authenticate,
  authorize(['recruiter', 'admin']),
  updateStatusValidation,
  validateRequest,
  ApplicationController.updateStatus
);

router.patch('/:id/assign',
  authenticate,
  authorize(['admin']),
  // Pas de validation stricte - le contrôleur gère les cas
  ApplicationController.assignRecruiter
);

router.patch('/bulk-assign',
  authenticate,
  authorize(['admin']),
  bulkAssignRecruiterValidation,
  validateRequest,
  ApplicationController.bulkAssignRecruiter
);

export default router;
