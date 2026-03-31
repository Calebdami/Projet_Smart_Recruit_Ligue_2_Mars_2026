import { verifyToken, verifyRefreshToken } from '../utils/auth.js';
import { db } from '../config/database.js';
import { rateLimit } from '../config/redis.js';

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'Please provide a valid access token',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const payload = verifyToken(token);
      req.user = payload;
      req.userId = payload.sub;
      req.userRole = payload.role;
      next();
    } catch (tokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Your access token is invalid or has expired',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'An error occurred during authentication',
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const payload = verifyToken(token);
        req.user = payload;
        req.userId = payload.sub;
        req.userRole = payload.role;
      } catch (tokenError) {
        // Token is invalid, but we don't fail the request
        // User will remain unauthenticated
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'You must be authenticated to access this resource',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `Required roles: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

// Alias for authorize - more readable name
const requireRole = authorize;

// Resource ownership middleware
const checkOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'You must be authenticated to access this resource',
      });
      return;
    }

    const resourceId = req.params.id || req.params.userId;
    const resourceType = req.baseUrl.split('/')[1]; // Extract resource type from URL

    // Admin can access everything
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Check resource ownership based on role and resource type
    let hasAccess = false;

    switch (req.user.role) {
      case 'recruiter':
        // Recruiters can access their own jobs, applications, webinars
        if (['jobs', 'applications', 'webinars'].includes(resourceType)) {
          const query = db(resourceType).where('id', resourceId);
          
          if (resourceType === 'jobs') {
            query.where('created_by', req.userId);
          } else if (resourceType === 'applications') {
            query.where('recruiter_id', req.userId);
          } else if (resourceType === 'webinars') {
            query.where('host_id', req.userId);
          }
          
          const resource = await query.first();
          hasAccess = !!resource;
        }
        break;

      case 'candidate':
        // Candidates can only access their own data
        if (['candidates', 'applications'].includes(resourceType)) {
          const query = db(resourceType).where('id', resourceId);
          
          if (resourceType === 'candidates') {
            query.where('user_id', req.userId);
          } else if (resourceType === 'applications') {
            query.where('candidate_id', req.userId);
          }
          
          const resource = await query.first();
          hasAccess = !!resource;
        }
        break;
    }

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You do not have permission to access this resource',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authorization error',
      message: 'An error occurred during authorization check',
    });
  }
};

// Refresh token middleware
const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'Refresh token required',
        message: 'Please provide a refresh token',
      });
      return;
    }

    try {
      const payload = verifyRefreshToken(refresh_token);
      
      // Get user from database
      const user = await db('users')
        .where('id', payload.sub)
        .where('is_active', true)
        .first();

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token',
          message: 'User not found or inactive',
        });
        return;
      }

      // Generate new tokens
      const { generateTokens } = require('../utils/auth');
      const tokens = await generateTokens(user);

      res.json({
        success: true,
        data: tokens,
        message: 'Tokens refreshed successfully',
      });
    } catch (tokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        message: 'Your refresh token is invalid or has expired',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token refresh error',
      message: 'An error occurred during token refresh',
    });
  }
};

// Two-factor authentication middleware
const requireTwoFactor = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'You must be authenticated to access this resource',
      });
      return;
    }

    // Get user with 2FA settings
    const user = await db('users')
      .where('id', req.userId)
      .where('is_active', true)
      .first();

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'Authenticated user not found in database',
      });
      return;
    }

    // Check if 2FA is enabled for this user
    if (user.two_factor_enabled) {
      const { two_factor_code } = req.body;

      if (!two_factor_code) {
        res.status(401).json({
          success: false,
          error: 'Two-factor authentication required',
          message: 'Please provide a two-factor authentication code',
        });
        return;
      }

      // Verify 2FA code
      const { verifyTwoFactorToken } = require('../utils/auth');
      const isValid = verifyTwoFactorToken(user.two_factor_secret, two_factor_code);

      if (!isValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid two-factor code',
          message: 'The provided two-factor authentication code is invalid',
        });
        return;
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Two-factor authentication error',
      message: 'An error occurred during two-factor authentication',
    });
  }
};

// Email verification middleware
const requireEmailVerification = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'You must be authenticated to access this resource',
      });
      return;
    }

    // Get user with email verification status
    const user = await db('users')
      .where('id', req.userId)
      .where('is_active', true)
      .first();

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'Authenticated user not found in database',
      });
      return;
    }

    // Check if email is verified
    if (!user.email_verified) {
      res.status(403).json({
        success: false,
        error: 'Email verification required',
        message: 'Please verify your email address to access this resource',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Email verification check error',
      message: 'An error occurred during email verification check',
    });
  }
};

// Rate limiting middleware
const rateLimitMiddleware = (limit, windowMs) => {
  return async (req, res, next) => {
    try {
      const identifier = req.ip || req.connection.remoteAddress || 'unknown';
      const key = `rate_limit:${identifier}`;

      const isLimited = await rateLimit.isLimited(identifier, limit, windowMs);

      if (isLimited) {
        const remaining = await rateLimit.getRemaining(identifier, limit);
        const resetTime = await rateLimit.getResetTime(identifier);

        res.set({
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetTime.toString(),
          'Retry-After': resetTime.toString(),
        });

        res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${resetTime} seconds.`,
        });
        return;
      }

      const remaining = await rateLimit.getRemaining(identifier, limit);
      const resetTime = await rateLimit.getResetTime(identifier);

      res.set({
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      });

      next();
    } catch (error) {
      // If rate limiting fails, allow the request to proceed
      next();
    }
  };
};

export {
  authenticate,
  optionalAuthenticate,
  authorize,
  requireRole,
  checkOwnership,
  refreshToken,
  requireTwoFactor,
  requireEmailVerification,
  rateLimitMiddleware,
};
