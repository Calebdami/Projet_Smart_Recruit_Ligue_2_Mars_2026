import api from '@/config/api'

class NotificationsService {
  async getNotifications(params = {}) {
    const response = await api.get('/notifications', { params })
    return response.data
  }

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count')
    return response.data
  }

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`)
    return response.data
  }

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all')
    return response.data
  }

  async deleteNotification(id) {
    await api.delete(`/notifications/${id}`)
  }

  async updatePreferences(preferences) {
    const response = await api.put('/notifications/preferences', preferences)
    return response.data
  }
}

export default new NotificationsService()
