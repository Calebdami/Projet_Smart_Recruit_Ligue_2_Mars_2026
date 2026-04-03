import express from 'express';
import { ApplicationController } from '../controllers/applications.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Submit a new job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *               - candidate_id
 *             properties:
 *               job_id:
 *                 type: string
 *                 format: uuid
 *               candidate_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Application submitted
 */
router.post('/', authenticate, ApplicationController.submit);

/**
 * @swagger
 * /api/v1/applications/job/{job_id}:
 *   get:
 *     summary: Get all applications for a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get('/job/:job_id', authenticate, authorize(['admin', 'recruiter']), ApplicationController.getByJob);

export default router;
