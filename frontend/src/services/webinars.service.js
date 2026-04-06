import api from '@/config/api'

class WebinarsService {
  async getWebinars(params = {}) {
    const response = await api.get('/webinars', { params })
    return response.data
  }

  async getWebinar(id) {
    const response = await api.get(`/webinars/${id}`)
    return response.data
  }

  async createWebinar(data) {
    const response = await api.post('/webinars', data)
    return response.data
  }

  async updateWebinar(id, data) {
    const response = await api.put(`/webinars/${id}`, data)
    return response.data
  }

  async deleteWebinar(id) {
    await api.delete(`/webinars/${id}`)
  }

  async startWebinar(id) {
    const response = await api.post(`/webinars/${id}/start`)
    return response.data
  }

  async endWebinar(id) {
    const response = await api.post(`/webinars/${id}/end`)
    return response.data
  }

  async getRegistrations(id) {
    const response = await api.get(`/webinars/${id}/registrations`)
    return response.data
  }

  async registerAttendee(id, data) {
    const response = await api.post(`/webinars/${id}/registrations`, data)
    return response.data
  }

  async markAttended(webinarId, registrationId) {
    const response = await api.patch(`/webinars/${webinarId}/registrations/${registrationId}/attended`)
    return response.data
  }
}

export default new WebinarsService()
