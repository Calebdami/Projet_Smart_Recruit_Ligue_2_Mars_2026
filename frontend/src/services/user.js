import api from '@/config/api'

class UserService {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  async getProfile() {
    const response = await api.get('/users/profile')
    return response.data
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData)
    return response.data
  }

  /**
   * Upload avatar
   * @param {FormData} formData - Avatar file data
   * @returns {Promise<Object>} Upload result
   */
  async uploadAvatar(formData) {
    const response = await api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  /**
   * Get all users (Admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Users list
   */
  async getUsers(params = {}) {
    const response = await api.get('/users', { params })
    return response.data
  }

  /**
   * Get user by ID (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`)
    return response.data
  }

  /**
   * Update user (Admin only)
   * @param {string} userId - User ID
   * @param {Object} userData - User update data
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  }

  /**
   * Delete user (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    await api.delete(`/users/${userId}`)
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword
   * @param {string} passwordData.newPassword
   * @returns {Promise<Object>} Result
   */
  async changePassword(passwordData) {
    const response = await api.put('/users/password', passwordData)
    return response.data
  }
}

export default new UserService()