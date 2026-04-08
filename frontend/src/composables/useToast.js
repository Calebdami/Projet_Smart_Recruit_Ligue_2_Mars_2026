import { useToastStore } from '@/stores/toast'

export const useToast = () => {
  const toastStore = useToastStore()

  const toast = {
    success: (title, message = '', options = {}) => toastStore.success(title, message, options),
    error: (title, message = '', options = {}) => toastStore.error(title, message, options),
    warning: (title, message = '', options = {}) => toastStore.warning(title, message, options),
    info: (title, message = '', options = {}) => toastStore.info(title, message, options),
    connection: (title, message = '', options = {}) => toastStore.connection(title, message, options),
    update: (title, message = '', options = {}) => toastStore.update(title, message, options),

    // Generic method
    show: (type, title, message = '', options = {}) => {
      return toastStore.addToast({ type, title, message, ...options })
    },

    // Remove methods
    remove: (id) => toastStore.removeToast(id),
    clearAll: () => toastStore.clearAll(),
    clearByType: (type) => toastStore.clearByType(type)
  }

  return toast
}

// Plugin pour Vue - ajoute $toast à toutes les instances Vue
export const toastPlugin = {
  install(app) {
    app.config.globalProperties.$toast = useToast()
  }
}

// Export pour utilisation directe
export default useToast