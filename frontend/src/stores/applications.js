import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import applicationsService from '@/services/applications.service'

export const useApplicationsStore = defineStore('applications', () => {
  // State
  const applications = ref([])
  const currentApplication = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    status: '',
    job_id: '',
    recruiter_id: ''
  })

  // Getters
  const allApplications = computed(() => applications.value)
  const applicationsCount = computed(() => applications.value.length)
  const newApplications = computed(() => applications.value.filter(a => a.status === 'new'))
  const inProcessApplications = computed(() => applications.value.filter(a => ['reviewing', 'interview', 'offer'].includes(a.status)))
  const hiredApplications = computed(() => applications.value.filter(a => a.status === 'hired'))
  const isLoading = computed(() => loading.value)

  // Actions
  const fetchApplications = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.getApplications({ ...filters.value, ...params })
      applications.value = response.data?.applications || response.data || []
      return { success: true, applications: applications.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch applications'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchApplication = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.getApplication(id)
      currentApplication.value = response.data?.application || response.data
      return { success: true, application: currentApplication.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch application'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (id, status, notes = '') => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.updateApplicationStatus(id, status, notes)
      const updated = response.data?.application || response.data
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value[index] = { ...applications.value[index], ...updated }
      }
      if (currentApplication.value?.id === id) {
        currentApplication.value = { ...currentApplication.value, ...updated }
      }
      return { success: true, application: updated }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update status'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const assignRecruiter = async (id, recruiterId) => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.assignRecruiter(id, recruiterId)
      const updated = response.data?.application || response.data
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value[index] = { ...applications.value[index], ...updated }
      }
      if (currentApplication.value?.id === id) {
        currentApplication.value = { ...currentApplication.value, ...updated }
      }
      return { success: true, application: updated }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to assign recruiter'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkAssignRecruiter = async (applicationIds, recruiterId) => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.bulkAssignRecruiter(applicationIds, recruiterId)
      const updatedApplications = response.data?.applications || response.data || []

      // Update local state
      updatedApplications.forEach(updated => {
        const index = applications.value.findIndex(a => a.id === updated.id)
        if (index !== -1) {
          applications.value[index] = { ...applications.value[index], ...updated }
        }
      })

      return { success: true, applications: updatedApplications }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to bulk assign recruiters'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const addNote = async (id, note) => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.addNote(id, note)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to add note'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearError = () => {
    error.value = null
  }

  const dragDropStatus = async (id, status, notes = '') => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.dragDropStatus(id, status, notes)
      const updated = response.data
      // Update local application
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value[index] = { ...applications.value[index], ...updated, status }
      }
      if (currentApplication.value?.id === id) {
        currentApplication.value = { ...currentApplication.value, ...updated, status }
      }
      return { success: true, application: updated }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update status'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkDragDropStatus = async (applicationIds, status, notes = '') => {
    loading.value = true
    error.value = null
    try {
      const response = await applicationsService.bulkDragDropStatus(applicationIds, status, notes)
      const updatedApplications = response.data?.applications || []

      // Update local applications
      updatedApplications.forEach(updated => {
        const index = applications.value.findIndex(a => a.id === updated.id)
        if (index !== -1) {
          applications.value[index] = { ...applications.value[index], ...updated, status }
        }
      })

      return { success: true, applications: updatedApplications }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to bulk update status'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    applications,
    currentApplication,
    loading,
    error,
    filters,
    // Getters
    allApplications,
    applicationsCount,
    newApplications,
    inProcessApplications,
    hiredApplications,
    isLoading,
    // Actions
    fetchApplications,
    fetchApplication,
    updateStatus,
    assignRecruiter,
    bulkAssignRecruiter,
    addNote,
    dragDropStatus,
    bulkDragDropStatus,
    setFilters,
    clearError
  }
})
