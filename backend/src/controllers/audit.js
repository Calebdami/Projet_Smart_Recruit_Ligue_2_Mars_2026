import { db, paginateQuery } from '../config/database.js';
import { auditLog } from '../utils/audit.js';

class AuditController {
    // Get audit logs with filtering and pagination
    static async getAuditLogs(req, res) {
        try {
            const {
                page = 1,
                limit = 20,
                action,
                entity_type,
                user_id,
                start_date,
                end_date,
                is_sensitive,
            } = req.query;

            let query = db('audit_trail')
                .select([
                    'audit_trail.*',
                    'users.first_name',
                    'users.last_name',
                    'users.email as user_email',
                ])
                .leftJoin('users', 'audit_trail.user_id', 'users.id')
                .orderBy('audit_trail.created_at', 'desc');

            // Apply filters
            if (action) {
                query = query.where('audit_trail.action', action);
            }

            if (entity_type) {
                query = query.where('audit_trail.entity_type', entity_type);
            }

            if (user_id) {
                query = query.where('audit_trail.user_id', user_id);
            }

            if (start_date) {
                query = query.where('audit_trail.created_at', '>=', start_date);
            }

            if (end_date) {
                query = query.where('audit_trail.created_at', '<=', end_date);
            }

            if (is_sensitive !== undefined) {
                query = query.where('audit_trail.is_sensitive', is_sensitive === 'true');
            }

            // Get total count
            const countQuery = query.clone().clearSelect().clearOrder().count('* as total');
            const [{ total }] = await countQuery;

            // Apply pagination
            const paginatedQuery = paginateQuery(query, parseInt(page), parseInt(limit));
            const logs = await paginatedQuery;

            // Parse JSON fields
            const formattedLogs = logs.map(log => ({
                ...log,
                old_values: log.old_values ? JSON.parse(log.old_values) : null,
                new_values: log.new_values ? JSON.parse(log.new_values) : null,
                metadata: log.metadata ? JSON.parse(log.metadata) : {},
            }));

            res.json({
                success: true,
                data: {
                    logs: formattedLogs,
                    pagination: {
                        current_page: parseInt(page),
                        total_pages: Math.ceil(total / limit),
                        total_records: parseInt(total),
                        limit: parseInt(limit),
                    },
                },
                message: 'Audit logs retrieved successfully',
            });
        } catch (error) {
            console.error('Get audit logs error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve audit logs',
                message: 'An error occurred while retrieving audit logs',
            });
        }
    }

    // Get audit statistics
    static async getAuditStats(req, res) {
        try {
            // Get action statistics
            const actionStats = await db('audit_trail')
                .select('action')
                .count('* as count')
                .groupBy('action')
                .orderBy('count', 'desc');

            // Get entity type statistics
            const entityTypeStats = await db('audit_trail')
                .select('entity_type')
                .count('* as count')
                .groupBy('entity_type')
                .orderBy('count', 'desc');

            // Get user activity statistics (top 10 users)
            const userStats = await db('audit_trail')
                .select([
                    'audit_trail.user_id',
                    'users.first_name',
                    'users.last_name',
                    'users.email',
                ])
                .count('* as count')
                .leftJoin('users', 'audit_trail.user_id', 'users.id')
                .whereNotNull('audit_trail.user_id')
                .groupBy('audit_trail.user_id', 'users.first_name', 'users.last_name', 'users.email')
                .orderBy('count', 'desc')
                .limit(10);

            // Get sensitive operations count
            const sensitiveCount = await db('audit_trail')
                .where('is_sensitive', true)
                .count('* as count')
                .first();

            // Get recent activity (last 24 hours)
            const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentActivity = await db('audit_trail')
                .where('created_at', '>=', last24Hours)
                .count('* as count')
                .first();

            // Log this audit access
            await auditLog({
                action: 'view',
                entity_type: 'audit_stats',
                entity_id: req.user.sub,
                user_id: req.user.sub,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: {
                    action_stats: actionStats,
                    entity_type_stats: entityTypeStats,
                    user_activity_stats: userStats,
                    sensitive_operations: parseInt(sensitiveCount.count),
                    recent_activity_24h: parseInt(recentActivity.count),
                },
                message: 'Audit statistics retrieved successfully',
            });
        } catch (error) {
            console.error('Get audit stats error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve audit statistics',
                message: 'An error occurred while retrieving audit statistics',
            });
        }
    }

    // Export audit logs to CSV
    static async exportAuditLogs(req, res) {
        try {
            const {
                action,
                entity_type,
                user_id,
                start_date,
                end_date,
                is_sensitive,
            } = req.query;

            let query = db('audit_trail')
                .select([
                    'audit_trail.*',
                    'users.first_name',
                    'users.last_name',
                    'users.email as user_email',
                ])
                .leftJoin('users', 'audit_trail.user_id', 'users.id')
                .orderBy('audit_trail.created_at', 'desc');

            // Apply same filters as getAuditLogs
            if (action) query = query.where('audit_trail.action', action);
            if (entity_type) query = query.where('audit_trail.entity_type', entity_type);
            if (user_id) query = query.where('audit_trail.user_id', user_id);
            if (start_date) query = query.where('audit_trail.created_at', '>=', start_date);
            if (end_date) query = query.where('audit_trail.created_at', '<=', end_date);
            if (is_sensitive !== undefined) {
                query = query.where('audit_trail.is_sensitive', is_sensitive === 'true');
            }

            const logs = await query;

            // Format logs for CSV
            const csvLogs = logs.map(log => ({
                id: log.id,
                user_id: log.user_id,
                user_name: `${log.first_name || ''} ${log.last_name || ''}`.trim(),
                user_email: log.user_email,
                action: log.action,
                entity_type: log.entity_type,
                entity_id: log.entity_id,
                old_values: log.old_values || '',
                new_values: log.new_values || '',
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                is_sensitive: log.is_sensitive,
                created_at: log.created_at,
            }));

            // Generate CSV headers
            const headers = [
                'ID',
                'User ID',
                'User Name',
                'User Email',
                'Action',
                'Entity Type',
                'Entity ID',
                'Old Values',
                'New Values',
                'IP Address',
                'User Agent',
                'Is Sensitive',
                'Created At',
            ];

            // Convert to CSV string
            const csvContent = [
                headers.join(','),
                ...csvLogs.map(log => [
                    log.id,
                    log.user_id || '',
                    `"${log.user_name}"`,
                    log.user_email || '',
                    log.action,
                    log.entity_type,
                    log.entity_id,
                    `"${log.old_values}"`,
                    `"${log.new_values}"`,
                    log.ip_address || '',
                    `"${log.user_agent}"`,
                    log.is_sensitive,
                    log.created_at,
                ].join(','))
            ].join('\n');

            // Log this export
            await auditLog({
                action: 'export',
                entity_type: 'audit_logs',
                entity_id: req.user.sub,
                user_id: req.user.sub,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                metadata: {
                    filters: { action, entity_type, user_id, start_date, end_date, is_sensitive },
                    record_count: logs.length,
                },
            });

            // Set headers for CSV download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${new Date().toISOString().split('T')[0]}.csv"`);

            res.send(csvContent);
        } catch (error) {
            console.error('Export audit logs error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to export audit logs',
                message: 'An error occurred while exporting audit logs',
            });
        }
    }
}

export { AuditController };
