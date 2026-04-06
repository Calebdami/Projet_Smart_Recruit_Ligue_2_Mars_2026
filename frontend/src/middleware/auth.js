import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'

/**
 * Authentication middleware
 * Redirects to login if user is not authenticated
 */
export default function auth({ to, next }) {
  const authStore = useAuthStore()
  const { hasRole } = usePermissions()

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Check role-based access if specified in route meta
  if (to.meta.roles && !hasRole(to.meta.roles)) {
    return next({ name: 'Home' }) // Redirect to home if no permission
  }

  // Check permission-based access if specified in route meta
  if (to.meta.permissions) {
    const { can } = usePermissions()
    const hasPermission = Array.isArray(to.meta.permissions)
      ? to.meta.permissions.some(permission => can(permission))
      : can(to.meta.permissions)

    if (!hasPermission) {
      return next({ name: 'Home' }) // Redirect to home if no permission
    }
  }

  return next()
}
