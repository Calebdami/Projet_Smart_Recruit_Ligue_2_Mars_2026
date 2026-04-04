import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';

class AuditController {
  // Get audit logs
  static async getLogs(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        userId, 
        action, 
        entityType, 
        startDate, 
        endDate,
        search
      } = req.query;

      const offset = (page - 1) * limit;

      // Build base query for filtering (without select for count)
      let baseQuery = db('audit_trail')
        .join('users', 'audit_trail.user_id', 'users.id');

      // Apply filters
      if (userId) {
        baseQuery.where('audit_trail.user_id', userId);
      }
      if (action) {
        baseQuery.where('audit_trail.action', action);
      }
      if (entityType) {
        baseQuery.where('audit_trail.entity_type', entityType);
      }
      if (startDate) {
        baseQuery.where('audit_trail.created_at', '>=', startDate);
      }
      if (endDate) {
        baseQuery.where('audit_trail.created_at', '<=', endDate);
      }
      if (search) {
        baseQuery.where(function() {
          this.where('users.first_name', 'ilike', `%${search}%`)
            .orWhere('users.last_name', 'ilike', `%${search}%`)
            .orWhere('users.email', 'ilike', `%${search}%`)
            .orWhere('audit_trail.action', 'ilike', `%${search}%`);
        });
      }

      // Get total count (separate query without select columns)
      const countResult = await baseQuery.clone()
        .count('audit_trail.id as count')
        .first();
      const count = countResult?.count || 0;

      // Get paginated results with select columns
      const logs = await baseQuery
        .select(
          'audit_trail.*',
          'users.first_name',
          'users.last_name',
          'users.email'
        )
        .orderBy('audit_trail.created_at', 'desc')
        .limit(parseInt(limit))
        .offset(parseInt(offset));

      res.json({
        success: true,
        data: {
          logs: logs.map(log => ({
            id: log.id,
            action: log.action,
            entity_type: log.entity_type,
            entity_id: log.entity_id,
            old_values: log.old_values ? JSON.parse(log.old_values) : null,
            new_values: log.new_values ? JSON.parse(log.new_values) : null,
            ip_address: log.ip_address,
            user_agent: log.user_agent,
            is_sensitive: log.is_sensitive,
            metadata: log.metadata,
            created_at: log.created_at,
            user: {
              id: log.user_id,
              first_name: log.first_name,
              last_name: log.last_name,
              email: log.email
            }
          })),
          pagination: {
            total: parseInt(count),
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(parseInt(count) / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve audit logs'
      });
    }
  }

  // Get audit statistics
  static async getStats(req, res) {
    try {
      const { startDate, endDate } = req.query;

      let query = db('audit_trail');

      if (startDate) {
        query.where('created_at', '>=', startDate);
      }
      if (endDate) {
        query.where('created_at', '<=', endDate);
      }

      // Actions distribution
      const actionsByType = await query.clone()
        .select('action', db.raw('count(*) as count'))
        .groupBy('action');

      // Entity types distribution
      const entitiesByType = await query.clone()
        .select('entity_type', db.raw('count(*) as count'))
        .groupBy('entity_type');

      // Total actions count
      const [{ totalActions }] = await query.clone().count('id as totalActions');

      // Recent sensitive operations
      const sensitiveOperations = await query.clone()
        .where('is_sensitive', true)
        .count('id as count')
        .first();

      res.json({
        success: true,
        data: {
          actionsByType,
          entitiesByType,
          totalActions: parseInt(totalActions),
          sensitiveOperations: parseInt(sensitiveOperations.count)
        }
      });
    } catch (error) {
      console.error('Get audit stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve audit statistics'
      });
    }
  }

  // Export audit logs
  static async exportLogs(req, res) {
    try {
      const { startDate, endDate, format = 'json' } = req.body;

      let query = db('audit_trail')
        .join('users', 'audit_trail.user_id', 'users.id')
        .select(
          'audit_trail.*',
          'users.first_name',
          'users.last_name',
          'users.email'
        );

      if (startDate) {
        query.where('audit_trail.created_at', '>=', startDate);
      }
      if (endDate) {
        query.where('audit_trail.created_at', '<=', endDate);
      }

      const logs = await query.orderBy('audit_trail.created_at', 'desc');

      // Log the export action
      await auditLog({
        action: 'export',
        entity_type: 'audit_logs',
        entity_id: 'all',
        user_id: req.user.id,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        is_sensitive: true
      });

      if (format === 'csv') {
        // Simple CSV conversion
        const headers = ['ID', 'Action', 'Entity Type', 'Entity ID', 'User', 'Created At'];
        const rows = logs.map(log => [
          log.id,
          log.action,
          log.entity_type,
          log.entity_id,
          `${log.first_name} ${log.last_name} (${log.email})`,
          log.created_at
        ]);
        
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=audit_logs.csv');
        res.send(csv);
      } else {
        res.json({
          success: true,
          data: { logs }
        });
      }
    } catch (error) {
      console.error('Export audit logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to export audit logs'
      });
    }
  }
}

export { AuditController };
