// Role definitions
export const roles = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  CANDIDATE: 'candidate',
}

// Role hierarchy for level-based checks
export const roleHierarchy = {
  [roles.CANDIDATE]: 1,
  [roles.RECRUITER]: 2,
  [roles.ADMIN]: 3,
}

// Permission definitions
export const PERMISSIONS = {
  // User management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',
  MANAGE_USERS: 'manage_users',

  // Profile management
  VIEW_OWN_PROFILE: 'view_own_profile',
  UPDATE_OWN_PROFILE: 'update_own_profile',
  UPLOAD_AVATAR: 'upload_avatar',

  // Job management
  VIEW_JOBS: 'view_jobs',
  CREATE_JOBS: 'create_jobs',
  UPDATE_JOBS: 'update_jobs',
  DELETE_JOBS: 'delete_jobs',
  PUBLISH_JOBS: 'publish_jobs',

  // Application management
  VIEW_APPLICATIONS: 'view_applications',
  CREATE_APPLICATIONS: 'create_applications',
  UPDATE_APPLICATIONS: 'update_applications',
  REVIEW_APPLICATIONS: 'review_applications',

  // Candidate management
  VIEW_CANDIDATES: 'view_candidates',
  UPDATE_CANDIDATES: 'update_candidates',
  CONTACT_CANDIDATES: 'contact_candidates',

  // Webinar management
  VIEW_WEBINARS: 'view_webinars',
  CREATE_WEBINARS: 'create_webinars',
  UPDATE_WEBINARS: 'update_webinars',
  DELETE_WEBINARS: 'delete_webinars',
  MANAGE_WEBINAR_REGISTRATIONS: 'manage_webinar_registrations',

  // Analytics and reporting
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',

  // System administration
  MANAGE_SYSTEM: 'manage_system',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_SETTINGS: 'manage_settings',
}

// Role-based permissions mapping
export const permissions = {
  [roles.CANDIDATE]: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.UPLOAD_AVATAR,
    PERMISSIONS.VIEW_JOBS,
    PERMISSIONS.CREATE_APPLICATIONS,
    PERMISSIONS.UPDATE_APPLICATIONS,
    PERMISSIONS.VIEW_APPLICATIONS,
    PERMISSIONS.VIEW_WEBINARS,
  ],

  [roles.RECRUITER]: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.UPLOAD_AVATAR,
    PERMISSIONS.VIEW_JOBS,
    PERMISSIONS.CREATE_JOBS,
    PERMISSIONS.UPDATE_JOBS,
    PERMISSIONS.DELETE_JOBS,
    PERMISSIONS.PUBLISH_JOBS,
    PERMISSIONS.VIEW_APPLICATIONS,
    PERMISSIONS.UPDATE_APPLICATIONS,
    PERMISSIONS.REVIEW_APPLICATIONS,
    PERMISSIONS.VIEW_CANDIDATES,
    PERMISSIONS.UPDATE_CANDIDATES,
    PERMISSIONS.CONTACT_CANDIDATES,
    PERMISSIONS.VIEW_WEBINARS,
    PERMISSIONS.CREATE_WEBINARS,
    PERMISSIONS.UPDATE_WEBINARS,
    PERMISSIONS.DELETE_WEBINARS,
    PERMISSIONS.MANAGE_WEBINAR_REGISTRATIONS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
  ],

  [roles.ADMIN]: [
    // All permissions
    ...Object.values(PERMISSIONS),
  ],
}

// Helper functions
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [roles.CANDIDATE]: 'Candidate',
    [roles.RECRUITER]: 'Recruiter',
    [roles.ADMIN]: 'Administrator',
  }
  return displayNames[role] || role
}

export const getRoleDescription = (role) => {
  const descriptions = {
    [roles.CANDIDATE]: 'Job seekers who can apply for positions and manage their profile',
    [roles.RECRUITER]: 'HR professionals who can post jobs, review applications, and manage candidates',
    [roles.ADMIN]: 'System administrators with full access to all features and user management',
  }
  return descriptions[role] || ''
}

export const isValidRole = (role) => {
  return Object.values(roles).includes(role)
}

export const getRoleLevel = (role) => {
  return roleHierarchy[role] || 0
}

export const compareRoles = (role1, role2) => {
  const level1 = getRoleLevel(role1)
  const level2 = getRoleLevel(role2)
  return level1 - level2
}
