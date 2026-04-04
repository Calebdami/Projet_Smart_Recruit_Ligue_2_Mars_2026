import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import analyticsService from '@/services/analytics.service'

export const useAnalyticsStore = defineStore('analytics', () => {
  // State
  const dashboardStats = ref({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    totalApplications: 0
  })
  const overviewStats = ref(null)
  const recentActivity = ref([])
  const pipelineStats = ref(null)
  const timeToHire = ref(null)
  const sourceEffectiveness = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const stats = computed(() => dashboardStats.value)
  const activity = computed(() => recentActivity.value)
  const isLoading = computed(() => loading.value)

  // Actions
  const fetchDashboardStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await analyticsService.getDashboardStats()
      dashboardStats.value = response.data?.stats || response.data || {}
      return { success: true, stats: dashboardStats.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch stats'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchOverviewStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await analyticsService.getOverviewStats()
      overviewStats.value = response.data
      return { success: true, data: overviewStats.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch overview'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchRecentActivity = async (limit = 10) => {
    loading.value = true
    error.value = null
    try {
      const response = await analyticsService.getRecentActivity(limit)
      recentActivity.value = response.data?.activity || response.data || []
      return { success: true, activity: recentActivity.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch activity'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchPipelineStats = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await analyticsService.getPipelineStats(params)
      pipelineStats.value = response.data
      return { success: true, data: pipelineStats.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch pipeline stats'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const refreshAllStats = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchRecentActivity(),
      fetchOverviewStats()
    ])
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    dashboardStats,
    overviewStats,
    recentActivity,
    pipelineStats,
    timeToHire,
    sourceEffectiveness,
    loading,
    error,
    // Getters
    stats,
    activity,
    isLoading,
    // Actions
    fetchDashboardStats,
    fetchOverviewStats,
    fetchRecentActivity,
    fetchPipelineStats,
    refreshAllStats,
    clearError
  }
})
