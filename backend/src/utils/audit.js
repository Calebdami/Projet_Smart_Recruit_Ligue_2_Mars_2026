import { db } from '../config/database.js';

const auditLog = async (data) => {
  try {
    const metadata = {
      ...(data.metadata || {}),
      ...(data.details ? { details: data.details } : {}),
    };

    await db('audit_trail').insert({
      action: data.action,
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      user_id: data.user_id,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      session_id: data.session_id,
      request_id: data.request_id,
      is_sensitive: data.is_sensitive,
      old_values: data.old_values ? JSON.stringify(data.old_values) : null,
      new_values: data.new_values ? JSON.stringify(data.new_values) : null,
      metadata: JSON.stringify(metadata),
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking main flow
  }
};

const getAuditLogs = async (filters = {}) => {
  try {
    let query = db('audit_trail').orderBy('created_at', 'desc');

    if (filters.entity_type) {
      query = query.where('entity_type', filters.entity_type);
    }

    if (filters.entity_id) {
      query = query.where('entity_id', filters.entity_id);
    }

    if (filters.user_id) {
      query = query.where('user_id', filters.user_id);
    }

    if (filters.action) {
      query = query.where('action', filters.action);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const logs = await query.select('*');

    return logs.map(log => ({
      ...log,
      old_values: log.old_values ? JSON.parse(log.old_values) : null,
      new_values: log.new_values ? JSON.parse(log.new_values) : null,
      metadata: JSON.parse(log.metadata),
    }));
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
};

export {
  auditLog,
  getAuditLogs,
};
