import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
import { sendEmail } from '../utils/email.js';
import { v4 as uuidv4 } from 'uuid';

class WebinarController {
    // Get all public webinars
    static async getAllWebinars(req, res) {
        try {
            const { status = 'scheduled', limit = 10, page = 1 } = req.query;
            const offset = (page - 1) * limit;

            const query = db('webinars')
                .where('is_public', true);

            if (status) {
                query.where('status', status);
            }

            const [countResult, webinars] = await Promise.all([
                query.clone().count('id as count').first(),
                query.limit(limit).offset(offset).orderBy('scheduled_at', 'asc')
            ]);

            const totalCount = parseInt(countResult.count);

            res.json({
                success: true,
                data: {
                    webinars,
                    pagination: {
                        total: totalCount,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(totalCount / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get webinars error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Get webinar by slug or ID
    static async getWebinar(req, res) {
        try {
            const { identifier } = req.params;
            const webinar = await db('webinars')
                .where('id', identifier)
                .orWhere('slug', identifier)
                .first();

            if (!webinar) {
                return res.status(404).json({
                    success: false,
                    error: 'Webinar not found',
                });
            }

            res.json({
                success: true,
                data: webinar,
            });
        } catch (error) {
            console.error('Get webinar error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Create webinar (Recruiter/Admin only)
    static async createWebinar(req, res) {
        try {
            const userId = req.user.id;
            const webinarData = req.body;

            // Generate slug if not provided
            const slug = webinarData.slug || webinarData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4);

            const [webinar] = await db('webinars')
                .insert({
                    ...webinarData,
                    slug,
                    host_id: userId,
                    created_at: db.fn.now(),
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Log activity
            await auditLog({
                action: 'create',
                entity_type: 'webinar',
                entity_id: webinar.id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.status(201).json({
                success: true,
                data: webinar,
                message: 'Webinar scheduled successfully',
            });
        } catch (error) {
            console.error('Create webinar error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Register for a webinar
    static async register(req, res) {
        try {
            const { webinar_id, email, first_name, last_name, phone } = req.body;
            const userId = req.user ? req.user.id : null;

            // 1. Check if webinar exists and is accepting registrations
            const webinar = await db('webinars').where('id', webinar_id).first();
            if (!webinar || webinar.status !== 'scheduled') {
                return res.status(404).json({
                    success: false,
                    error: 'Webinar not found or registration closed',
                });
            }

            // 2. Check for duplicate registration
            const existingReg = await db('webinar_registrations')
                .where({ webinar_id, email })
                .first();

            if (existingReg) {
                return res.status(409).json({
                    success: false,
                    error: 'Already registered',
                    message: 'You are already registered for this webinar',
                });
            }

            // 3. Create registration
            const [registration] = await db('webinar_registrations')
                .insert({
                    webinar_id,
                    user_id: userId,
                    email,
                    first_name,
                    last_name,
                    phone,
                    status: 'registered',
                    registered_at: db.fn.now(),
                })
                .returning('*');

            // 4. Update webinar registered count
            await db('webinars').where('id', webinar_id).increment('registered_count', 1);

            // 5. Send confirmation email
            try {
                await sendEmail({
                    to: email,
                    subject: `Confirmation: ${webinar.title}`,
                    template: 'webinar-confirmation',
                    data: {
                        firstName: first_name,
                        webinarTitle: webinar.title,
                        webinarDate: webinar.scheduled_at,
                        webinarLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/webinars/${webinar.slug}`,
                    }
                });
            } catch (emailError) { console.error('Failed to send webinar confirmation email:', emailError) }

            res.status(201).json({
                success: true,
                data: registration,
                message: 'Successfully registered for the webinar',
            });
        } catch (error) {
            console.error('Webinar registration error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}

export { WebinarController };
