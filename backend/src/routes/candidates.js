import express from 'express';
import { CandidateController } from '../controllers/candidates.js';
import { authenticate, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only .pdf, .doc and .docx files are allowed!'));
    }
});

/**
 * @swagger
 * /api/v1/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of candidates
 */
router.get('/', authenticate, authorize(['admin', 'recruiter']), CandidateController.getAll);

/**
 * @swagger
 * /api/v1/candidates:
 *   post:
 *     summary: Create a candidate profile
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Candidate created
 */
router.post('/', authenticate, CandidateController.create);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Candidate details
 */
router.get('/:id', authenticate, CandidateController.getById);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   patch:
 *     summary: Update candidate profile
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Candidate updated
 */
router.patch('/:id', authenticate, CandidateController.update);

/**
 * @swagger
 * /api/v1/candidates/{id}/parse-cv:
 *   post:
 *     summary: Upload and parse resume
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume parsed
 */
router.post('/:id/parse-cv', authenticate, upload.single('resume'), CandidateController.parseResume);

/**
 * @swagger
 * /api/v1/candidates/{id}/match/{jobId}:
 *   get:
 *     summary: Get match score for a job
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: jobId
 *         required: true
 *     responses:
 *       200:
 *         description: Match score result
 */
router.get('/:id/match/:jobId', authenticate, authorize(['admin', 'recruiter']), CandidateController.getMatchScore);

export default router;
