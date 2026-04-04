import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './index.css'
import { initTheme } from './composables/useTheme'

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

// Add axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

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

// Initialize auth
import { useAuth } from './composables/useAuth'
const { initializeAuth } = useAuth()
initializeAuth()

app.mount('#app')
