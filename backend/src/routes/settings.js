import express from 'express';
import { SettingsController } from '../controllers/settings.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get settings (public or authenticated)
router.get('/', authenticate, SettingsController.getSettings);

// Update settings (admin only)
router.put('/', authenticate, authorize(['admin']), SettingsController.updateSettings);

// Get organization settings
router.get('/organization', SettingsController.getOrganizationSettings);

// Update organization settings (admin only)
router.put('/organization', authenticate, authorize(['admin']), SettingsController.updateOrganizationSettings);

export default router;
