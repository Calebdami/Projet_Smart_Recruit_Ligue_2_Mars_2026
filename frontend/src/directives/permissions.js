import { usePermissions } from '@/composables/usePermissions'

export const permissionDirective = {
  mounted(el, binding) {
    const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } = usePermissions()

    const { value, modifiers } = binding

    if (!value) return

    let hasAccess = false

    // Check for role-based access
    if (modifiers.role) {
      if (Array.isArray(value)) {
        hasAccess = hasAnyRole(value)
      } else {
        hasAccess = hasRole(value)
      }
    }
    // Check for permission-based access
    else if (modifiers.any) {
      hasAccess = hasAnyPermission(Array.isArray(value) ? value : [value])
    } else if (modifiers.all) {
      hasAccess = hasAllPermissions(Array.isArray(value) ? value : [value])
    } else {
      // Default: check single permission
      hasAccess = hasPermission(value)
    }

    // Hide element if no access
    if (!hasAccess) {
      el.style.display = 'none'
    }
  },

  updated(el, binding) {
    // Re-check permissions on update
    const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } = usePermissions()

    const { value, modifiers } = binding

    if (!value) return

    let hasAccess = false

    if (modifiers.role) {
      if (Array.isArray(value)) {
        hasAccess = hasAnyRole(value)
      } else {
        hasAccess = hasRole(value)
      }
    } else if (modifiers.any) {
      hasAccess = hasAnyPermission(Array.isArray(value) ? value : [value])
    } else if (modifiers.all) {
      hasAccess = hasAllPermissions(Array.isArray(value) ? value : [value])
    } else {
      hasAccess = hasPermission(value)
    }

    el.style.display = hasAccess ? '' : 'none'
  },
}
