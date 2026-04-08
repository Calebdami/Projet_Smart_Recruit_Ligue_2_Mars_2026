import express from 'express';
import { NotificationController } from '../controllers/notifications.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

// Get all notifications
router.get('/', NotificationController.getNotifications);

// Get unread count
router.get('/unread-count', NotificationController.getUnreadCount);

// Mark notification as read
router.patch('/:id/read', NotificationController.markAsRead);

// Mark all as read
router.post('/mark-all-read', NotificationController.markAllAsRead);
// Backward-compatible alias
router.patch('/read-all', NotificationController.markAllAsRead);

// Delete notification
router.delete('/:id', NotificationController.deleteNotification);

// Update preferences
router.put('/preferences', NotificationController.updatePreferences);

export default router;
