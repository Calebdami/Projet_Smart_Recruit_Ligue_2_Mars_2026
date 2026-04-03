import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const error = ref(null)

  // Computed properties
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const token = computed(() => authStore.token)

  // Login function
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/login', credentials)

      if (response.data.success) {
        const { user, tokens } = response.data.data

        // Store tokens
        authStore.setTokens(tokens)
        authStore.setUser(user)

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`

        return { success: true, user, tokens }
      } else if (response.data.requires_2fa) {
        // Handle 2FA required case
        return { success: false, requires2FA: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Login failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  const register = async (userData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/register', userData)

      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Registration failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear auth state regardless of API response
      authStore.clearAuth()
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshToken = authStore.refreshToken
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await axios.post('/auth/refresh', {
        refresh_token: refreshToken
      })

      if (response.data.success) {
        const { tokens } = response.data.data
        authStore.setTokens(tokens)
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`
        return { success: true, tokens }
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (err) {
      // If refresh fails, logout user
      authStore.clearAuth()
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
      return { success: false, error: err.message }
    }
  }

  // Verify email function
  const verifyEmail = async (token) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/verify-email', { token })

      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Email verification failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Email verification failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Request password reset function
  const requestPasswordReset = async (email) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/request-password-reset', { email })

      return { success: true, message: response.data.message }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Password reset request failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Reset password function
  const resetPassword = async (token, password) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/reset-password', { token, password })

      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Password reset failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Password reset failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Setup 2FA function
  const setupTwoFactor = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/setup-2fa')

      if (response.data.success) {
        return { success: true, data: response.data.data }
      } else {
        throw new Error(response.data.message || '2FA setup failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '2FA setup failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Enable 2FA function
  const enableTwoFactor = async (secret, token) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/enable-2fa', { secret, token })

      if (response.data.success) {
        // Update user in store
        authStore.updateUser({ two_factor_enabled: true })
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || '2FA enable failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '2FA enable failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Disable 2FA function
  const disableTwoFactor = async (token) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/auth/disable-2fa', { token })

      if (response.data.success) {
        // Update user in store
        authStore.updateUser({ two_factor_enabled: false })
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || '2FA disable failed')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '2FA disable failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize auth on app start
  const initializeAuth = () => {
    const storedToken = authStore.token
    const storedUser = authStore.user

    if (storedToken && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
  }

  return {
    // State
    isLoading,
    error,

    // Computed
    isAuthenticated,
    user,
    token,

    // Methods
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
    initializeAuth,
  }
}
