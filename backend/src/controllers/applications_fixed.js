import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
import { NotificationService } from '../services/notifications.js';
import { ScoringEngine } from '../utils/scoringEngine.js';

class ApplicationController {
    // Apply for a job (Candidate only)
    static async apply(req, res) {
        try {
            const userId = req.user.id;
            const { job_id, cover_letter, screening_answers } = req.body;

            // 1. Check if job exists and is open
            const job = await db('jobs').where('id', job_id).first();
            if (!job || job.status !== 'open') {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found or not accepting applications',
                });
            }

            // 2. Check if candidate profile exists
            const candidate = await db('candidates').where('user_id', userId).first();
            if (!candidate) {
                return res.status(400).json({
                    success: false,
                    error: 'Profile incomplete',
                    message: 'Please complete your candidate profile before applying',
                });
            }

            // 3. Check for existing application
            const existingApplication = await db('applications')
                .where({ candidate_id: candidate.id, job_id })
                .first();
            
            if (existingApplication) {
                return res.status(409).json({
                    success: false,
                    error: 'Duplicate application',
                    message: 'You have already applied for this position',
                });
            }

            // 4. Calculate AI Matching Score
            const aiScore = ScoringEngine.calculateScore(candidate, job);

            // 5. Create application
            const [application] = await db('applications')
                .insert({
                    candidate_id: candidate.id,
                    job_id,
                    cover_letter,
                    screening_answers: JSON.stringify(screening_answers || {}),
                    ai_score: aiScore,
                    status: 'new',
                    applied_at: db.fn.now(),
                    created_at: db.fn.now(),
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // 6. Update job application count
            await db('jobs').where('id', job_id).increment('applications_count', 1);

            // 7. Log activity
            await auditLog({
                action: 'apply',
                entity_type: 'application',
                entity_id: application.id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            // 8. Send notification to job creator
            await NotificationService.create({
                userId: job.created_by,
                type: 'application_received',
                title: 'Nouvelle candidature reçue',
                message: `${candidate.first_name} ${candidate.last_name} a postulé à votre offre "${job.title}"`,
                data: {
                    applicationId: application.id,
                    jobId: job_id,
                    candidateId: candidate.id,
                    aiScore,
                },
                priority: 'high',
            });

            res.status(201).json({
                success: true,
                data: application,
                message: 'Application submitted successfully',
            });
        } catch (error) {
            console.error('Apply for job error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to submit application',
            });
        }
    }

    // Get candidate's applications (Candidate only)
    static async getMyApplications(req, res) {
        try {
            const userId = req.user.id;
            const candidate = await db('candidates').where('user_id', userId).first();
            
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: 'Candidate profile not found',
                });
            }

            const applications = await db('applications')
                .join('jobs', 'applications.job_id', 'jobs.id')
                .select('applications.*', 'jobs.title as job_title', 'jobs.location as job_location', 'jobs.status as job_status')
                .where('applications.candidate_id', candidate.id)
                .orderBy('applications.applied_at', 'desc');

            res.json({
                success: true,
                data: applications,
            });
        } catch (error) {
            console.error('Get my applications error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Get filtered applications for recruiters/admins
    static async getApplications(req, res) {
        try {
            const { search, status, job_id, recruiter_id, sort = 'ai_score', order = 'desc' } = req.query;

            const query = db('applications')
                .join('candidates', 'applications.candidate_id', 'candidates.id')
                .join('users', 'candidates.user_id', 'users.id')
                .join('jobs', 'applications.job_id', 'jobs.id')
                .select(
                    'applications.*',
                    'users.first_name',
                    'users.last_name',
                    'users.email',
                    'candidates.headline',
                    'candidates.location',
                    'jobs.title as job_title'
                );

            if (search) {
                query.where(function () {
                    this.where('users.first_name', 'ilike', `%${search}%`)
                        .orWhere('users.last_name', 'ilike', `%${search}%`)
                        .orWhere('users.email', 'ilike', `%${search}%`)
                        .orWhere('jobs.title', 'ilike', `%${search}%`)
                        .orWhere('candidates.headline', 'ilike', `%${search}%`);
                });
            }

            if (status) {
                query.where('applications.status', status);
            }

            if (job_id) {
                query.where('applications.job_id', job_id);
            }

            if (recruiter_id) {
                query.where('applications.recruiter_id', recruiter_id);
            }

            query.orderBy(sort, order);

            const applications = await query;

            res.json({
                success: true,
                data: {
                    applications,
                },
            });
        } catch (error) {
            console.error('Get applications error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Get a single application by ID
    static async getApplication(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const application = await db('applications')
                .join('candidates', 'applications.candidate_id', 'candidates.id')
                .join('users as candidate_user', 'candidates.user_id', 'candidate_user.id')
                .join('jobs', 'applications.job_id', 'jobs.id')
                .leftJoin('users as recruiter_user', 'applications.recruiter_id', 'recruiter_user.id')
                .select(
                    'applications.*',
                    'candidates.id as candidate_id',
                    'candidates.skills',
                    'candidates.location',
                    'candidates.headline',
                    'candidates.experience_level',
                    'candidate_user.first_name',
                    'candidate_user.last_name',
                    'candidate_user.email',
                    'candidate_user.phone',
                    'jobs.id as job_id',
                    'jobs.title as job_title',
                    'jobs.description as job_description',
                    'jobs.location as job_location',
                    'jobs.department as job_department',
                    'recruiter_user.id as recruiter_id',
                    'recruiter_user.first_name as recruiter_first_name',
                    'recruiter_user.last_name as recruiter_last_name',
                    'recruiter_user.email as recruiter_email'
                )
                .where('applications.id', id)
                .first();

            if (!application) {
                return res.status(404).json({
                    success: false,
                    error: 'Application not found',
                });
            }

            // Check authorization: candidate can only view their own applications
            if (userRole === 'candidate') {
                const candidate = await db('candidates').where('user_id', userId).first();
                if (!candidate || candidate.id !== application.candidate_id) {
                    return res.status(403).json({
                        success: false,
                        error: 'Forbidden',
                    });
                }
            }

            res.json({
                success: true,
                data: {
                    application: {
                        id: application.id,
                        status: application.status,
                        ai_score: application.ai_score,
                        recruiter_score: application.recruiter_score,
                        cover_letter: application.cover_letter,
                        applied_at: application.applied_at,
                        created_at: application.created_at,
                        candidate: {
                            id: application.candidate_id,
                            first_name: application.first_name,
                            last_name: application.last_name,
                            email: application.email,
                            phone: application.phone,
                            headline: application.headline,
                            location: application.location,
                            experience_level: application.experience_level,
                            skills: application.skills
                        },
                        job: {
                            id: application.job_id,
                            title: application.job_title,
                            description: application.job_description,
                            location: application.job_location,
                            department: application.job_department
                        },
                        recruiter: application.recruiter_id ? {
                            id: application.recruiter_id,
                            first_name: application.recruiter_first_name,
                            last_name: application.recruiter_last_name,
                            email: application.recruiter_email
                        } : null
                    }
                },
            });
        } catch (error) {
            console.error('Get application error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Get all applications for a job (Recruiter/Admin only)
    static async getJobApplications(req, res) {
        try {
            const { jobId } = req.params;
            const { status, sort = 'ai_score', order = 'desc' } = req.query;

            const query = db('applications')
                .join('candidates', 'applications.candidate_id', 'candidates.id')
                .join('users', 'candidates.user_id', 'users.id')
                .select(
                    'applications.*',
                    'users.first_name',
                    'users.last_name',
                    'users.email',
                    'candidates.headline',
                    'candidates.location'
                )
                .where('applications.job_id', jobId);

            if (status) {
                query.where('applications.status', status);
            }

            query.orderBy(sort, order);

            const applications = await query;

            res.json({
                success: true,
                data: {
                    applications,
                },
            });
        } catch (error) {
            console.error('Get job applications error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Update application status (Recruiter/Admin only)
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, next_step, notes } = req.body;
            const userId = req.user.id;

            const application = await db('applications').where('id', id).first();
            if (!application) {
                return res.status(404).json({
                    success: false,
                    error: 'Application not found',
                });
            }

            const [updatedApplication] = await db('applications')
                .where('id', id)
                .update({
                    status,
                    next_step,
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Get candidate user for notification
            const candidate = await db('candidates')
                .join('users', 'candidates.user_id', 'users.id')
                .where('candidates.id', updatedApplication.candidate_id)
                .select('users.id as user_id', 'users.first_name', 'users.last_name')
                .first();

            // Get job details
            const job = await db('jobs').where('id', updatedApplication.job_id).first();

            // Send notification to candidate
            if (candidate && job) {
                await NotificationService.create({
                    userId: candidate.user_id,
                    type: 'application_status',
                    title: 'Statut de votre candidature mis à jour',
                    message: `Votre candidature pour "${job.title}" est maintenant "${status}"`,
                    data: {
                        applicationId: updatedApplication.id,
                        jobId: job.id,
                        oldStatus: application.status,
                        newStatus: status,
                    },
                    priority: 'medium',
                });
            }

            // Log activity
            await auditLog({
                action: 'update_status',
                entity_type: 'application',
                entity_id: application.id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                old_values: { status: application.status },
                new_values: { status },
            });

            res.json({
                success: true,
                data: { application: updatedApplication },
                message: 'Application status updated successfully',
            });
        } catch (error) {
            console.error('Update application status error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Assign recruiter to application (Admin only)
    static async assignRecruiter(req, res) {
        try {
            const { id } = req.params;
            const { recruiter_id } = req.body;
            const userId = req.user.id;

            const application = await db('applications').where('id', id).first();
            
            if (!application) {
                return res.status(404).json({
                    success: false,
                    error: 'Application not found',
                });
            }

            // If recruiter_id is null, unassign the recruiter
            let recruiterId = recruiter_id;
            if (recruiter_id) {
                // Check if recruiter exists and has recruiter role
                const recruiter = await db('users').where('id', recruiter_id).where('role', 'recruiter').first();
                if (!recruiter) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid recruiter',
                    });
                }
                recruiterId = recruiter_id;
            }

            const [updatedApplication] = await db('applications')
                .where('id', id)
                .update({
                    recruiter_id: recruiterId,
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Log activity
            await auditLog({
                action: 'assign_recruiter',
                entity_type: 'application',
                entity_id: id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                details: { recruiter_id: recruiterId }
            });

            res.json({
                success: true,
                data: { application: updatedApplication },
                message: recruiterId ? 'Recruiter assigned successfully' : 'Recruiter unassigned successfully',
            });
        } catch (error) {
            console.error('Assign recruiter error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Bulk assign recruiter to multiple applications (Admin only)
    static async bulkAssignRecruiter(req, res) {
        try {
            const { application_ids, recruiter_id } = req.body;
            const userId = req.user.id;

            if (!Array.isArray(application_ids) || application_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Application IDs array is required',
                });
            }

            // Check if recruiter exists and has recruiter role (if recruiter_id is provided)
            let recruiterId = recruiter_id;
            if (recruiter_id) {
                const recruiter = await db('users').where('id', recruiter_id).where('role', 'recruiter').first();
                if (!recruiter) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid recruiter',
                    });
                }
                recruiterId = recruiter_id;
            }

            // Update applications in bulk
            const updatedApplications = await db('applications')
                .whereIn('id', application_ids)
                .update({
                    recruiter_id: recruiterId,
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Log activity for each assignment
            for (const appId of application_ids) {
                await auditLog({
                    action: 'bulk_assign_recruiter',
                    entity_type: 'application',
                    entity_id: appId,
                    user_id: userId,
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent'),
                    details: { recruiter_id: recruiterId }
                });
            }

            res.json({
                success: true,
                data: { applications: updatedApplications },
                message: `${application_ids.length} applications ${recruiterId ? 'assigned' : 'unassigned'} successfully`,
            });
        } catch (error) {
            console.error('Bulk assign recruiter error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}

export { ApplicationController };
