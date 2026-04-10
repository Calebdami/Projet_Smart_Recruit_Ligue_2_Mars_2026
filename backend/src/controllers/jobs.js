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

            // If user is a candidate, check which jobs they have applied to
            let jobsWithApplicationStatus = jobs;
            if (req.user && req.user.role === 'candidate') {
                const candidate = await db('candidates').where('user_id', req.user.id).first();
                if (candidate) {
                    const applications = await db('applications')
                        .where('candidate_id', candidate.id)
                        .select('job_id', 'status');
                    const appliedJobIds = new Set(applications.map(a => a.job_id));
                    const applicationStatusMap = new Map(applications.map(a => [a.job_id, a.status]));

                    jobsWithApplicationStatus = jobs.map(job => ({
                        ...job,
                        has_applied: appliedJobIds.has(job.id),
                        application_status: applicationStatusMap.get(job.id) || null
                    }));
                }
            }

            res.json({
                success: true,
                data: {
                    jobs: jobsWithApplicationStatus,
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

            // If user is a candidate, check if they have applied to this job
            let jobWithApplicationStatus = job;
            if (req.user && req.user.role === 'candidate') {
                const candidate = await db('candidates').where('user_id', req.user.id).first();
                if (candidate) {
                    const application = await db('applications')
                        .where({ candidate_id: candidate.id, job_id: id })
                        .first();

                    jobWithApplicationStatus = {
                        ...job,
                        has_applied: !!application,
                        application_status: application?.status || null,
                        application_id: application?.id || null
                    };
                }
            }

            res.json({
                success: true,
                data: jobWithApplicationStatus,
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

    // Close job (Recruiter/Admin only)
    static async closeJob(req, res) {
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
                    message: 'You do not have permission to close this job',
                });
            }

            const [updatedJob] = await db('jobs')
                .where('id', id)
                .update({
                    status: 'closed',
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Log activity
            await auditLog({
                action: 'close',
                entity_type: 'job',
                entity_id: id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: updatedJob,
                message: 'Job closed successfully',
            });
        } catch (error) {
            console.error('Close job error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to close job',
            });
        }
    }
}

export { JobController };
