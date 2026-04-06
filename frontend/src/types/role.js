/**
 * @typedef {Object} Role
 * @property {string} id - Role ID
 * @property {string} name - Role name
 * @property {string} description - Role description
 * @property {number} level - Role hierarchy level (higher = more permissions)
 * @property {string[]} permissions - Permissions granted by this role
 * @property {string[]} inherits - Roles this role inherits from
 * @property {boolean} isSystem - Whether this is a system role
 */

/**
 * @typedef {Object} RoleHierarchy
 * @property {string} role - Role name
 * @property {number} level - Hierarchy level
 * @property {string[]} children - Child roles
 * @property {string[]} permissions - All permissions (including inherited)
 */

export {} // Make this a module