import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarCollapsed = ref(false)
  const currentTheme = ref('light')
  const isLoading = ref(false)
  const globalError = ref(null)
  const toast = ref({
    show: false,
    message: '',
    type: 'info'
  })

  // Getters
  const isDark = computed(() => currentTheme.value === 'dark')
  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed.value))
  }

  const setTheme = (theme) => {
    currentTheme.value = theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  const showToast = (message, type = 'info', duration = 3000) => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
      toast.value.show = false
    }, duration)
  }

  const hideToast = () => {
    toast.value.show = false
  }

  const setGlobalLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (error) => {
    globalError.value = error
  }

  const clearError = () => {
    globalError.value = null
  }

  // Initialize from localStorage
  const initialize = () => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored) {
      sidebarCollapsed.value = JSON.parse(stored)
    }
  }

  initialize()

  return {
    // State
    sidebarCollapsed,
    currentTheme,
    isLoading,
    globalError,
    toast,
    // Getters
    isDark,
    isSidebarCollapsed,
    // Actions
    toggleSidebar,
    setTheme,
    showToast,
    hideToast,
    setGlobalLoading,
    setError,
    clearError
  }
})