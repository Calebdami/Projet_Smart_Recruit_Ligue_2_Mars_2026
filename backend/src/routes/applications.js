import express from 'express';
import { ApplicationController } from '../controllers/applications.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF/PNG/JPG/WEBP files are allowed'), false);
  },
});

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

const scoreValidation = [
  body('recruiter_score').isFloat({ min: 0, max: 100 }).withMessage('Recruiter score must be between 0 and 100'),
  body('comment').optional().isString(),
];

const noteValidation = [
  body('note').isString().withMessage('Note is required'),
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

router.patch('/:id/candidate-update',
  authenticate,
  authorize(['candidate']),
  body('cover_letter').optional().isString(),
  body('screening_answers').optional().isObject(),
  validateRequest,
  ApplicationController.updateOwnApplication
);

router.get('/:id/documents',
  authenticate,
  authorize(['candidate', 'recruiter', 'admin']),
  ApplicationController.getApplicationDocuments
);

router.post('/:id/documents',
  authenticate,
  authorize(['candidate']),
  upload.single('document'),
  ApplicationController.uploadApplicationDocument
);

router.delete('/:id/documents/:documentId',
  authenticate,
  authorize(['candidate']),
  ApplicationController.deleteApplicationDocument
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

router.get('/:id/timeline',
  authenticate,
  authorize(['recruiter', 'admin', 'candidate']),
  ApplicationController.getApplicationTimeline
);

router.patch('/:id/status',
  authenticate,
  authorize(['recruiter', 'admin']),
  updateStatusValidation,
  validateRequest,
  ApplicationController.updateStatus
);

router.patch('/:id/score',
  authenticate,
  authorize(['recruiter', 'admin']),
  scoreValidation,
  validateRequest,
  ApplicationController.updateRecruiterScore
);

router.post('/:id/notes',
  authenticate,
  authorize(['recruiter', 'admin']),
  noteValidation,
  validateRequest,
  ApplicationController.addRecruiterNote
);

router.patch('/:id/assign',
  authenticate,
  authorize(['admin']),
  // Pas de validation stricte - le contrôleur gère les cas
  ApplicationController.assignRecruiter
);

// Drag & Drop routes
router.patch('/:id/drag-drop',
  authenticate,
  authorize(['recruiter', 'admin']),
  updateStatusValidation,
  validateRequest,
  ApplicationController.dragDropStatus
);

router.patch('/bulk/drag-drop',
  authenticate,
  authorize(['recruiter', 'admin']),
  bulkAssignRecruiterValidation,
  validateRequest,
  ApplicationController.bulkDragDropStatus
);

router.patch('/bulk-assign',
  authenticate,
  authorize(['admin']),
  bulkAssignRecruiterValidation,
  validateRequest,
  ApplicationController.bulkAssignRecruiter
);

export default router;
