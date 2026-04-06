import api from '@/config/api'

class AnalyticsService {
  async getDashboardStats() {
    const response = await api.get('/analytics/dashboard')
    return response.data
  }

  async getOverviewStats() {
    const response = await api.get('/analytics/overview')
    return response.data
  }

  async getRecruitingMetrics(params = {}) {
    const response = await api.get('/analytics/metrics', { params })
    return response.data
  }

  async getTimeToHire(params = {}) {
    const response = await api.get('/analytics/time-to-hire', { params })
    return response.data
  }

  async getSourceEffectiveness(params = {}) {
    const response = await api.get('/analytics/sources', { params })
    return response.data
  }

  async getPipelineStats(params = {}) {
    const response = await api.get('/analytics/pipeline', { params })
    return response.data
  }

  async getRecentActivity(limit = 10) {
    const response = await api.get('/analytics/activity', { params: { limit } })
    return response.data
  }

  async getReports(params = {}) {
    const response = await api.get('/analytics/reports', { params })
    return response.data
  }

  async exportReport(type, params = {}) {
    const response = await api.post(`/analytics/export/${type}`, params, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default new AnalyticsService()
