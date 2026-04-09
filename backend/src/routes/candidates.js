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
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/PNG/JPG/WEBP files are allowed'), false);
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

const candidateUpdateValidation = [
  body('recruiter_score').optional().isFloat({ min: 0, max: 100 }).withMessage('Recruiter score must be between 0 and 100'),
];

const candidateNoteValidation = [
  body('note').isString().withMessage('Note is required'),
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

router.post('/:id/cv',
  authenticate,
  authorize(['candidate']),
  upload.single('cv'),
  CandidateController.uploadResumeById
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

router.get('/:id/cv',
  authenticate,
  authorize(['candidate', 'recruiter', 'admin']),
  CandidateController.getCandidateCV
);

router.post('/:id/parse-cv',
  authenticate,
  authorize(['recruiter', 'admin']),
  CandidateController.parseCV
);

router.post('/:id/cv/parse',
  authenticate,
  authorize(['candidate', 'recruiter', 'admin']),
  CandidateController.parseCV
);

router.get('/:id/applications',
  authenticate,
  authorize(['recruiter', 'admin']),
  CandidateController.getCandidateApplications
);

router.put('/:id',
  authenticate,
  authorize(['recruiter', 'admin']),
  candidateUpdateValidation,
  validateRequest,
  CandidateController.updateCandidateByAdmin
);

router.post('/:id/notes',
  authenticate,
  authorize(['recruiter', 'admin']),
  candidateNoteValidation,
  validateRequest,
  CandidateController.addCandidateNote
);

export default router;
