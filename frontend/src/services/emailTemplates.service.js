import api from '@/config/api'

class EmailTemplatesService {
  async getTemplates() {
    const response = await api.get('/email-templates')
    return response.data
  }

  async getTemplate(id) {
    const response = await api.get(`/email-templates/${id}`)
    return response.data
  }

  async createTemplate(data) {
    const response = await api.post('/email-templates', data)
    return response.data
  }

  async updateTemplate(id, data) {
    const response = await api.put(`/email-templates/${id}`, data)
    return response.data
  }

  async deleteTemplate(id) {
    await api.delete(`/email-templates/${id}`)
  }

  async resetTemplate(id) {
    const response = await api.post(`/email-templates/${id}/reset`)
    return response.data
  }
}

export default new EmailTemplatesService()
