import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/config/api'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref(null)
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const userProfile = computed(() => currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const isRecruiter = computed(() => currentUser.value?.role === 'recruiter')
  const isCandidate = computed(() => currentUser.value?.role === 'candidate')

  // Actions
  const fetchProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/users/profile')

      if (response.data.success) {
        currentUser.value = response.data.data.user
        return { success: true, user: currentUser.value }
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch profile'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updates) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put('/users/profile', updates)

      if (response.data.success) {
        currentUser.value = response.data.data.user
        return { success: true, user: currentUser.value, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Failed to update profile')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update profile'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const uploadAvatar = async (file) => {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await api.post('/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        // Update avatar URL in current user
        if (currentUser.value) {
          currentUser.value.avatar_url = response.data.data.avatar_url
        }
        return { success: true, avatarUrl: response.data.data.avatar_url, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Failed to upload avatar')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to upload avatar'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchUsers = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/users', { params })

      if (response.data.success) {
        users.value = response.data.data.users
        return {
          success: true,
          users: users.value,
          pagination: response.data.data.pagination
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch users')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch users'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/users/${id}`)

      if (response.data.success) {
        return { success: true, user: response.data.data.user }
      } else {
        throw new Error(response.data.message || 'Failed to fetch user')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch user'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/users/${id}`, updates)

      if (response.data.success) {
        return { success: true, user: response.data.data.user, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Failed to update user')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update user'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createUser = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/users', payload)
      if (response.data.success) {
        return { success: true, user: response.data.data?.user, message: response.data.message }
      }
      throw new Error(response.data.message || 'Failed to create user')
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to create user'
      return { success: false, error: error.value, details: err.response?.data?.errors }
    } finally {
      loading.value = false
    }
  }

  const deactivateUser = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.delete(`/users/${id}/deactivate`)

      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Failed to deactivate user')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to deactivate user'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const reactivateUser = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/users/${id}/reactivate`)

      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        throw new Error(response.data.message || 'Failed to reactivate user')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to reactivate user'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const setCurrentUser = (user) => {
    currentUser.value = user
  }

  return {
    // State
    currentUser,
    users,
    loading,
    error,

    // Computed
    userProfile,
    isAdmin,
    isRecruiter,
    isCandidate,

    // Actions
    fetchProfile,
    updateProfile,
    uploadAvatar,
    fetchUsers,
    fetchUserById,
    updateUser,
    createUser,
    deactivateUser,
    reactivateUser,
    clearError,
    setCurrentUser,
  }
})
