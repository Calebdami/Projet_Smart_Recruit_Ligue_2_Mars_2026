import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'

// Shared singleton state across all composable consumers
const socket = ref(null)
const isConnected = ref(false)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5
const reconnectDelay = 3000
let authWatchInitialized = false

export function useWebSocket() {
  const authStore = useAuthStore()
  const notificationsStore = useNotificationsStore()
  const toast = useToast()

  const connect = () => {
    if (socket.value || !authStore.isAuthenticated) return

    const token = authStore.token?.access_token || localStorage.getItem('token')
    if (!token) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = import.meta.env.VITE_WS_URL || 'localhost:3000'
    const wsUrl = `${protocol}//${host}/ws?token=${token}`
    try {
      socket.value = new WebSocket(wsUrl)

      socket.value.onopen = () => {
        isConnected.value = true
      }

      socket.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      socket.value.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason)
        isConnected.value = false
        socket.value = null

        // Invalid/auth error: stop retries until next login/token refresh
        if (event.code === 1008) {
          console.error('WebSocket authentication failed. Stopping reconnect attempts.')
          return
        }

        // Attempt to reconnect if not closed normally
        if (event.code !== 1000 && authStore.isAuthenticated) {
          attemptReconnect()
        }
      }

      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      attemptReconnect()
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close(1000, 'Normal closure')
      socket.value = null
      isConnected.value = false
    }
  }

  const attemptReconnect = () => {
    if (reconnectAttempts.value < maxReconnectAttempts) {
      reconnectAttempts.value++
      console.log(`Attempting to reconnect (${reconnectAttempts.value}/${maxReconnectAttempts})...`)
      setTimeout(connect, reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  const handleMessage = (message) => {
    switch (message.type) {
      case 'connected':
        reconnectAttempts.value = 0
        break

      case 'toast_notification':
        // Add to notifications store
        if (notificationsStore.addNotification) {
          notificationsStore.addNotification(message.data)
        }

        // Show toast
        if (toast[message.data.type]) {
          toast[message.data.type](message.data.title, message.data.message)
        } else {
          toast.info(message.data.title, message.data.message)
        }
        break

      case 'notification':
        if (notificationsStore.addNotification) {
          notificationsStore.addNotification(message.data)
        }
        break

      case 'ping':
        socket.value.send(JSON.stringify({ type: 'pong' }))
        break

      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  const sendMessage = (type, data = {}) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify({ type, data }))
      return true
    }
    return false
  }

  // Watch auth only once globally to avoid duplicate WS clients
  if (!authWatchInitialized) {
    authWatchInitialized = true
    watch(() => authStore.isAuthenticated, (isAuth) => {
      if (isAuth) {
        connect()
      } else {
        disconnect()
      }
    })
  }

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  }
}
