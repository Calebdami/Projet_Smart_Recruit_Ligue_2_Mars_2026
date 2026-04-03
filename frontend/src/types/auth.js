/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} isLoading - Loading state
 * @property {User|null} user - Current user
 * @property {string|null} token - JWT token
 * @property {string|null} refreshToken - Refresh token
 * @property {Error|null} error - Authentication error
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 * @property {string} [twoFactorCode] - 2FA code if enabled
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} email
 * @property {string} password
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [phone]
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} expiresIn
 */

/**
 * @typedef {Object} TwoFactorSetup
 * @property {string} secret - TOTP secret
 * @property {string} qrCodeUrl - QR code URL for authenticator apps
 * @property {string} backupCodes - Backup recovery codes
 */

export {} // Make this a module