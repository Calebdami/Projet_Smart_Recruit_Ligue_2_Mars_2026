import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const refreshToken = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  const setUser = (userData) => {
    user.value = userData
    // Persist to localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const setTokens = (tokens) => {
    token.value = tokens.access_token
    refreshToken.value = tokens.refresh_token

    // Persist to localStorage
    localStorage.setItem('token', tokens.access_token)
    localStorage.setItem('refreshToken', tokens.refresh_token)
  }

  const updateUser = (updates) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    refreshToken.value = null

    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  // Initialize from localStorage
  const initializeFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }

    if (storedToken) {
      token.value = storedToken
    }

    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken
    }
  }

  // Initialize on store creation
  initializeFromStorage()

  return {
    // State
    user,
    token,
    refreshToken,

    // Computed
    isAuthenticated,

    // Actions
    setUser,
    setTokens,
    updateUser,
    clearAuth,
    initializeFromStorage,
  }
})
