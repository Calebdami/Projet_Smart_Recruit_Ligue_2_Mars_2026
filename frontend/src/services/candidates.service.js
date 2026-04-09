import api from '@/config/api'

class CandidatesService {
  async getMyProfile() {
    const response = await api.get('/candidates/profile')
    return response.data
  }

  async uploadMyResume(file) {
    const formData = new FormData()
    formData.append('resume', file)
    const response = await api.post('/candidates/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async getCandidates(params = {}) {
    const response = await api.get('/candidates', { params })
    return response.data
  }

  async getCandidate(id) {
    const response = await api.get(`/candidates/${id}`)
    return response.data
  }

  async getCandidateApplications(id) {
    const response = await api.get(`/candidates/${id}/applications`)
    return response.data
  }

  async getCandidateCV(id) {
    const response = await api.get(`/candidates/${id}/cv`)
    return response.data
  }

  async uploadCV(id, file) {
    const formData = new FormData()
    formData.append('cv', file)
    const response = await api.post(`/candidates/${id}/cv`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async parseCV(id) {
    const response = await api.post(`/candidates/${id}/cv/parse`)
    return response.data
  }

  async updateCandidate(id, data) {
    const response = await api.put(`/candidates/${id}`, data)
    return response.data
  }

  async addNote(id, note) {
    const response = await api.post(`/candidates/${id}/notes`, { note })
    return response.data
  }
}

export default new CandidatesService()
