import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jobsService from '@/services/jobs.service'

export const useJobsStore = defineStore('jobs', () => {
  // State
  const jobs = ref([])
  const currentJob = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const filters = ref({
    search: '',
    status: '',
    department: ''
  })

  // Getters
  const allJobs = computed(() => jobs.value)
  const publishedJobs = computed(() => jobs.value.filter(j => j.status === 'published'))
  const draftJobs = computed(() => jobs.value.filter(j => j.status === 'draft'))
  const closedJobs = computed(() => jobs.value.filter(j => j.status === 'closed'))
  const jobsCount = computed(() => jobs.value.length)
  const isLoading = computed(() => loading.value)

  // Actions
  const fetchJobs = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await jobsService.getJobs({ ...filters.value, ...params })
      const responseData = response.data || {}
      jobs.value = responseData.jobs || responseData || []
      // Extract pagination if available
      if (responseData.pagination) {
        pagination.value = responseData.pagination
      }
      return { success: true, jobs: jobs.value, pagination: pagination.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch jobs'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchJob = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await jobsService.getJob(id)
      currentJob.value = response.data?.job || response.data
      return { success: true, job: currentJob.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch job'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createJob = async (data) => {
    loading.value = true
    error.value = null
    try {
      const response = await jobsService.createJob(data)
      const newJob = response.data?.job || response.data
      jobs.value.unshift(newJob)
      return { success: true, job: newJob }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to create job'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateJob = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const response = await jobsService.updateJob(id, data)
      const updatedJob = response.data?.job || response.data
      const index = jobs.value.findIndex(j => j.id === id)
      if (index !== -1) {
        jobs.value[index] = updatedJob
      }
      if (currentJob.value?.id === id) {
        currentJob.value = updatedJob
      }
      return { success: true, job: updatedJob }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update job'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const closeJob = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await jobsService.closeJob(id)
      const index = jobs.value.findIndex(j => j.id === id)
      if (index !== -1) {
        jobs.value[index].status = 'closed'
      }
      if (currentJob.value?.id === id) {
        currentJob.value.status = 'closed'
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to close job'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteJob = async (id) => {
    loading.value = true
    error.value = null
    try {
      await jobsService.deleteJob(id)
      jobs.value = jobs.value.filter(j => j.id !== id)
      if (currentJob.value?.id === id) {
        currentJob.value = null
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete job'
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

  return {
    // State
    jobs,
    currentJob,
    loading,
    error,
    pagination,
    filters,
    // Getters
    allJobs,
    publishedJobs,
    draftJobs,
    closedJobs,
    jobsCount,
    isLoading,
    // Actions
    fetchJobs,
    fetchJob,
    createJob,
    updateJob,
    closeJob,
    deleteJob,
    setFilters,
    clearError
  }
})
