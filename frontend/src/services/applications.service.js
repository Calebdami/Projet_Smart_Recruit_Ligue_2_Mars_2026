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

  async applyForJob(data) {
    const response = await api.post('/applications/apply', data)
    return response.data
  }

  async getMyApplications() {
    const response = await api.get('/applications/my-applications')
    return response.data
  }

  async updateOwnApplication(id, data) {
    const response = await api.patch(`/applications/${id}/candidate-update`, data)
    return response.data
  }

  async getApplicationDocuments(id) {
    const response = await api.get(`/applications/${id}/documents`)
    return response.data
  }

  async uploadApplicationDocument(id, file) {
    const formData = new FormData()
    formData.append('document', file)
    const response = await api.post(`/applications/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async deleteApplicationDocument(id, documentId) {
    const response = await api.delete(`/applications/${id}/documents/${documentId}`)
    return response.data
  }

  async updateApplicationStatus(id, status, notes = '') {
    const response = await api.patch(`/applications/${id}/status`, { status, notes })
    return response.data
  }

  async assignRecruiter(id, recruiterId) {
    const payload = { recruiter_id: recruiterId }
    const response = await api.patch(`/applications/${id}/assign`, payload)
    return response.data
  }

  async bulkAssignRecruiter(applicationIds, recruiterId) {
    const payload = {
      application_ids: applicationIds,
      recruiter_id: recruiterId,
    }
    const response = await api.patch('/applications/bulk-assign', payload)
    return response.data
  }

  async addNote(id, note) {
    const response = await api.post(`/applications/${id}/notes`, { note })
    return response.data
  }

  async updateRecruiterScore(id, recruiterScore, comment = '') {
    const response = await api.patch(`/applications/${id}/score`, { recruiter_score: recruiterScore, comment })
    return response.data
  }

  async getTimeline(id) {
    const response = await api.get(`/applications/${id}/timeline`)
    return response.data
  }

  async scheduleInterview(id, data) {
    const response = await api.post(`/applications/${id}/interviews`, data)
    return response.data
  }

  async dragDropStatus(id, status, notes = '') {
    const response = await api.patch(`/applications/${id}/drag-drop`, { status, notes })
    return response.data
  }

  async bulkDragDropStatus(applicationIds, status, notes = '') {
    const response = await api.patch('/applications/bulk/drag-drop', {
      application_ids: applicationIds,
      status,
      notes
    })
    return response.data
  }
}

export default new ApplicationsService()
