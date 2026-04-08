import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import notificationsService from '@/services/notifications.service'

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allNotifications = computed(() => notifications.value)
  const unreadNotifications = computed(() => notifications.value.filter(n => !n.is_read))
  const isLoading = computed(() => loading.value)

  // Actions
  const fetchNotifications = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await notificationsService.getNotifications(params)
      notifications.value = response.data?.notifications || response.data || []
      return { success: true, notifications: notifications.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch notifications'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount()
      unreadCount.value = response.data?.count || 0
      return { success: true, count: unreadCount.value }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const markAsRead = async (id) => {
    loading.value = true
    error.value = null
    try {
      await notificationsService.markAsRead(id)
      const notif = notifications.value.find(n => n.id === id)
      if (notif) {
        notif.is_read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to mark as read'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const markAllAsRead = async () => {
    loading.value = true
    error.value = null
    try {
      await notificationsService.markAllAsRead()
      notifications.value.forEach(n => {
        n.is_read = true
      })
      unreadCount.value = 0
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to mark all as read'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteNotification = async (id) => {
    loading.value = true
    error.value = null
    try {
      await notificationsService.deleteNotification(id)
      const notif = notifications.value.find(n => n.id === id)
      if (notif && !notif.is_read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value = notifications.value.filter(n => n.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete notification'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const addNotification = (notification) => {
    const normalizedNotification = {
      ...notification,
      is_read: notification.is_read ?? notification.read ?? false
    }
    notifications.value.unshift(normalizedNotification)
    if (!normalizedNotification.is_read) {
      unreadCount.value++
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    // Getters
    allNotifications,
    unreadNotifications,
    isLoading,
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearError
  }
})
