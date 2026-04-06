import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { config } from '../config/index.js';

// Password hashing and verification
const hashPassword = async (password) => {
  return bcrypt.hash(password, config.security.bcryptRounds);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// JWT token generation and verification
const generateTokens = async (user) => {
  const payload = { 
    id: user._id || user.id, 
    role: user.role 
  };
  const access_token = jwt.sign(
    payload, 
    process.env.JWT_SECRET || config.jwt.secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  const refresh_token = jwt.sign(
    { sub: user._id || user.id, type: 'refresh' },
    process.env.JWT_SECRET || config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn || '30d' }
  );

  return {
    access_token, // Correspond maintenant à la variable ci-dessus
    refresh_token,
    expires_in: 7 * 24 * 60 * 60, // 7 jours en secondes
    token_type: 'Bearer',
  };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Two-Factor Authentication
const generateTwoFactorSecret = (user) => {
  const secret = speakeasy.generateSecret({
    name: `SmartRecruit (${user.email})`,
    issuer: 'SmartRecruit',
    secretLength: 32,
  });

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url,
  };
};

const generateQRCode = async (otpauth_url) => {
  return qrcode.toDataURL(otpauth_url);
};

const verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 steps before/after current time
  });
};

// Email verification
const generateEmailVerificationToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Password reset
const generatePasswordResetToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

const isPasswordResetTokenValid = (expires) => {
  return new Date() < expires;
};

// Input validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateCreateUserData = (data) => {
  const errors = {};

  // Email validation
  if (!data.email) {
    errors.email = errors.email || [];
    errors.email.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.email = errors.email || [];
    errors.email.push('Invalid email format');
  }

  // Password validation
  if (!data.password) {
    errors.password = errors.password || [];
    errors.password.push('Password is required');
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }
  }

  // First name validation
  if (!data.first_name) {
    errors.first_name = errors.first_name || [];
    errors.first_name.push('First name is required');
  } else if (data.first_name.length < 2) {
    errors.first_name = errors.first_name || [];
    errors.first_name.push('First name must be at least 2 characters long');
  }

  // Last name validation
  if (!data.last_name) {
    errors.last_name = errors.last_name || [];
    errors.last_name.push('Last name is required');
  } else if (data.last_name.length < 2) {
    errors.last_name = errors.last_name || [];
    errors.last_name.push('Last name must be at least 2 characters long');
  }

  // Role validation
  const validRoles = ['admin', 'recruiter', 'candidate'];
  if (!data.role || !validRoles.includes(data.role)) {
    errors.role = errors.role || [];
    errors.role.push('Valid role is required');
  }

  // Phone validation (optional)
  if (data.phone) {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = errors.phone || [];
      errors.phone.push('Invalid phone number format');
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Security helpers
const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential JS injection
    .replace(/on\w+=/gi, ''); // Remove potential event handlers
};

const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};

// Rate limiting helpers
const getRateLimitKey = (identifier, action = 'general') => {
  return `rate_limit:${action}:${identifier}`;
};

const getSessionKey = (sessionId) => {
  return `session:${sessionId}`;
};

// Permission helpers
const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    admin: 3,
    recruiter: 2,
    candidate: 1,
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
};

const canAccessResource = (user, resourceType, resourceId) => {
  // Admin can access everything
  if (user.role === 'admin') {
    return true;
  }

  // Recruiters can access jobs, applications, webinars they created
  if (user.role === 'recruiter') {
    return ['job', 'application', 'webinar'].includes(resourceType);
  }

  // Candidates can only access their own data
  if (user.role === 'candidate') {
    return ['candidate', 'application'].includes(resourceType) && resourceId === user.id;
  }

  return false;
};

export {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  generateTwoFactorSecret,
  generateQRCode,
  verifyTwoFactorToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  isPasswordResetTokenValid,
  validateEmail,
  validatePassword,
  validateCreateUserData,
  generateSecureToken,
  sanitizeInput,
  maskEmail,
  getRateLimitKey,
  getSessionKey,
  hasPermission,
  canAccessResource,
};
