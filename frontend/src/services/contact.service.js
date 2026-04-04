import api from '@/config/api'

class ContactService {
  async sendMessage(data) {
    const response = await api.post('/contact', data)
    return response.data
  }
}

export default new ContactService()
