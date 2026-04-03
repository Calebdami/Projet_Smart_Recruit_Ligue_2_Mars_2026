import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { roles, permissions } from '@/config/roles'

export function usePermissions() {
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)
  const userRole = computed(() => user.value?.role)

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!userRole.value) return false

    const rolePermissions = permissions[userRole.value] || []
    return rolePermissions.includes(permission)
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => hasPermission(permission))
  }

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => hasPermission(permission))
  }

  // Check if user has a specific role
  const hasRole = (role) => {
    return userRole.value === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roleList) => {
    return roleList.includes(userRole.value)
  }

  // Check if user role is at least the specified level
  const hasRoleLevel = (minRole) => {
    if (!userRole.value || !minRole) return false

    const roleHierarchy = {
      candidate: 1,
      recruiter: 2,
      admin: 3,
    }

    const userLevel = roleHierarchy[userRole.value] || 0
    const minLevel = roleHierarchy[minRole] || 0

    return userLevel >= minLevel
  }

  // Get all permissions for current user
  const getUserPermissions = () => {
    if (!userRole.value) return []
    return permissions[userRole.value] || []
  }

  // Check if user can access a resource
  const canAccessResource = (resource, action = 'view') => {
    const permission = `${action}_${resource}`
    return hasPermission(permission)
  }

  return {
    user,
    userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasRoleLevel,
    getUserPermissions,
    canAccessResource,
  }
}