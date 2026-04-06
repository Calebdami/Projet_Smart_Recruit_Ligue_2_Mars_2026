/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} role - User role
 * @property {string[]} permissions - User permissions
 * @property {string} avatar - Avatar URL
 * @property {boolean} isActive - Account status
 * @property {boolean} emailVerified - Email verification status
 * @property {boolean} twoFactorEnabled - 2FA status
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 * @property {Date} lastLoginAt - Last login date
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phone
 * @property {string} bio
 * @property {string} avatar
 * @property {Object} preferences
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} UserCreate
 * @property {string} email
 * @property {string} password
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} role
 */

/**
 * @typedef {Object} UserUpdate
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [phone]
 * @property {string} [bio]
 * @property {Object} [preferences]
 */

export {} // Make this a module
