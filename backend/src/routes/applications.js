import { Router } from 'express';
import { ApplicationsController } from '../controllers/applications.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/v1/applications
 * Candidat postule à une offre
 * Accès : candidat uniquement
 */
router.post(
  '/',
  authenticate,
  authorize(['candidate']),
  ApplicationsController.apply
);

/**
 * PATCH /api/v1/applications/:id/status
 * Recruteur change le statut (Drag & Drop du board)
 * Accès : recruteur et admin
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize(['recruiter', 'admin']),
  ApplicationsController.updateStatus
);

/**
 * GET /api/v1/applications/job/:id
 * Récupérer toutes les candidatures d'une offre groupées par statut
 * Accès : recruteur et admin
 */
router.get(
  '/job/:id',
  authenticate,
  authorize(['recruiter', 'admin']),
  ApplicationsController.getByJob
);

export default router;
