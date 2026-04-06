import api from '@/config/api'

class AutomationService {
  async getRules() {
    const response = await api.get('/automation/rules')
    return response.data
  }

  async createRule(data) {
    const response = await api.post('/automation/rules', data)
    return response.data
  }

  async updateRule(id, data) {
    const response = await api.put(`/automation/rules/${id}`, data)
    return response.data
  }

  async toggleRule(id, isActive) {
    const response = await api.patch(`/automation/rules/${id}/toggle`, { is_active: isActive })
    return response.data
  }

  async deleteRule(id) {
    await api.delete(`/automation/rules/${id}`)
  }
}

export default new AutomationService()
