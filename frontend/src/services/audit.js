import api from '@/config/api'

class AuditService {
  /**
   * Get audit logs
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Results per page
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order
   * @returns {Promise<Object>} Audit logs
   */
  async getLogs(params = {}) {
    const response = await api.get('/audit/logs', { params })
    return response.data
  }

  /**
   * Get specific audit log
   * @param {string} logId - Log ID
   * @returns {Promise<Object>} Audit log
   */
  async getLog(logId) {
    const response = await api.get(`/audit/logs/${logId}`)
    return response.data
  }

  /**
   * Search audit logs
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query
   * @param {Object} searchParams.filters - Additional filters
   * @param {Object} searchParams.pagination - Pagination params
   * @returns {Promise<Object>} Search results
   */
  async searchLogs(searchParams) {
    const response = await api.post('/audit/logs/search', searchParams)
    return response.data
  }

  /**
   * Get audit log statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(params = {}) {
    const response = await api.get('/audit/statistics', { params })
    return response.data
  }

  /**
   * Export audit logs
   * @param {Object} params - Export parameters
   * @param {string} params.format - Export format (csv, json, pdf)
   * @param {Object} params.filters - Filters to apply
   * @returns {Promise<Blob>} Export file
   */
  async exportLogs(params) {
    const response = await api.post('/audit/export', params, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default new AuditService()