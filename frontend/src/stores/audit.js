import { defineStore } from 'pinia'
import { ref } from 'vue'
import AuditService from '@/services/audit'

export const useAuditStore = defineStore('audit', () => {
  const logs = ref([])
  const totalLogs = ref(0)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 20,
    totalPages: 1
  })

  const fetchLogs = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await AuditService.getLogs({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params
      })
      
      if (response.success) {
        logs.value = response.data.logs
        totalLogs.value = response.data.total
        pagination.value.totalPages = Math.ceil(totalLogs.value / pagination.value.limit)
        return { success: true }
      } else {
        throw new Error(response.message || 'Échec de la récupération des logs d\'audit')
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const setPage = (page) => {
    pagination.value.page = page
  }

  return {
    logs,
    totalLogs,
    loading,
    error,
    pagination,
    fetchLogs,
    setPage
  }
})
