import api from '@/config/api'

class ApplicationsService {
  async getApplications(params = {}) {
    const response = await api.get('/applications', { params })
    return response.data
  }

  async getApplication(id) {
    const response = await api.get(`/applications/${id}`)
    return response.data
  }

  async createApplication(data) {
    const response = await api.post('/applications', data)
    return response.data
  }

  async updateApplicationStatus(id, status, notes = '') {
    const response = await api.patch(`/applications/${id}/status`, { status, notes })
    return response.data
  }

  async assignRecruiter(id, recruiterId) {
    const response = await api.patch(`/applications/${id}/assign`, { recruiter_id: recruiterId })
    return response.data
  }

  async addNote(id, note) {
    const response = await api.post(`/applications/${id}/notes`, { note })
    return response.data
  }

  async scheduleInterview(id, data) {
    const response = await api.post(`/applications/${id}/interviews`, data)
    return response.data
  }
}

export default new ApplicationsService()
