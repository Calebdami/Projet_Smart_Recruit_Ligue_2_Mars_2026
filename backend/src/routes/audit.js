import express from 'express';
import { AuditController } from '../controllers/audit.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All audit routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['admin']));

// Get audit logs with filters and pagination
router.get('/logs', AuditController.getLogs);

// Get audit statistics
router.get('/stats', AuditController.getStats);

// Export audit logs
router.post('/export', AuditController.exportLogs);

export default router;
