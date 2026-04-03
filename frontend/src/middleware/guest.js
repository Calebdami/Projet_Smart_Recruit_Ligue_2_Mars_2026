import { useAuthStore } from '@/stores/auth'

/**
 * Guest middleware
 * Redirects to home if user is already authenticated
 */
export default function guest({ next }) {
  const authStore = useAuthStore()

  // Redirect to home if already authenticated
  if (authStore.isAuthenticated) {
    return next({ name: 'Home' })
  }

  return next()
}
