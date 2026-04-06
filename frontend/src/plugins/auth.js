import { useAuthStore } from '@/stores/auth'

export default {
  install(app) {
    // Add global properties for auth
    app.config.globalProperties.$auth = useAuthStore()

    // Add global auth methods
    app.config.globalProperties.$isAuthenticated = () => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated
    }

    app.config.globalProperties.$user = () => {
      const authStore = useAuthStore()
      return authStore.user
    }

    app.config.globalProperties.$logout = () => {
      const authStore = useAuthStore()
      return authStore.logout()
    }
  }
}