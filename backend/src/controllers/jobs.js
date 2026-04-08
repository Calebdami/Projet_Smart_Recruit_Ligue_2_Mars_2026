import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';

class JobController {
    // Get all jobs
    static async getAllJobs(req, res) {
        try {
            const { page = 1, limit = 10, search = '', status = '' } = req.query;
            const offset = (page - 1) * limit;

            const query = db('jobs');

            if (status) {
                query.where('status', status);
            }

            if (search) {
                query.where(function() {
                    this.where('title', 'ilike', `%${search}%`)
                        .orWhere('description', 'ilike', `%${search}%`)
                        .orWhere('location', 'ilike', `%${search}%`)
                        .orWhere('department', 'ilike', `%${search}%`);
                });
            }

            const [countResult, jobs] = await Promise.all([
                query.clone().count('id as count').first(),
                query.limit(limit).offset(offset).orderBy('created_at', 'desc')
            ]);

            const totalCount = parseInt(countResult.count);

            res.json({
                success: true,
                data: {
                    jobs,
                    pagination: {
                        total: totalCount,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(totalCount / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get all jobs error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve jobs',
            });
        }
    }

    // Get job by ID
    static async getJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await db('jobs').where('id', id).first();

            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found',
                });
            }

            // Increment views count
            await db('jobs').where('id', id).increment('views_count', 1);

            res.json({
                success: true,
                data: job,
            });
        } catch (error) {
            console.error('Get job by ID error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve job',
            });
        }
    }

    // Create new job (Recruiter/Admin only)
    static async createJob(req, res) {
        try {
            const userId = req.user.id;
            const { skills, ...jobData } = req.body;

            const [job] = await db('jobs')
                .insert({
                    ...jobData,
                    skills_required: JSON.stringify(skills),
                    created_by: userId,
                    created_at: db.fn.now(),
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Log activity
            await auditLog({
                action: 'create',
                entity_type: 'job',
                entity_id: job.id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.status(201).json({
                success: true,
                data: job,
                message: 'Job created successfully',
            });
        } catch (error) {
            console.error('Create job error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to create job',
            });
        }
    }

    // Update job (Recruiter/Admin only)
    static async updateJob(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { skills, ...jobData } = req.body;

            // Check if job exists and user has permission
            const job = await db('jobs').where('id', id).first();
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found',
                });
            }

            // Simple permission check (creator or admin)
            if (job.created_by !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'You do not have permission to update this job',
                });
            }

            const [updatedJob] = await db('jobs')
                .where('id', id)
                .update({
                    ...jobData,
                    skills_required: JSON.stringify(skills),
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Log activity
            await auditLog({
                action: 'update',
                entity_type: 'job',
                entity_id: id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: updatedJob,
                message: 'Job updated successfully',
            });
        } catch (error) {
            console.error('Update job error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to update job',
            });
        }
    }

    // Delete job (Recruiter/Admin only)
    static async deleteJob(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const job = await db('jobs').where('id', id).first();
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found',
                });
            }

            if (job.created_by !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'You do not have permission to delete this job',
                });
            }

            await db('jobs').where('id', id).delete();

            // Log activity
            await auditLog({
                action: 'delete',
                entity_type: 'job',
                entity_id: id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                message: 'Job deleted successfully',
            });
        } catch (error) {
            console.error('Delete job error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to delete job',
            });
        }
    }
}

export { JobController };
