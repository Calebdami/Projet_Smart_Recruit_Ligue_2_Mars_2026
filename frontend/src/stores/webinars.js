import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import webinarsService from '@/services/webinars.service'

export const useWebinarsStore = defineStore('webinars', () => {
  // State
  const webinars = ref([])
  const currentWebinar = ref(null)
  const registrations = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    status: '',
    date: ''
  })

  // Getters
  const allWebinars = computed(() => webinars.value)
  const upcomingWebinars = computed(() => webinars.value.filter(w => ['draft', 'scheduled'].includes(w.status)))
  const liveWebinars = computed(() => webinars.value.filter(w => w.status === 'live'))
  const pastWebinars = computed(() => webinars.value.filter(w => w.status === 'ended'))
  const isLoading = computed(() => loading.value)

  // Actions
  const fetchWebinars = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await webinarsService.getWebinars({ ...filters.value, ...params })
      webinars.value = response.data?.webinars || response.data || []
      return { success: true, webinars: webinars.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch webinars'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchWebinar = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await webinarsService.getWebinar(id)
      currentWebinar.value = response.data?.webinar || response.data
      return { success: true, webinar: currentWebinar.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch webinar'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createWebinar = async (data) => {
    loading.value = true
    error.value = null
    try {
      const response = await webinarsService.createWebinar(data)
      const newWebinar = response.data?.webinar || response.data
      webinars.value.unshift(newWebinar)
      return { success: true, webinar: newWebinar }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to create webinar'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateWebinar = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const response = await webinarsService.updateWebinar(id, data)
      const updated = response.data?.webinar || response.data
      const index = webinars.value.findIndex(w => w.id === id)
      if (index !== -1) {
        webinars.value[index] = updated
      }
      if (currentWebinar.value?.id === id) {
        currentWebinar.value = updated
      }
      return { success: true, webinar: updated }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update webinar'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const startWebinar = async (id) => {
    loading.value = true
    error.value = null
    try {
      await webinarsService.startWebinar(id)
      const index = webinars.value.findIndex(w => w.id === id)
      if (index !== -1) {
        webinars.value[index].status = 'live'
      }
      if (currentWebinar.value?.id === id) {
        currentWebinar.value.status = 'live'
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to start webinar'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const endWebinar = async (id) => {
    loading.value = true
    error.value = null
    try {
      await webinarsService.endWebinar(id)
      const index = webinars.value.findIndex(w => w.id === id)
      if (index !== -1) {
        webinars.value[index].status = 'ended'
      }
      if (currentWebinar.value?.id === id) {
        currentWebinar.value.status = 'ended'
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to end webinar'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchRegistrations = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await webinarsService.getRegistrations(id)
      registrations.value = response.data?.registrations || response.data || []
      return { success: true, registrations: registrations.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch registrations'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    webinars,
    currentWebinar,
    registrations,
    loading,
    error,
    filters,
    // Getters
    allWebinars,
    upcomingWebinars,
    liveWebinars,
    pastWebinars,
    isLoading,
    // Actions
    fetchWebinars,
    fetchWebinar,
    createWebinar,
    updateWebinar,
    startWebinar,
    endWebinar,
    fetchRegistrations,
    clearError
  }
})
