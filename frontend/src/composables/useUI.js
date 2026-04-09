import { ref, reactive } from 'vue'

// Global state
const notifications = ref([])
const confirmModal = reactive({
  show: false,
  type: 'warning',
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loadingText: 'Processing...',
  showCancel: true,
  loading: false,
  reject: null
})

const isSidebarOpen = ref(false)

let notificationId = 0

export function useUI() {
  // Notifications
  const addNotification = (notification) => {
    const merged = {
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      ...notification,
    }
    const title = String(merged.title ?? '').trim()
    const message = String(merged.message ?? '').trim()
    if (!title && !message) {
      return null
    }

    const id = ++notificationId
    const newNotification = {
      id,
      ...merged,
      title,
      message,
    }

    notifications.value.push(newNotification)
    
    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const showSuccess = (title, message = '', duration = 5000) => {
    return addNotification({ type: 'success', title, message, duration })
  }

  const showError = (title, message = '', duration = 0) => {
    return addNotification({ type: 'error', title, message, duration })
  }

  const showWarning = (title, message = '', duration = 5000) => {
    return addNotification({ type: 'warning', title, message, duration })
  }

  const showInfo = (title, message = '', duration = 5000) => {
    return addNotification({ type: 'info', title, message, duration })
  }

  // Confirmation modal
  const showConfirm = (options) => {
    return new Promise((resolve, reject) => {
      Object.assign(confirmModal, {
        show: true,
        type: 'warning',
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        loadingText: 'Processing...',
        showCancel: true,
        loading: false,
        resolve,
        reject,
        ...options
      })
    })
  }

  const confirmDelete = (itemName = 'item') => {
    return showConfirm({
      type: 'danger',
      title: 'Delete Confirmation',
      message: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })
  }

  const confirmLogout = () => {
    return showConfirm({
      type: 'warning',
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel'
    })
  }

  const confirmAction = (title, message, options = {}) => {
    return showConfirm({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const handleConfirm = () => {
    if (confirmModal.resolve) {
      confirmModal.resolve(true)
    }
    closeConfirmModal()
  }

  const handleCancel = () => {
    if (confirmModal.reject) {
      confirmModal.reject(false)
    }
    closeConfirmModal()
  }

  const closeConfirmModal = () => {
    confirmModal.show = false
    confirmModal.loading = false
    confirmModal.resolve = null
    confirmModal.reject = null
  }

  const setConfirmLoading = (loading) => {
    confirmModal.loading = loading
  }

  // Generic notify function
  const notify = (type, message, title = '', duration) => {
    switch (type) {
      case 'success':
        return showSuccess(title, message, duration)
      case 'error':
        return showError(title, message, duration)
      case 'warning':
        return showWarning(title, message, duration)
      case 'info':
        return showInfo(title, message, duration)
      default:
        return showInfo(title, message, duration)
    }
  }

  // Clear all notifications
  const clearNotifications = () => {
    notifications.value = []
  }

  return {
    // State
    notifications,
    confirmModal,
    isSidebarOpen,

    // Notifications
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    notify,
    clearNotifications,
    
    // Confirmation
    showConfirm,
    confirmDelete,
    confirmLogout,
    confirmAction,
    handleConfirm,
    handleCancel,
    closeConfirmModal,
    setConfirmLoading,

    // Sidebar
    toggleSidebar: () => isSidebarOpen.value = !isSidebarOpen.value,
    closeSidebar: () => isSidebarOpen.value = false
  }
}
