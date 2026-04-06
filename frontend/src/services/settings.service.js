import api from '@/config/api'

class SettingsService {
  async getSettings() {
    const response = await api.get('/settings')
    return response.data
  }

  async updateSettings(data) {
    const response = await api.put('/settings', data)
    return response.data
  }

  async getOrganizationSettings() {
    const response = await api.get('/settings/organization')
    return response.data
  }

  async updateOrganizationSettings(data) {
    const response = await api.put('/settings/organization', data)
    return response.data
  }
}

export default new SettingsService()
