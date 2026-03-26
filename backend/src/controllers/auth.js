import { db } from '../config/database.js';
import { 
    hashPassword, 
    verifyPassword, 
    generateTokens, 
    generateTwoFactorSecret,
    generateQRCode,
    verifyTwoFactorToken,
    generateEmailVerificationToken,
    generatePasswordResetToken,
    isPasswordResetTokenValid,
    validateCreateUserData
} from '../utils/auth.js';
import { auditLog } from '../utils/audit.js';
import { sendEmail } from '../utils/email.js';

class AuthController {
    // Register new user
    static async register(req, res) {
        try {
            const userData = req.body;
            // Validate input data
            const validation = validateCreateUserData(userData);
            if (!validation.isValid) {
                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    errors: validation.errors,
                });
                return;
            }

        // Check if user already exists
        const existingUser = await db('users').where('email', userData.email).first();
        if (existingUser) {
            res.status(409).json({
                success: false,
                error: 'User already exists',
                message: 'An account with this email already exists',
            });
            return;
        }

        // Hash password
        const passwordHash = await hashPassword(userData.password);

        // Generate email verification token
        const emailVerificationToken = generateEmailVerificationToken();

        // Create user
        const [user] = await db('users').insert({
            email: userData.email,
            password_hash: passwordHash,
            role: userData.role,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            email_verification_token: emailVerificationToken,
        }).returning('*');

        // Remove password hash from response
        const { password_hash, ...userWithoutPassword } = user;

        // Generate tokens
        const tokens = await generateTokens(userWithoutPassword);

        // Send verification email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Verify your SmartRecruit account',
                template: 'email-verification',
                data: {
                    firstName: user.first_name,
                    verificationLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${emailVerificationToken}`,
                },
            });
        } catch (emailError) { console.error('Failed to send verification email:', emailError) }

        // Log registration
        await auditLog({
            action: 'create',
            entity_type: 'user',
            entity_id: user.id,
            user_id: user.id,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
        });

        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword,
                tokens,
            },
            message: 'User registered successfully. Please check your email to verify your account.',
        });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: 'Registration failed',
                message: 'An error occurred during registration',
            });
        }
    }

  // Login user
    static async login(req, res) {
        try {
        const credentials = req.body;

        // Find user by email
        const user = await db('users')
            .where('email', credentials.email)
            .where('is_active', true)
            .first();

        if (!user) {
            res.status(401).json({
            success: false,
            error: 'Invalid credentials',
            message: 'Email or password is incorrect',
            });
            return;
        }

        // Verify password
        const isPasswordValid = await verifyPassword(credentials.password, user.password_hash);
        if (!isPasswordValid) {
            res.status(401).json({
            success: false,
            error: 'Invalid credentials',
            message: 'Email or password is incorrect',
            });
            return;
        }

        // Check 2FA if enabled
        if (user.two_factor_enabled) {
            if (!credentials.two_factor_code) {
            res.status(401).json({
                success: false,
                error: 'Two-factor authentication required',
                message: 'Please provide a two-factor authentication code',
                requires_2fa: true,
            });
            return;
            }

            const isValid2FA = verifyTwoFactorToken(user.two_factor_secret, credentials.two_factor_code);
            if (!isValid2FA) {
            res.status(401).json({
                success: false,
                error: 'Invalid two-factor code',
                message: 'The provided two-factor authentication code is invalid',
            });
            return;
            }
        }

        // Update last login
        await db('users')
            .where('id', user.id)
            .update({
            last_login_at: new Date(),
            last_login_ip: req.ip,
            });

        // Remove password hash from response
        const { password_hash, ...userWithoutPassword } = user;

        // Generate tokens
        const tokens = await generateTokens(userWithoutPassword);

        // Log login
        await auditLog({
            action: 'login',
            entity_type: 'user',
            entity_id: user.id,
            user_id: user.id,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
        });

        res.json({
            success: true,
            data: {
            user: userWithoutPassword,
            tokens,
            },
            message: 'Login successful',
        });
        } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed',
            message: 'An error occurred during login',
        });
        }
    }

    // Logout user
    static async logout(req, res) {
        try {
            // In a real implementation, you might want to blacklist the token
            // For now, we'll just log the logout
            if (req.user) {
                await auditLog({
                    action: 'logout',
                    entity_type: 'user',
                    entity_id: req.user.sub,
                    user_id: req.user.sub,
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent'),
                });
            }
            res.json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                error: 'Logout failed',
                message: 'An error occurred during logout',
            });
        }
    }

    // Verify email
    static async verifyEmail(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                res.status(400).json({
                    success: false,
                    error: 'Token required',
                    message: 'Email verification token is required',
                });
                return;
            }

            // Find user by verification token
            const user = await db('users')
                .where('email_verification_token', token)
                .where('is_active', true)
                .first();

            if (!user) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid token',
                    message: 'Email verification token is invalid or expired',
                });
                return;
            }

            // Update user as verified
            await db('users')
                .where('id', user.id)
                .update({
                    email_verified: true,
                    email_verified_at: new Date(),
                    email_verification_token: null,
                });

            // Log email verification
            await auditLog({
                action: 'email_verified',
                entity_type: 'user',
                entity_id: user.id,
                user_id: user.id,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                message: 'Email verified successfully',
            });
        } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Email verification failed',
            message: 'An error occurred during email verification',
        });
        }
    }

    // Setup 2FA
    static async setupTwoFactor(req, res) {
        try {
        if (!req.user) {
            res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'You must be authenticated to setup 2FA',
            });
            return;
        }

        // Get user
        const user = await db('users')
            .where('id', req.user.sub)
            .where('is_active', true)
            .first();

        if (!user) {
            res.status(404).json({
            success: false,
            error: 'User not found',
            message: 'Authenticated user not found',
            });
            return;
        }

        // Generate 2FA secret
        const { secret, qrCode } = generateTwoFactorSecret(user);

        // Generate QR code
        const qrCodeDataUrl = await generateQRCode(qrCode);

        res.json({
            success: true,
            data: {
            secret,
            qr_code: qrCodeDataUrl,
            },
            message: 'Two-factor authentication setup initiated',
        });
        } catch (error) {
        console.error('2FA setup error:', error);
        res.status(500).json({
            success: false,
            error: '2FA setup failed',
            message: 'An error occurred during 2FA setup',
        });
        }
    }

    // Enable 2FA
    static async enableTwoFactor(req, res) {
        try {
        if (!req.user) {
            res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'You must be authenticated to enable 2FA',
            });
            return;
        }

        const { secret, token } = req.body;

        if (!secret || !token) {
            res.status(400).json({
            success: false,
            error: 'Missing parameters',
            message: 'Both secret and token are required',
            });
            return;
        }

        // Verify token
        const isValid = verifyTwoFactorToken(secret, token);
        if (!isValid) {
            res.status(400).json({
            success: false,
            error: 'Invalid token',
            message: 'The provided two-factor authentication code is invalid',
            });
            return;
        }

        // Enable 2FA for user
        await db('users')
            .where('id', req.user.sub)
            .update({
            two_factor_secret: secret,
            two_factor_enabled: true,
            });

        // Log 2FA enablement
        await auditLog({
            action: '2fa_enabled',
            entity_type: 'user',
            entity_id: req.user.sub,
            user_id: req.user.sub,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
        });

        res.json({
            success: true,
            message: 'Two-factor authentication enabled successfully',
        });
        } catch (error) {
        console.error('2FA enable error:', error);
        res.status(500).json({
            success: false,
            error: '2FA enable failed',
            message: 'An error occurred while enabling 2FA',
        });
        }
    }

    // Disable 2FA
    static async disableTwoFactor(req, res) {
        try {
        if (!req.user) {
            res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'You must be authenticated to disable 2FA',
            });
            return;
        }

        const { token } = req.body;

        if (!token) {
            res.status(400).json({
            success: false,
            error: 'Token required',
            message: 'Current 2FA token is required to disable 2FA',
            });
            return;
        }

        // Get user with 2FA secret
        const user = await db('users')
            .where('id', req.user.sub)
            .where('is_active', true)
            .first();

        if (!user || !user.two_factor_enabled || !user.two_factor_secret) {
            res.status(400).json({
            success: false,
            error: '2FA not enabled',
            message: 'Two-factor authentication is not enabled for this account',
            });
            return;
        }

        // Verify current token
        const isValid = verifyTwoFactorToken(user.two_factor_secret, token);
        if (!isValid) {
            res.status(400).json({
            success: false,
            error: 'Invalid token',
            message: 'The provided two-factor authentication code is invalid',
            });
            return;
        }

        // Disable 2FA
        await db('users')
            .where('id', req.user.sub)
            .update({
            two_factor_secret: null,
            two_factor_enabled: false,
            });

        // Log 2FA disablement
        await auditLog({
            action: '2fa_disabled',
            entity_type: 'user',
            entity_id: req.user.sub,
            user_id: req.user.sub,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
        });

        res.json({
            success: true,
            message: 'Two-factor authentication disabled successfully',
        });
        } catch (error) {
        console.error('2FA disable error:', error);
        res.status(500).json({
            success: false,
            error: '2FA disable failed',
            message: 'An error occurred while disabling 2FA',
        });
        }
    }

    // Request password reset
    static async requestPasswordReset(req, res) {
        try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
            success: false,
            error: 'Email required',
            message: 'Email address is required',
            });
            return;
        }

        // Find user by email
        const user = await db('users')
            .where('email', email)
            .where('is_active', true)
            .first();

        if (!user) {
            // Don't reveal that user doesn't exist
            res.json({
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent',
            });
            return;
        }

        // Generate reset token
        const resetToken = generatePasswordResetToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update user with reset token
        await db('users')
            .where('id', user.id)
            .update({
            password_reset_token: resetToken,
            password_reset_expires: expiresAt,
            });

        // Send reset email
        try {
            await sendEmail({
            to: user.email,
            subject: 'Reset your SmartRecruit password',
            template: 'password-reset',
            data: {
                firstName: user.first_name,
                resetLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`,
            },
            });
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
        }

        // Log password reset request
        await auditLog({
            action: 'password_reset_requested',
            entity_type: 'user',
            entity_id: user.id,
            user_id: user.id,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
        });

        res.json({
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent',
        });
        } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            error: 'Password reset request failed',
            message: 'An error occurred while requesting password reset',
        });
        }
    }

    // Reset password
    static async resetPassword(req, res) {
        try {
        const { token, password } = req.body;

        if (!token || !password) {
            res.status(400).json({
            success: false,
            error: 'Missing parameters',
            message: 'Both token and new password are required',
            });
            return;
        }

        // Find user by reset token
        const user = await db('users')
            .where('password_reset_token', token)
            .where('is_active', true)
            .first();

        if (!user) {
            res.status(400).json({
            success: false,
            error: 'Invalid token',
            message: 'Password reset token is invalid',
            });
            return;
        }

        // Check if token is still valid
        if (!user.password_reset_expires || !isPasswordResetTokenValid(user.password_reset_expires)) {
            res.status(400).json({
            success: false,
            error: 'Expired token',
            message: 'Password reset token has expired',
            });
            return;
        }

        // Validate new password
        const { validatePassword } = require('../utils/auth');
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            res.status(400).json({
            success: false,
            error: 'Invalid password',
            errors: { password: passwordValidation.errors },
            });
            return;
        }

        // Hash new password
        const passwordHash = await hashPassword(password);

        // Update user password and clear reset token
        await db('users')
            .where('id', user.id)
            .update({
            password_hash: passwordHash,
            password_reset_token: null,
            password_reset_expires: null,
            });

        // Log password reset
        await auditLog({
            action: 'password_reset',
            entity_type: 'user',
            entity_id: user.id,
            user_id: user.id,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
        });

        res.json({
            success: true,
            message: 'Password reset successfully',
        });
        } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            error: 'Password reset failed',
            message: 'An error occurred while resetting password',
        });
        }
    }
}

export { AuthController };