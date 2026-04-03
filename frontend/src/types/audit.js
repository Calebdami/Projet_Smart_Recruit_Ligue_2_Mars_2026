/**
 * @typedef {Object} AuditLog
 * @property {string} id - Log ID
 * @property {string} userId - User who performed the action
 * @property {string} action - Action performed
 * @property {string} resource - Resource affected
 * @property {string} resourceId - ID of the affected resource
 * @property {Object} details - Additional details about the action
 * @property {string} ipAddress - IP address of the request
 * @property {string} userAgent - User agent string
 * @property {Date} timestamp - When the action occurred
 * @property {string} severity - Log severity level
 */

/**
 * @typedef {Object} AuditLogFilter
 * @property {string} [userId] - Filter by user ID
 * @property {string} [action] - Filter by action
 * @property {string} [resource] - Filter by resource
 * @property {Date} [startDate] - Start date for filtering
 * @property {Date} [endDate] - End date for filtering
 * @property {string} [severity] - Filter by severity
 */

/**
 * @typedef {Object} AuditLogSearch
 * @property {string} query - Search query
 * @property {AuditLogFilter} filters - Additional filters
 * @property {number} page - Page number
 * @property {number} limit - Results per page
 * @property {string} sortBy - Sort field
 * @property {string} sortOrder - Sort order ('asc' | 'desc')
 */

export {} // Make this a module