import { db } from '../config/database.js';

export const AuditLogger = {
    /**
     * Log an action to the audit trail
     * @param {string} userId - ID of the user performing the action
     * @param {string} action - Action performed (e.g., 'CANDIDATE_RESUME_PARSED')
     * @param {Object} metadata - Additional information about the action
     */
    async log(userId, action, metadata = {}) {
        try {
            await db('audit_trail').insert({
                user_id: userId,
                action,
                metadata: JSON.stringify(metadata),
                ip_address: null,
                user_agent: null,
                created_at: db.fn.now()
            });
        } catch (error) {
            console.error('Audit logging failed:', error);
        }
    }
};
