/**
 * @typedef {Object} Permission
 * @property {string} id - Permission ID
 * @property {string} name - Permission name (e.g., 'users.view')
 * @property {string} description - Human readable description
 * @property {string} resource - Resource this permission applies to
 * @property {string} action - Action this permission allows
 * @property {string[]} roles - Roles that have this permission
 */

/**
 * @typedef {Object} PermissionCheck
 * @property {string} resource - Resource to check
 * @property {string} action - Action to check
 * @property {User} [user] - User to check permissions for (defaults to current user)
 */

export {} // Make this a module