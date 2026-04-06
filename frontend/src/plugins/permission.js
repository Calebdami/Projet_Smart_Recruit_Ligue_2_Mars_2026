import { usePermissions } from '@/composables/usePermissions'

export default {
  install(app) {
    // Add global permission methods
    app.config.globalProperties.$can = (permission) => {
      const { can } = usePermissions()
      return can(permission)
    }

    app.config.globalProperties.$hasRole = (role) => {
      const { hasRole } = usePermissions()
      return hasRole(role)
    }

    app.config.globalProperties.$hasAnyRole = (roles) => {
      const { hasAnyRole } = usePermissions()
      return hasAnyRole(roles)
    }

    app.config.globalProperties.$isAdmin = () => {
      const { isAdmin } = usePermissions()
      return isAdmin()
    }
  }
}