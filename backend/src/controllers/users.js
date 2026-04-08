import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';

class UsersController {
    // Get user profile
    static async getProfile(req, res) {
        try {
            const userId = req.params.id || req.user.sub;

            // Check permissions - users can only view their own profile unless admin
            if (req.user.role !== 'admin' && req.user.sub !== userId) {
                res.status(403).json({
                    success: false,
                    error: 'Access denied',
                    message: 'You can only view your own profile',
                });
                return;
            }

            const user = await db('users')
                .where('id', userId)
                .where(function() {
                    this.where('is_active', true).orWhereNull('is_active')
                })
                .select(
                    'id',
                    'email',
                    'role',
                    'first_name',
                    'last_name',
                    'phone',
                    'avatar_url',
                    'email_verified',
                    'two_factor_enabled',
                    'last_login_at',
                    'preferences',
                    'created_at',
                    'updated_at'
                )
                .first();

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: 'The requested user profile was not found',
                });
                return;
            }

            // Log profile view
            await auditLog({
                action: 'view',
                entity_type: 'user',
                entity_id: user.id,
                user_id: req.user.sub,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: {
                    user: {
                        ...user,
                        preferences: typeof user.preferences === 'string' 
                            ? JSON.parse(user.preferences || '{}') 
                            : (user.preferences || {}),
                    },
                },
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Profile retrieval failed',
                message: 'An error occurred while retrieving the user profile',
            });
        }
    }

    // Update user profile
    static async updateProfile(req, res) {
        try {
            const userId = req.params.id || req.user.sub;
            const updates = req.body;

            // Check permissions - users can only update their own profile unless admin
            if (req.user.role !== 'admin' && req.user.sub !== userId) {
                res.status(403).json({
                    success: false,
                    error: 'Access denied',
                    message: 'You can only update your own profile',
                });
                return;
            }

            // Get current user data for audit
            const currentUser = await db('users')
                .where('id', userId)
                .where('is_active', true)
                .first();

            if (!currentUser) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: 'The requested user profile was not found',
                });
                return;
            }

            // Prepare update data
            const updateData = {
                updated_at: new Date(),
            };

            // Allowed fields for update
            const allowedFields = [
                'first_name',
                'last_name',
                'phone',
                'avatar_url',
                'preferences'
            ];

            // Only admins can change roles
            if (req.user.role === 'admin' && updates.role) {
                const validRoles = ['admin', 'recruiter', 'candidate'];
                if (validRoles.includes(updates.role)) {
                    updateData.role = updates.role;
                }
            }

            // Add allowed fields
            allowedFields.forEach(field => {
                if (updates[field] !== undefined) {
                    if (field === 'preferences') {
                        updateData[field] = JSON.stringify(updates[field] || {});
                    } else {
                        updateData[field] = updates[field];
                    }
                }
            });

            // Update user
            const [updatedUser] = await db('users')
                .where('id', userId)
                .update(updateData)
                .returning([
                    'id',
                    'email',
                    'role',
                    'first_name',
                    'last_name',
                    'phone',
                    'avatar_url',
                    'email_verified',
                    'two_factor_enabled',
                    'last_login_at',
                    'preferences',
                    'created_at',
                    'updated_at'
                ]);

            // Log profile update
            await auditLog({
                action: 'update',
                entity_type: 'user',
                entity_id: userId,
                user_id: req.user.sub,
                old_values: {
                    first_name: currentUser.first_name,
                    last_name: currentUser.last_name,
                    phone: currentUser.phone,
                    avatar_url: currentUser.avatar_url,
                    preferences: currentUser.preferences,
                    role: currentUser.role,
                },
                new_values: updateData,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: {
                    user: {
                        ...updatedUser,
                        preferences: typeof updatedUser.preferences === 'string'
                            ? JSON.parse(updatedUser.preferences || '{}')
                            : (updatedUser.preferences || {}),
                    },
                },
                message: 'Profile updated successfully',
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Profile update failed',
                message: 'An error occurred while updating the user profile',
            });
        }
    }

    // Get all users (admin only)
    static async getUsers(req, res) {
        try {
            const { page = 1, limit = 10, role, search, is_active, sortBy = 'created_at', sortOrder = 'desc' } = req.query;

            let query = db('users')
                .select(
                    'id',
                    'email',
                    'role',
                    'first_name',
                    'last_name',
                    'phone',
                    'avatar_url',
                    'email_verified',
                    'two_factor_enabled',
                    'is_active',
                    'last_login_at',
                    'created_at',
                    'updated_at'
                );

            // Apply is_active filter only if specified
            if (is_active !== undefined && is_active !== '') {
                const active = is_active === 'true' || is_active === true;
                query = query.where('is_active', active);
            }

            // Apply filters
            if (role) {
                query = query.where('role', role);
            }

            if (search) {
                query = query.where(function() {
                    this.where('first_name', 'ilike', `%${search}%`)
                        .orWhere('last_name', 'ilike', `%${search}%`)
                        .orWhere('email', 'ilike', `%${search}%`);
                });
            }

            // Apply sorting
            const validSortFields = ['created_at', 'updated_at', 'first_name', 'last_name', 'email'];
            const validSortOrders = ['asc', 'desc'];

            if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
                query = query.orderBy(sortBy, sortOrder);
            }

            // Apply pagination
            const offset = (page - 1) * limit;
            query = query.limit(limit).offset(offset);

            const users = await query;

            // Get total count for pagination
            let countQuery = db('users');
            
            // Apply is_active filter to count only if specified
            if (is_active !== undefined && is_active !== '') {
                const active = is_active === 'true' || is_active === true;
                countQuery = countQuery.where('is_active', active);
            }
            
            if (role) countQuery = countQuery.where('role', role);
            if (search) {
                countQuery = countQuery.where(function() {
                    this.where('first_name', 'ilike', `%${search}%`)
                        .orWhere('last_name', 'ilike', `%${search}%`)
                        .orWhere('email', 'ilike', `%${search}%`);
                });
            }
            const totalCount = await countQuery.count('id as count').first();

            // Log users list access
            const isUUID = (str) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
            await auditLog({
                action: 'list',
                entity_type: 'user',
                entity_id: isUUID(req.params.id) ? req.params.id : null,
                user_id: req.user.sub,
                metadata: { filters: req.query },
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: {
                    users,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: parseInt(totalCount.count),
                        pages: Math.ceil(totalCount.count / limit),
                    },
                },
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                error: 'Users retrieval failed',
                message: 'An error occurred while retrieving users',
            });
        }
    }

    // Deactivate user (admin only)
    static async deactivateUser(req, res) {
        try {
            const { id } = req.params;

            // Get current user data for audit
            const user = await db('users')
                .where('id', id)
                .first();

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: 'The requested user was not found',
                });
                return;
            }

            if (!user.is_active) {
                res.status(400).json({
                    success: false,
                    error: 'User already deactivated',
                    message: 'The user is already deactivated',
                });
                return;
            }

            // Deactivate user
            await db('users')
                .where('id', id)
                .update({
                    is_active: false,
                    updated_at: new Date(),
                });

            // Log deactivation
            await auditLog({
                action: 'deactivate',
                entity_type: 'user',
                entity_id: id,
                user_id: req.user.sub,
                old_values: { is_active: true },
                new_values: { is_active: false },
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                message: 'User deactivated successfully',
            });
        } catch (error) {
            console.error('Deactivate user error:', error);
            res.status(500).json({
                success: false,
                error: 'User deactivation failed',
                message: 'An error occurred while deactivating the user',
            });
        }
    }

    // Reactivate user (admin only)
    static async reactivateUser(req, res) {
        try {
            const { id } = req.params;

            // Get current user data for audit
            const user = await db('users')
                .where('id', id)
                .first();

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: 'The requested user was not found',
                });
                return;
            }

            if (user.is_active) {
                res.status(400).json({
                    success: false,
                    error: 'User already active',
                    message: 'The user is already active',
                });
                return;
            }

            // Reactivate user
            await db('users')
                .where('id', id)
                .update({
                    is_active: true,
                    updated_at: new Date(),
                });

            // Log reactivation
            await auditLog({
                action: 'reactivate',
                entity_type: 'user',
                entity_id: id,
                user_id: req.user.sub,
                old_values: { is_active: false },
                new_values: { is_active: true },
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                message: 'User reactivated successfully',
            });
        } catch (error) {
            console.error('Reactivate user error:', error);
            res.status(500).json({
                success: false,
                error: 'User reactivation failed',
                message: 'An error occurred while reactivating the user',
            });
        }
    }
}

export { UsersController };