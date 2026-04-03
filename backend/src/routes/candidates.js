import express from 'express';
import { CandidateController } from '../controllers/candidates.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for resume upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Validation rules
const profileUpdateValidation = [
  body('headline').optional().isString().trim(),
  body('bio').optional().isString(),
  body('skills').optional().isArray(),
  body('linkedin_url').optional().isURL().withMessage('Invalid LinkedIn URL'),
  body('github_url').optional().isURL().withMessage('Invalid GitHub URL'),
  body('location').optional().isString().trim(),
  body('experience_level').optional().isIn(['junior', 'mid', 'senior', 'executive']),
  body('years_experience').optional().isInt({ min: 0 }),
];

// Routes

// Candidate's own profile
router.get('/profile', 
  authenticate, 
  authorize(['candidate']), 
  CandidateController.getProfile
);

router.post('/profile',
  authenticate,
  authorize(['candidate']),
  profileUpdateValidation,
  validateRequest,
  CandidateController.updateProfile
);

// Upload and Parse CV
router.post('/upload-resume',
  authenticate,
  authorize(['candidate']),
  upload.single('resume'),
  CandidateController.uploadResume
);

// Recruiter access to candidates
router.get('/',
  authenticate,
  authorize(['recruiter', 'admin']),
  CandidateController.getAllCandidates
);

router.get('/:id',
  authenticate,
  authorize(['recruiter', 'admin']),
  CandidateController.getCandidateById
);

export default router;
