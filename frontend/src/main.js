import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './index.css'
import { initTheme } from './composables/useTheme'
import { toastPlugin } from './composables/useToast'

initTheme()
import { permissionDirective } from './directives/permissions'
import { usePermissions } from './composables/usePermissions'

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add axios interceptor for auth
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add axios interceptor for token refresh and notifications
axios.interceptors.response.use(
  (response) => {
    // Show success notifications for certain operations
    if (response.config.method !== 'get' && response.data?.success) {
      const method = response.config.method?.toUpperCase()
      if (method === 'POST' && response.config.url?.includes('/applications/apply')) {
        // Don't show notification for application submission
      } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        // Show success for create/update operations
        if (window.$toast) {
          window.$toast.success('Succès', 'Opération réalisée avec succès')
        }
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Show error notifications
    if (error.response?.status >= 400 && window.$toast) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.error || 'Une erreur est survenue'

      if (status === 401) {
        window.$toast.warning('Session expirée', 'Veuillez vous reconnecter')
      } else if (status === 403) {
        window.$toast.warning('Accès refusé', 'Vous n\'avez pas les permissions nécessaires')
      } else if (status === 404) {
        window.$toast.error('Ressource introuvable', 'L\'élément demandé n\'existe pas')
      } else if (status === 422) {
        window.$toast.warning('Données invalides', message)
      } else if (status >= 500) {
        window.$toast.error('Erreur serveur', 'Un problème technique est survenu')
      } else {
        window.$toast.error('Erreur', message)
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post('/auth/refresh', {
            refresh_token: refreshToken
          })

          if (response.data.success) {
            const { tokens } = response.data.data
            localStorage.setItem('token', tokens.access_token)
            localStorage.setItem('refreshToken', tokens.refresh_token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`

            return axios(originalRequest)
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

const app = createApp(App)
const pinia = createPinia()

// Register global directive
app.directive('permission', permissionDirective)

// Add global $can function
app.config.globalProperties.$can = (permission) => {
  const { hasPermission } = usePermissions()
  return hasPermission(permission)
}

// Use plugins
app.use(pinia)
app.use(router)
app.use(toastPlugin)

// Make toast available globally for axios interceptors
window.$toast = app.config.globalProperties.$toast

app.mount('#app')

import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
authStore.initializeFromStorage()
