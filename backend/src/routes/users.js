import express from 'express';
import { UsersController } from '../controllers/users.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import multer from 'multer';
import sharp from 'sharp';
import { db } from '../config/database.js';

const router = express.Router();

// Configure multer for avatar upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Validation rules
const profileUpdateValidation = [
  body('first_name').optional().isLength({ min: 2 }).trim().withMessage('First name must be at least 2 characters long'),
  body('last_name').optional().isLength({ min: 2 }).trim().withMessage('Last name must be at least 2 characters long'),
  body('phone').optional().matches(/^[\d\s-+()]+$/).withMessage('Invalid phone number format'),
  body('role').optional().isIn(['admin', 'recruiter', 'candidate']).withMessage('Invalid role'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
];

const createUserValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('password').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  body('password').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
  body('password').matches(/\d/).withMessage('Password must contain at least one number'),
  body('password').matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  body('role').isIn(['admin', 'recruiter']).withMessage('Role must be admin or recruiter'),
  body('first_name').isLength({ min: 2 }).trim().withMessage('First name must be at least 2 characters long'),
  body('last_name').isLength({ min: 2 }).trim().withMessage('Last name must be at least 2 characters long'),
  body('phone').optional().matches(/^[\d\s-+()]+$/).withMessage('Invalid phone number format'),
];

const usersListValidation = [
  body('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  body('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  body('role').optional().isIn(['admin', 'recruiter', 'candidate']).withMessage('Invalid role filter'),
  body('search').optional().isString().trim().withMessage('Search must be a string'),
  body('sortBy').optional().isIn(['created_at', 'updated_at', 'first_name', 'last_name', 'email']).withMessage('Invalid sort field'),
  body('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];

// Routes

// Get current user profile
router.get('/profile',
  authenticate,
  UsersController.getProfile
);

// Update current user profile
router.put('/profile',
  authenticate,
  profileUpdateValidation,
  validateRequest,
  UsersController.updateProfile
);

// Upload avatar for current user
router.post('/profile/avatar',
  authenticate,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded',
          message: 'Please upload an avatar image',
        });
        return;
      }

      // Process image with sharp
      const processedImage = await sharp(req.file.buffer)
        .resize(200, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Generate filename
      const filename = `avatar_${req.user.sub}_${Date.now()}.jpg`;
      const avatarUrl = `/uploads/avatars/${filename}`;

      // In a real implementation, you would save the file to disk or cloud storage
      // For now, we'll just update the database with the URL
      await db('users')
        .where('id', req.user.sub)
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date(),
        });

      res.json({
        success: true,
        data: {
          avatar_url: avatarUrl,
        },
        message: 'Avatar uploaded successfully',
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Avatar upload failed',
        message: 'An error occurred while uploading the avatar',
      });
    }
  }
);

// Get specific user profile (admin only)
router.get('/:id',
  authenticate,
  authorize(['admin']),
  UsersController.getProfile
);

// Update specific user profile (admin only)
router.put('/:id',
  authenticate,
  authorize(['admin']),
  profileUpdateValidation,
  validateRequest,
  UsersController.updateProfile
);

// Get all users (admin only)
router.get('/',
  authenticate,
  authorize(['admin']),
  usersListValidation,
  validateRequest,
  UsersController.getUsers
);

// Create user (admin only)
router.post('/',
  authenticate,
  authorize(['admin']),
  createUserValidation,
  validateRequest,
  UsersController.createUser
);

// Deactivate user (admin only)
router.delete('/:id/deactivate',
  authenticate,
  authorize(['admin']),
  UsersController.deactivateUser
);

// Reactivate user (admin only)
router.post('/:id/reactivate', authenticate, authorize(['admin']), UsersController.reactivateUser);

export default router;