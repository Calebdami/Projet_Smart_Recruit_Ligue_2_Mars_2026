import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';

class NotificationController {
  // Get all notifications for current user
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, unreadOnly = false } = req.query;
      const offset = (page - 1) * limit;

      let query = db('notifications')
        .where('user_id', userId)
        .orderBy('created_at', 'desc');

      if (unreadOnly === 'true') {
        query.where('is_read', false);
      }

      const [countResult, notifications] = await Promise.all([
        query.clone().count('id as count').first(),
        query.limit(parseInt(limit)).offset(parseInt(offset))
      ]);

      const totalCount = parseInt(countResult.count);

      // Get unread count
      const [{ count: unreadCount }] = await db('notifications')
        .where({ user_id: userId, is_read: false })
        .count('id as count');

      res.json({
        success: true,
        data: {
          notifications,
          unreadCount: parseInt(unreadCount),
          pagination: {
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve notifications'
      });
    }
  }

  // Get unread count
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const [{ count }] = await db('notifications')
        .where({ user_id: userId, is_read: false })
        .count('id as count');

      res.json({
        success: true,
        data: { count: parseInt(count) }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to get unread count'
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const [notification] = await db('notifications')
        .where({ id, user_id: userId })
        .update({ is_read: true, read_at: db.fn.now() })
        .returning('*');

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to mark notification as read'
      });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      await db('notifications')
        .where({ user_id: userId, is_read: false })
        .update({ is_read: true, read_at: db.fn.now() });

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to mark notifications as read'
      });
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await db('notifications')
        .where({ id, user_id: userId })
        .delete();

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification deleted'
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete notification'
      });
    }
  }

  // Update notification preferences
  static async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = req.body;

      await db('users')
        .where('id', userId)
        .update({
          notification_preferences: JSON.stringify(preferences),
          updated_at: db.fn.now()
        });

      res.json({
        success: true,
        message: 'Preferences updated'
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update preferences'
      });
    }
  }

  // Create notification (internal use)
  static async createNotification(userId, type, title, message, data = {}) {
    try {
      const [notification] = await db('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data: JSON.stringify(data),
          is_read: false,
          created_at: db.fn.now()
        })
        .returning('*');

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      return null;
    }
  }
}

export { NotificationController };
