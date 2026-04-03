import { ref, reactive } from 'vue'

// Global notification state
const notifications = ref([])
const notificationId = ref(0)

// Notification types
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Notification positions
export const NotificationPositions = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center'
}

/**
 * Composable for managing notifications
 * Provides methods to create, update, and remove notifications
 */
export function useNotifications() {
  
  /**
   * Create a new notification
   * @param {Object} options - Notification options
   * @param {string} options.message - Notification message
   * @param {string} options.type - Notification type (success, error, warning, info)
   * @param {number} options.duration - Auto-dismiss duration in ms (0 for no auto-dismiss)
   * @param {string} options.position - Notification position
   * @param {boolean} options.persistent - If true, notification won't auto-dismiss
   * @param {Object} options.actions - Action buttons for the notification
   * @returns {number} Notification ID
   */
  const notify = ({
    message,
    type = NotificationTypes.INFO,
    duration = type === NotificationTypes.ERROR ? 5000 : 3000,
    position = NotificationPositions.TOP_RIGHT,
    persistent = false,
    actions = null
  }) => {
    const id = ++notificationId.value
    
    const notification = reactive({
      id,
      message,
      type,
      position,
      persistent,
      actions,
      timestamp: Date.now(),
      isVisible: true
    })
    
    notifications.value.push(notification)
    
    // Auto-dismiss if not persistent
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }
  
  /**
   * Remove a notification by ID
   * @param {number} id - Notification ID
   */
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      // Add fade-out animation
      notifications.value[index].isVisible = false
      
      // Remove after animation
      setTimeout(() => {
        notifications.value.splice(index, 1)
      }, 300)
    }
  }
  
  /**
   * Clear all notifications
   */
  const clearAll = () => {
    notifications.value.forEach(notification => {
      notification.isVisible = false
    })
    
    setTimeout(() => {
      notifications.value = []
    }, 300)
  }
  
  /**
   * Success notification shortcut
   * @param {string} message - Success message
   * @param {Object} options - Additional options
   */
  const success = (message, options = {}) => {
    return notify({ ...options, message, type: NotificationTypes.SUCCESS })
  }
  
  /**
   * Error notification shortcut
   * @param {string} message - Error message
   * @param {Object} options - Additional options
   */
  const error = (message, options = {}) => {
    return notify({ 
      ...options, 
      message, 
      type: NotificationTypes.ERROR,
      duration: 5000
    })
  }
  
  /**
   * Warning notification shortcut
   * @param {string} message - Warning message
   * @param {Object} options - Additional options
   */
  const warning = (message, options = {}) => {
    return notify({ ...options, message, type: NotificationTypes.WARNING })
  }
  
  /**
   * Info notification shortcut
   * @param {string} message - Info message
   * @param {Object} options - Additional options
   */
  const info = (message, options = {}) => {
    return notify({ ...options, message, type: NotificationTypes.INFO })
  }
  
  /**
   * Show loading notification
   * @param {string} message - Loading message
   * @param {Object} options - Additional options
   */
  const loading = (message = 'Chargement...', options = {}) => {
    return notify({ 
      ...options, 
      message, 
      type: NotificationTypes.INFO,
      persistent: true,
      duration: 0
    })
  }
  
  /**
   * Update an existing notification
   * @param {number} id - Notification ID
   * @param {Object} updates - Properties to update
   */
  const updateNotification = (id, updates) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      Object.assign(notification, updates)
    }
  }
  
  /**
   * Get notifications by position
   * @param {string} position - Position filter
   * @returns {Array} Filtered notifications
   */
  const getNotificationsByPosition = (position) => {
    return notifications.value.filter(n => n.position === position)
  }
  
  /**
   * Handle API errors and show appropriate notifications
   * @param {Error} error - API error
   * @param {string} context - Context for the error
   */
  const handleApiError = (error, context = 'API') => {
    console.error(`${context} Error:`, error)
    
    let message = 'Une erreur est survenue'
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data
      
      switch (status) {
        case 400:
          message = data.message || 'Requête invalide'
          break
        case 401:
          message = 'Authentification requise'
          break
        case 403:
          message = 'Accès non autorisé'
          break
        case 404:
          message = 'Ressource non trouvée'
          break
        case 422:
          message = data.message || 'Données invalides'
          break
        case 429:
          message = 'Trop de requêtes, veuillez réessayer plus tard'
          break
        case 500:
          message = 'Erreur serveur interne'
          break
        default:
          message = data.message || `Erreur ${status}`
      }
    } else if (error.request) {
      // Request was made but no response received
      message = 'Impossible de contacter le serveur'
    } else {
      // Something else happened
      message = error.message || message
    }
    
    error(message, { context })
  }
  
  return {
    // State
    notifications: notifications.value,
    
    // Methods
    notify,
    removeNotification,
    clearAll,
    updateNotification,
    getNotificationsByPosition,
    handleApiError,
    
    // Shortcuts
    success,
    error,
    warning,
    info,
    loading,
    
    // Constants
    NotificationTypes,
    NotificationPositions
  }
}

// Export singleton instance for global usage
export const globalNotifications = useNotifications()