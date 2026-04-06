import api from '@/config/api'

class AuthService {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @param {string} [credentials.twoFactorCode]
   * @returns {Promise<Object>} Auth tokens and user data
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  }

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    await api.post('/auth/logout')
  }

  /**
   * Setup 2FA
   * @returns {Promise<Object>} 2FA setup data
   */
  async setup2FA() {
    const response = await api.post('/auth/2fa/setup')
    return response.data
  }

  /**
   * Verify 2FA code
   * @param {string} code - 2FA verification code
   * @returns {Promise<Object>} Verification result
   */
  async verify2FA(code) {
    const response = await api.post('/auth/2fa/verify', { code })
    return response.data
  }

  /**
   * Disable 2FA
   * @param {string} code - Current 2FA code for verification
   * @returns {Promise<Object>} Result
   */
  async disable2FA(code) {
    const response = await api.post('/auth/2fa/disable', { code })
    return response.data
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  }
}

export default new AuthService()