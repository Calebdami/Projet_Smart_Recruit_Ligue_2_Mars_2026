import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
import { sendEmail } from '../utils/email.js';
import { redisClient } from '../config/redis.js';

class NotificationService {
  
  /**
   * Créer une notification
   * @param {Object} options - Options de notification
   * @param {string} options.userId - ID de l'utilisateur destinataire
   * @param {string} options.type - Type de notification
   * @param {string} options.title - Titre de la notification
   * @param {string} options.message - Message de la notification
   * @param {Object} options.data - Métadonnées additionnelles
   * @param {string} options.priority - Priorité (low, medium, high, urgent)
   * @param {string} options.channel - Canal (in_app, email, push, sms)
   * @param {Date} options.expiresAt - Date d'expiration
   */
  static async create({
    userId,
    type,
    title,
    message,
    data = {},
    priority = 'medium',
    channel = 'in_app',
    expiresAt = null
  }) {
    try {
      // Créer la notification en base
      const [notification] = await db('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data: JSON.stringify(data),
          priority,
          channel,
          expires_at: expiresAt,
        })
        .returning('*');

      // Traiter selon le canal
      await this.processNotification(notification);

      // Log de l'action
      await auditLog({
        action: 'notification_created',
        entity_type: 'notification',
        entity_id: notification.id,
        user_id: userId,
        ip_address: null,
        user_agent: 'system',
        new_values: { type, title, channel },
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Traiter une notification selon son canal
   */
  static async processNotification(notification) {
    switch (notification.channel) {
      case 'in_app':
        await this.sendInAppNotification(notification);
        break;
      case 'email':
        await this.sendEmailNotification(notification);
        break;
      case 'push':
        await this.sendPushNotification(notification);
        break;
      case 'sms':
        await this.sendSMSNotification(notification);
        break;
      default:
        console.warn(`Unknown notification channel: ${notification.channel}`);
    }
  }

  /**
   * Envoyer notification in-app (WebSocket)
   */
  static async sendInAppNotification(notification) {
    try {
      // Émettre via WebSocket si connecté
      if (global.websocketConnections?.has(notification.user_id)) {
        const ws = global.websocketConnections.get(notification.user_id);
        if (ws && ws.readyState === 1) { // WebSocket.OPEN
          // Formater pour toastification
          const toastNotification = {
            type: 'toast_notification',
            data: {
              id: notification.id,
              title: notification.title,
              message: notification.message,
              type: this.getToastType(notification.type, notification.priority),
              priority: notification.priority,
              createdAt: notification.created_at,
              data: notification.data,
              // Métadonnées pour toastification
              toast: {
                position: 'top-right',
                autoClose: notification.priority === 'urgent' ? 5000 : 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light'
              }
            }
          };
          
          ws.send(JSON.stringify(toastNotification));
        }
      }

      // Stocker dans Redis pour historique
      const key = `notifications:${notification.user_id}`;
      await redisClient.lPush(key, JSON.stringify(notification));
      await redisClient.expire(key, 86400); // 24h

    } catch (error) {
      console.error('Error sending in-app notification:', error);
    }
  }

  /**
   * Déterminer le type de toast selon le type de notification et la priorité
   */
  static getToastType(notificationType, priority) {
    const typeMap = {
      'application_received': 'success',
      'application_status': 'info',
      'job_published': 'success',
      'job_expired': 'warning',
      'webinar_reminder': 'info',
      'webinar_started': 'info',
      'profile_viewed': 'info',
      'system_update': 'info',
      'security_alert': 'error',
      'deadline_reminder': 'warning',
      'new_message': 'info',
      'task_assigned': 'success',
      'achievement': 'success'
    };

    // Priorité urgente override
    if (priority === 'urgent') return 'error';
    
    return typeMap[notificationType] || 'info';
  }

  /**
   * Envoyer notification par email
   */
  static async sendEmailNotification(notification) {
    try {
      // Récupérer l'email de l'utilisateur
      const user = await db('users')
        .where('id', notification.user_id)
        .first();

      if (!user) return;

      await sendEmail({
        to: user.email,
        subject: notification.title,
        template: 'notification',
        data: {
          firstName: user.first_name,
          title: notification.title,
          message: notification.message,
          data: notification.data,
        },
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  /**
   * Envoyer notification push (placeholder)
   */
  static async sendPushNotification(notification) {
    // TODO: Implémenter avec FCM/APNS
    console.log('Push notification:', notification);
  }

  /**
   * Envoyer notification SMS (placeholder)
   */
  static async sendSMSNotification(notification) {
    // TODO: Implémenter avec Twilio ou autre
    console.log('SMS notification:', notification);
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  static async getUserNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type = null,
    } = options;

    let query = db('notifications')
      .where('user_id', userId)
      .where('expires_at', '>', new Date()) // Non expirées
      .orderBy('created_at', 'desc');

    // Filtres
    if (unreadOnly) {
      query = query.where('is_read', false);
    }

    if (type) {
      query = query.where('type', type);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const notifications = await query;

    // Compter le total non lus
    const [{ unread_count }] = await db('notifications')
      .where('user_id', userId)
      .where('is_read', false)
      .where('expires_at', '>', new Date())
      .count('* as unread_count');

    return {
      notifications,
      unread_count: parseInt(unread_count),
      pagination: {
        current_page: page,
        limit,
      },
    };
  }

  /**
   * Marquer une notification comme lue
   */
  static async markAsRead(notificationId, userId) {
    try {
      const [updated] = await db('notifications')
        .where('id', notificationId)
        .where('user_id', userId)
        .update({
          is_read: true,
          read_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*');

      if (!updated) {
        throw new Error('Notification not found or access denied');
      }

      // Log de l'action
      await auditLog({
        action: 'notification_read',
        entity_type: 'notification',
        entity_id: notificationId,
        user_id: userId,
        ip_address: null,
        user_agent: 'system',
      });

      return updated;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  static async markAllAsRead(userId) {
    try {
      const updated = await db('notifications')
        .where('user_id', userId)
        .where('is_read', false)
        .update({
          is_read: true,
          read_at: new Date(),
          updated_at: new Date(),
        });

      // Log de l'action
      await auditLog({
        action: 'notifications_all_read',
        entity_type: 'notification',
        entity_id: null,
        user_id: userId,
        ip_address: null,
        user_agent: 'system',
        new_values: { marked_count: updated },
      });

      return updated;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Supprimer les notifications expirées
   */
  static async cleanupExpiredNotifications() {
    try {
      const deleted = await db('notifications')
        .where('expires_at', '<=', new Date())
        .del();

      console.log(`Cleaned up ${deleted} expired notifications`);
      return deleted;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      throw error;
    }
  }

  /**
   * Templates de notifications prédéfinies
   */
  static templates = {
    // Candidatures
    application_received: (jobTitle, candidateName) => ({
      type: 'application_received',
      title: 'Nouvelle candidature reçue',
      message: `${candidateName} a postulé à l'offre "${jobTitle}"`,
      data: { jobTitle, candidateName },
      priority: 'high',
    }),

    application_status_updated: (jobTitle, newStatus) => ({
      type: 'application_status',
      title: 'Statut de votre candidature mis à jour',
      message: `Votre candidature pour "${jobTitle}" est maintenant "${newStatus}"`,
      data: { jobTitle, newStatus },
      priority: 'medium',
    }),

    // Offres d'emploi
    job_published: (jobTitle, recruiterName) => ({
      type: 'job_published',
      title: 'Nouvelle offre publiée',
      message: `${recruiterName} a publié l'offre "${jobTitle}"`,
      data: { jobTitle, recruiterName },
      priority: 'medium',
    }),

    job_expiring_soon: (jobTitle, daysLeft) => ({
      type: 'deadline_reminder',
      title: 'Offre expirant bientôt',
      message: `L'offre "${jobTitle}" expire dans ${daysLeft} jours`,
      data: { jobTitle, daysLeft },
      priority: 'high',
    }),

    // Webinars
    webinar_reminder: (webinarTitle, startTime) => ({
      type: 'webinar_reminder',
      title: 'Rappel Webinar',
      message: `Webinar "${webinarTitle}" commence à ${startTime}`,
      data: { webinarTitle, startTime },
      priority: 'medium',
    }),

    webinar_started: (webinarTitle) => ({
      type: 'webinar_started',
      title: 'Webinar en direct',
      message: `Le webinar "${webinarTitle}" a commencé !`,
      data: { webinarTitle },
      priority: 'high',
      channel: 'push',
    }),

    // Sécurité
    security_alert: (alertType, details) => ({
      type: 'security_alert',
      title: 'Alerte de sécurité',
      message: `Activité suspecte détectée: ${alertType}`,
      data: { alertType, details },
      priority: 'urgent',
      channel: 'email',
    }),

    // Système
    system_update: (updateType) => ({
      type: 'system_update',
      title: 'Mise à jour système',
      message: `Le système a été mis à jour: ${updateType}`,
      data: { updateType },
      priority: 'low',
    }),
  };
}

export { NotificationService };
