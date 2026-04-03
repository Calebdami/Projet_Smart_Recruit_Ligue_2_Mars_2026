import express from 'express';
import { JobController } from '../controllers/jobs.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, JobController.getAll);
router.get('/:id', authenticate, JobController.getById);
router.post('/', authenticate, authorize(['admin', 'recruiter']), JobController.create);
router.get('/:id/matching', authenticate, authorize(['admin', 'recruiter']), JobController.getMatchingCandidates);

export default router;
