import express from 'express';
import { AuthController } from '../controllers/auth.js';
import { authenticate, refreshToken, rateLimitMiddleware } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('password').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  body('password').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
  body('password').matches(/\d/).withMessage('Password must contain at least one number'),
  body('password').matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  body('role').isIn(['admin', 'recruiter', 'candidate']).withMessage('Valid role is required'),
  body('first_name').isLength({ min: 2 }).trim().withMessage('First name must be at least 2 characters long'),
  body('last_name').isLength({ min: 2 }).trim().withMessage('Last name must be at least 2 characters long'),
  body('phone').optional().matches(/^[\d\s-+()]+$/).withMessage('Invalid phone number format'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('two_factor_code').optional().isLength({ min: 6, max: 6 }).withMessage('Two-factor code must be 6 digits'),
];

const emailVerificationValidation = [
  body('token').notEmpty().withMessage('Verification token is required'),
];

const twoFactorSetupValidation = [
  body('secret').notEmpty().withMessage('Two-factor secret is required'),
  body('token').isLength({ min: 6, max: 6 }).withMessage('Two-factor code must be 6 digits'),
];

const passwordResetRequestValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
];

const passwordResetValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('password').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  body('password').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
  body('password').matches(/\d/).withMessage('Password must contain at least one number'),
  body('password').matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
];

// Routes
router.post('/register', 
  rateLimitMiddleware(5, 15 * 60 * 1000, 'auth_register'), // 5 requests per 15 minutes
  registerValidation,
  validateRequest,
  AuthController.register
);

router.post('/login',
  rateLimitMiddleware(10, 15 * 60 * 1000, 'auth_login'), // 10 requests per 15 minutes
  loginValidation,
  validateRequest,
  AuthController.login
);

router.post('/logout',
  authenticate,
  AuthController.logout
);

router.post('/refresh',
  rateLimitMiddleware(20, 60 * 60 * 1000, 'auth_refresh'), // 20 requests per hour
  refreshToken
);

router.post('/verify-email',
  rateLimitMiddleware(10, 60 * 60 * 1000, 'auth_verify_email'), // 10 requests per hour
  emailVerificationValidation,
  validateRequest,
  AuthController.verifyEmail
);

router.post('/setup-2fa',
  authenticate,
  AuthController.setupTwoFactor
);

router.post('/enable-2fa',
  authenticate,
  twoFactorSetupValidation,
  validateRequest,
  AuthController.enableTwoFactor
);

router.post('/disable-2fa',
  authenticate,
  body('token').isLength({ min: 6, max: 6 }).withMessage('Two-factor code must be 6 digits'),
  validateRequest,
  AuthController.disableTwoFactor
);

router.post('/request-password-reset',
  rateLimitMiddleware(3, 60 * 60 * 1000, 'auth_request_password_reset'), // 3 requests per hour
  passwordResetRequestValidation,
  validateRequest,
  AuthController.requestPasswordReset
);

router.post('/reset-password',
  rateLimitMiddleware(5, 60 * 60 * 1000, 'auth_reset_password'), // 5 requests per hour
  passwordResetValidation,
  validateRequest,
  AuthController.resetPassword
);

export default router;
