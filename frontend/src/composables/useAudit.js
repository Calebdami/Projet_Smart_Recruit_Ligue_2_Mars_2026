import { ref, computed } from 'vue'
import axios from 'axios'

export function useAudit() {
  const auditLogs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref(null)

  // Computed
  const hasLogs = computed(() => auditLogs.value.length > 0)
  const totalLogs = computed(() => pagination.value?.total || 0)

  // Fetch audit logs
  const fetchAuditLogs = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/api/v1/audit/logs', { params })

      if (response.data.success) {
        auditLogs.value = response.data.data.logs
        pagination.value = response.data.data.pagination
        return { success: true, logs: auditLogs.value, pagination: pagination.value }
      } else {
        throw new Error(response.data.message || 'Failed to fetch audit logs')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch audit logs'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Get audit logs for specific entity
  const getEntityLogs = async (entityType, entityId, params = {}) => {
    return fetchAuditLogs({
      entity_type: entityType,
      entity_id: entityId,
      ...params,
    })
  }

  // Get audit logs for specific user
  const getUserLogs = async (userId, params = {}) => {
    return fetchAuditLogs({
      user_id: userId,
      ...params,
    })
  }

  // Get audit logs by action
  const getActionLogs = async (action, params = {}) => {
    return fetchAuditLogs({
      action,
      ...params,
    })
  }

  // Get recent audit logs
  const getRecentLogs = async (limit = 50) => {
    return fetchAuditLogs({
      limit,
      sortBy: 'created_at',
      sortOrder: 'desc',
    })
  }

  // Search audit logs
  const searchLogs = async (query, params = {}) => {
    return fetchAuditLogs({
      search: query,
      ...params,
    })
  }

  // Format audit log for display
  const formatAuditLog = (log) => {
    const actionLabels = {
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted',
      view: 'Viewed',
      login: 'Logged in',
      logout: 'Logged out',
      export: 'Exported',
      email_verified: 'Email verified',
      '2fa_enabled': '2FA enabled',
      '2fa_disabled': '2FA disabled',
      password_reset_requested: 'Password reset requested',
      password_reset: 'Password reset',
      deactivate: 'Deactivated',
      reactivate: 'Reactivated',
    }

    const entityLabels = {
      user: 'User',
      candidate: 'Candidate',
      job: 'Job',
      application: 'Application',
      webinar: 'Webinar',
      audit_trail: 'Audit Log',
    }

    return {
      ...log,
      actionLabel: actionLabels[log.action] || log.action,
      entityLabel: entityLabels[log.entity_type] || log.entity_type,
      formattedDate: new Date(log.created_at).toLocaleString(),
      isSensitive: log.is_sensitive,
    }
  }

  // Get audit statistics
  const getAuditStats = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/api/v1/audit/stats', { params })

      if (response.data.success) {
        return { success: true, stats: response.data.data }
      } else {
        throw new Error(response.data.message || 'Failed to fetch audit stats')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch audit stats'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    auditLogs,
    loading,
    error,
    pagination,

    // Computed
    hasLogs,
    totalLogs,

    // Methods
    fetchAuditLogs,
    getEntityLogs,
    getUserLogs,
    getActionLogs,
    getRecentLogs,
    searchLogs,
    formatAuditLog,
    getAuditStats,
    clearError,
  }
}