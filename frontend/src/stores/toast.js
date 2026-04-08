import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useToastStore = defineStore('toast', () => {
  // State
  const toasts = ref([])
  const nextId = ref(1)

  // Getters
  const activeToasts = computed(() =>
    toasts.value.filter(t => !t.removed)
  )

  const hasToasts = computed(() => activeToasts.value.length > 0)

  // Actions
  const addToast = (toast) => {
    const id = nextId.value++
    const newToast = {
      id,
      createdAt: Date.now(),
      duration: toast.duration || 5000, // 5 seconds default
      persistent: toast.persistent || false,
      ...toast
    }

    toasts.value.unshift(newToast)

    // Auto-remove if not persistent and has duration
    if (!newToast.persistent && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  const clearByType = (type) => {
    toasts.value = toasts.value.filter(t => t.type !== type)
  }

  // Convenience methods for different toast types
  const success = (title, message = '', options = {}) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (title, message = '', options = {}) => {
    return addToast({
      type: 'error',
      title,
      message,
      persistent: true, // Errors are persistent by default
      ...options
    })
  }

  const warning = (title, message = '', options = {}) => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (title, message = '', options = {}) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  const connection = (title, message = '', options = {}) => {
    return addToast({
      type: 'connection',
      title,
      message,
      ...options
    })
  }

  const update = (title, message = '', options = {}) => {
    return addToast({
      type: 'update',
      title,
      message,
      ...options
    })
  }

  return {
    // State
    toasts,
    // Getters
    activeToasts,
    hasToasts,
    // Actions
    addToast,
    removeToast,
    clearAll,
    clearByType,
    // Convenience methods
    success,
    error,
    warning,
    info,
    connection,
    update
  }
})