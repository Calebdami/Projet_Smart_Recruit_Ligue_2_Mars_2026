import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import candidatesService from '@/services/candidates.service'

export const useCandidatesStore = defineStore('candidates', () => {
  // State
  const candidates = ref([])
  const currentCandidate = ref(null)
  const candidateCV = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    job_id: '',
    status: '',
    smart_score_min: ''
  })

  // Getters
  const allCandidates = computed(() => candidates.value)
  const candidatesCount = computed(() => candidates.value.length)
  const topCandidates = computed(() => candidates.value.filter(c => (c.smart_score || 0) >= 80))
  const newCandidates = computed(() => {
    const now = Date.now()
    return candidates.value.filter(c => {
      const daysSince = c.created_at ? (now - new Date(c.created_at).getTime()) / 86400000 : 999
      return daysSince <= 7
    })
  })
  const isLoading = computed(() => loading.value)

  // Stats
  const getLatestApplication = (candidate) => {
    return candidate.last_application || (candidate.applications?.length ? candidate.applications[0] : null)
  }

  const stats = computed(() => ({
    total: candidates.value.length,
    new: newCandidates.value.length,
    in_process: candidates.value.filter(c => ['reviewing', 'interview', 'offer'].includes(getLatestApplication(c)?.status)).length,
    hired: candidates.value.filter(c => getLatestApplication(c)?.status === 'hired').length
  }))

  // Actions
  const fetchCandidates = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await candidatesService.getCandidates({ ...filters.value, ...params })
      const data = response.data?.candidates || response.data || []
      
      // Optimize structure to avoid computing latest application frequently during render
      candidates.value = data.map(c => {
        if (!c.last_application && c.applications?.length) {
          c.last_application = [...c.applications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        }
        return c
      })
      
      return { success: true, candidates: candidates.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch candidates'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchCandidate = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await candidatesService.getCandidate(id)
      currentCandidate.value = response.data?.candidate || response.data
      return { success: true, candidate: currentCandidate.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch candidate'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchCandidateCV = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await candidatesService.getCandidateCV(id)
      candidateCV.value = response.data?.cv || response.data
      return { success: true, cv: candidateCV.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch CV'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const uploadCV = async (id, file) => {
    loading.value = true
    error.value = null
    try {
      const response = await candidatesService.uploadCV(id, file)
      if (currentCandidate.value?.id === id) {
        currentCandidate.value.cv_url = response.data?.cv_url
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to upload CV'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const parseCV = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await candidatesService.parseCV(id)
      if (currentCandidate.value?.id === id) {
        currentCandidate.value.parsed_data = response.data?.parsed_data
        currentCandidate.value.smart_score = response.data?.smart_score
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to parse CV'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateCandidate = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const response = await candidatesService.updateCandidate(id, data)
      const updated = response.data?.candidate || response.data
      const index = candidates.value.findIndex(c => c.id === id)
      if (index !== -1) {
        candidates.value[index] = { ...candidates.value[index], ...updated }
      }
      if (currentCandidate.value?.id === id) {
        currentCandidate.value = { ...currentCandidate.value, ...updated }
      }
      return { success: true, candidate: updated }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update candidate'
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
    candidates,
    currentCandidate,
    candidateCV,
    loading,
    error,
    filters,
    // Getters
    allCandidates,
    candidatesCount,
    topCandidates,
    newCandidates,
    stats,
    isLoading,
    // Actions
    fetchCandidates,
    fetchCandidate,
    fetchCandidateCV,
    uploadCV,
    parseCV,
    updateCandidate,
    setFilters,
    clearError
  }
})
