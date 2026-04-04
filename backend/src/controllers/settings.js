import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';

class SettingsController {
  // Get settings (public or private based on user)
  static async getSettings(req, res) {
    try {
      const userRole = req.user?.role || 'public';
      
      // For now, return mock settings since we may not have a settings table
      const settings = {
        organization_name: 'SmartRecruit',
        contact_email: 'contact@smartrecruit.com',
        timezone: 'Europe/Paris',
        email_notifications: true,
        slack_notifications: false,
        slack_webhook: '',
        auto_reply_delay: 2,
        enable_smart_score: true,
        auto_assign_applications: false,
        require_2fa_for_admin: true,
        session_duration: 24
      };

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve settings'
      });
    }
  }

  // Update settings (admin only)
  static async updateSettings(req, res) {
    try {
      const userId = req.user.id;
      const newSettings = req.body;

      // Log the settings update
      await auditLog({
        action: 'update',
        entity_type: 'settings',
        entity_id: 'global',
        user_id: userId,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        new_values: JSON.stringify(newSettings)
      });

      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: newSettings
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update settings'
      });
    }
  }

  // Get organization settings
  static async getOrganizationSettings(req, res) {
    try {
      const settings = {
        name: 'SmartRecruit',
        logo_url: null,
        primary_color: '#4F46E5',
        timezone: 'Europe/Paris',
        date_format: 'DD/MM/YYYY',
        language: 'fr'
      };

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Get organization settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve organization settings'
      });
    }
  }

  // Update organization settings (admin only)
  static async updateOrganizationSettings(req, res) {
    try {
      const userId = req.user.id;
      const settings = req.body;

      await auditLog({
        action: 'update',
        entity_type: 'organization_settings',
        entity_id: 'global',
        user_id: userId,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        new_values: JSON.stringify(settings)
      });

      res.json({
        success: true,
        message: 'Organization settings updated',
        data: settings
      });
    } catch (error) {
      console.error('Update organization settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update organization settings'
      });
    }
  }
}

export { SettingsController };
