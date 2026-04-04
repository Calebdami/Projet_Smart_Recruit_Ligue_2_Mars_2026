import api from '@/config/api'

class JobsService {
  async getJobs(params = {}) {
    const response = await api.get('/jobs', { params })
    return response.data
  }

  async getJob(id) {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  }

  async createJob(data) {
    const response = await api.post('/jobs', data)
    return response.data
  }

  async updateJob(id, data) {
    const response = await api.put(`/jobs/${id}`, data)
    return response.data
  }

  async deleteJob(id) {
    await api.delete(`/jobs/${id}`)
  }

  async closeJob(id) {
    const response = await api.post(`/jobs/${id}/close`)
    return response.data
  }

  async getJobStats(id) {
    const response = await api.get(`/jobs/${id}/stats`)
    return response.data
  }
}

export default new JobsService()
