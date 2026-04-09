import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
import { ScoringEngine } from '../utils/scoringEngine.js';
import { NotificationService } from '../services/notifications.js';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import pdf from 'pdf-parse';
import sharp from 'sharp';

class ApplicationController {
    static KEYWORD_WEIGHTS = {
        leadership: 8,
        communication: 6,
        teamwork: 6,
        javascript: 8,
        typescript: 8,
        node: 8,
        react: 7,
        vue: 7,
        sql: 6,
        docker: 6,
        api: 5,
    };

    static extractKeywordScore(text) {
        const source = (text || '').toLowerCase();
        if (!source.trim()) return 0;
        let score = 0;
        for (const [keyword, weight] of Object.entries(this.KEYWORD_WEIGHTS)) {
            if (source.includes(keyword)) score += weight;
        }
        return Math.min(100, score);
    }

    static normalizeScore(value) {
        const n = Number(value);
        if (Number.isNaN(n)) return null;
        return Math.max(0, Math.min(100, Math.round(n * 100) / 100));
    }

    static computeFinalScore(aiScore, recruiterScore) {
        const ai = this.normalizeScore(aiScore);
        const recruiter = this.normalizeScore(recruiterScore);
        if (ai === null && recruiter === null) return null;
        if (ai === null) return recruiter;
        if (recruiter === null) return ai;
        return Math.round(((ai + recruiter) / 2) * 100) / 100;
    }

    static async logApplicationEvent({ applicationId, userId, action, details = {} }) {
        await auditLog({
            action,
            entity_type: 'application',
            entity_id: applicationId,
            user_id: userId,
            ip_address: null,
            user_agent: 'system',
            new_values: details,
        });
    }

    static async recalculateApplicationScores(applicationId) {
        const application = await db('applications').where('id', applicationId).first();
        if (!application) return null;
        const job = await db('jobs').where('id', application.job_id).first();
        const candidate = await db('candidates').where('id', application.candidate_id).first();
        const docs = await db('application_documents').where('application_id', applicationId);

        const baseAi = ScoringEngine.calculateScore(candidate || {}, job || {});
        const coverLetterScore = this.extractKeywordScore(application.cover_letter);
        const resumeSkillsText = typeof candidate?.skills === 'string'
            ? candidate.skills
            : JSON.stringify(candidate?.skills || []);
        const resumeKeywordScore = this.extractKeywordScore(resumeSkillsText);
        const docsText = docs
            .map((d) => (typeof d.scan_data === 'string' ? d.scan_data : JSON.stringify(d.scan_data || {})))
            .join(' ');
        const documentsKeywordScore = this.extractKeywordScore(docsText);

        const aiScore = this.normalizeScore(
            baseAi * 0.6 + coverLetterScore * 0.2 + resumeKeywordScore * 0.1 + documentsKeywordScore * 0.1
        );
        const finalScore = ApplicationController.computeFinalScore(aiScore, application.recruiter_score);

        const [updated] = await db('applications')
            .where('id', applicationId)
            .update({
                ai_score: aiScore,
                metadata: JSON.stringify({
                    ...(typeof application.metadata === 'string' ? JSON.parse(application.metadata || '{}') : (application.metadata || {})),
                    score_breakdown: {
                        base_ai: baseAi,
                        cover_letter_keywords: coverLetterScore,
                        resume_keywords: resumeKeywordScore,
                        documents_keywords: documentsKeywordScore,
                    },
                    final_score: finalScore,
                }),
                updated_at: db.fn.now(),
            })
            .returning('*');

        return updated;
    }

    // Apply for a job (Candidate only)
    static async apply(req, res) {
        try {
            const userId = req.user.id;
            const { job_id, cover_letter, screening_answers } = req.body;

            // 1. Check if job exists and is open
            const job = await db('jobs').where('id', job_id).first();
            if (!job || !['open', 'published'].includes(job.status)) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found or not accepting applications',
                });
            }

            // 2. Check if candidate profile exists
            let candidate = await db('candidates').where('user_id', userId).first();
            if (!candidate) {
                [candidate] = await db('candidates')
                    .insert({
                        user_id: userId,
                        created_at: db.fn.now(),
                        updated_at: db.fn.now(),
                    })
                    .returning('*');
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

            // 4. Calculate initial AI score
            const aiScore = ScoringEngine.calculateScore(candidate, job);

            // 5. Create application
            const [application] = await db('applications')
                .insert({
                    candidate_id: candidate.id,
                    job_id,
                    cover_letter,
                    screening_answers: JSON.stringify(screening_answers || {}),
                    ai_score: aiScore,
                    metadata: JSON.stringify({
                        final_score: aiScore,
                    }),
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

            // Notify recruiters/admins that a new application was received
            const recruiters = await db('users')
                .whereIn('role', ['recruiter', 'admin'])
                .where('is_active', true)
                .select('id');

            for (const recipient of recruiters) {
                await NotificationService.create({
                    userId: recipient.id,
                    type: 'application_received',
                    title: 'Nouvelle candidature reçue',
                    message: `${candidate.first_name || 'Un candidat'} a postulé à "${job.title}"`,
                    data: {
                        application_id: application.id,
                        job_id,
                        candidate_id: candidate.id,
                    },
                    priority: 'high',
                    channel: 'in_app',
                });
            }

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
            let candidate = await db('candidates').where('user_id', userId).first();
            if (!candidate) {
                [candidate] = await db('candidates')
                    .insert({
                        user_id: userId,
                        created_at: db.fn.now(),
                        updated_at: db.fn.now(),
                    })
                    .returning('*');
            }

            const applications = await db('applications')
                .join('jobs', 'applications.job_id', 'jobs.id')
                .select('applications.*', 'jobs.title as job_title', 'jobs.location as job_location', 'jobs.status as job_status')
                .where('applications.candidate_id', candidate.id)
                .orderBy('applications.applied_at', 'desc');

            const applicationIds = applications.map((app) => app.id);
            let documentCounts = {};
            if (applicationIds.length > 0) {
                const docs = await db('application_documents')
                    .whereIn('application_id', applicationIds)
                    .select('application_id')
                    .count('id as count')
                    .groupBy('application_id');
                documentCounts = docs.reduce((acc, row) => {
                    acc[row.application_id] = Number(row.count || 0);
                    return acc;
                }, {});
            }

            res.json({
                success: true,
                data: applications.map((app) => ({
                    ...app,
                    documents_count: documentCounts[app.id] || 0,
                    final_score: (() => {
                        const metadata = typeof app.metadata === 'string' ? JSON.parse(app.metadata || '{}') : (app.metadata || {});
                        return metadata.final_score ?? ApplicationController.computeFinalScore(app.ai_score, app.recruiter_score);
                    })(),
                })),
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
                .leftJoin('users as recruiter_user', 'applications.recruiter_id', 'recruiter_user.id')
                .select(
                    'applications.*',
                    'users.first_name',
                    'users.last_name',
                    'users.email',
                    'candidates.headline',
                    'candidates.location',
                    'jobs.title as job_title',
                    'recruiter_user.first_name as recruiter_first_name',
                    'recruiter_user.last_name as recruiter_last_name'
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

            if (req.user.role === 'recruiter') {
                query.where('applications.recruiter_id', req.user.id);
            } else if (recruiter_id) {
                query.where('applications.recruiter_id', recruiter_id);
            }

            query.orderBy(sort, order);

            const applications = await query;

            res.json({
                success: true,
                data: {
                    applications: applications.map((app) => {
                        const metadata = typeof app.metadata === 'string' ? JSON.parse(app.metadata || '{}') : (app.metadata || {});
                        return {
                            ...app,
                            final_score: metadata.final_score ?? ApplicationController.computeFinalScore(app.ai_score, app.recruiter_score),
                        };
                    }),
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
                    'candidates.resume_path',
                    'candidates.resume_original_name',
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
                        final_score: (() => {
                            const metadata = typeof application.metadata === 'string'
                                ? JSON.parse(application.metadata || '{}')
                                : (application.metadata || {});
                            return metadata.final_score ?? ApplicationController.computeFinalScore(application.ai_score, application.recruiter_score);
                        })(),
                        cover_letter: application.cover_letter,
                        screening_answers: typeof application.screening_answers === 'string'
                            ? JSON.parse(application.screening_answers || '{}')
                            : (application.screening_answers || {}),
                        applied_at: application.applied_at,
                        created_at: application.created_at,
                        notes: typeof application.notes === 'string'
                            ? JSON.parse(application.notes || '[]')
                            : (application.notes || []),
                        cv_url: application.resume_path,
                        cv_original_name: application.resume_original_name,
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
                        } : null,
                        documents: await ApplicationController.listDocumentsForApplication(application.id),
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
                    recruiter_id: userId,
                    updated_at: db.fn.now(),
                })
                .returning('*');
            await ApplicationController.logApplicationEvent({
                applicationId: id,
                userId,
                action: 'application_status_updated',
                details: { old_status: application.status, new_status: status, next_step },
            });

            // Notify candidate about status update
            const candidateUser = await db('candidates')
                .join('users', 'candidates.user_id', 'users.id')
                .select('users.id as user_id')
                .where('candidates.id', application.candidate_id)
                .first();

            if (candidateUser) {
                const jobInfo = await db('jobs').where('id', application.job_id).select('title').first();
                await NotificationService.create({
                    userId: candidateUser.user_id,
                    type: 'application_status',
                    title: 'Mise à jour de votre candidature',
                    message: `Votre candidature pour "${jobInfo?.title || 'ce poste'}" est maintenant "${status}"`,
                    data: {
                        application_id: id,
                        old_status: application.status,
                        new_status: status,
                        notes,
                    },
                    priority: status === 'interview' || status === 'offer' || status === 'hired' ? 'high' : 'medium',
                    channel: 'in_app',
                });
            }

            // Log activity
            await auditLog({
                action: 'update_status',
                entity_type: 'application',
                entity_id: id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: updatedApplication,
                message: `Application status updated to ${status}`,
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

            console.log('Assign recruiter request:', { id, recruiter_id, userId });

            const application = await db('applications').where('id', id).first();
            console.log('Application found:', application);

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

    // Drag & Drop status update (Recruiter/Admin only)
    static async dragDropStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;
            const userId = req.user.id;

            const application = await db('applications').where('id', id).first();
            if (!application) {
                return res.status(404).json({
                    success: false,
                    error: 'Application not found',
                });
            }

            const oldStatus = application.status;

            const [updatedApplication] = await db('applications')
                .where('id', id)
                .update({
                    status,
                    recruiter_id: userId,
                    updated_at: db.fn.now(),
                })
                .returning('*');
            await ApplicationController.logApplicationEvent({
                applicationId: id,
                userId,
                action: 'application_status_drag_drop',
                details: { old_status: oldStatus, new_status: status },
            });

            // Log activity
            await auditLog({
                action: 'drag_drop_status',
                entity_type: 'application',
                entity_id: id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                details: { old_status: oldStatus, new_status: status }
            });

            // Send notification to candidate
            const candidate = await db('candidates')
                .join('users', 'candidates.user_id', 'users.id')
                .select('users.id as user_id', 'users.first_name', 'users.last_name')
                .where('candidates.id', application.candidate_id)
                .first();

            if (candidate) {
                const statusMessages = {
                    'reviewing': `Votre candidature passe en évaluation`,
                    'interview': `Vous êtes sélectionné pour un entretien !`,
                    'offer': `Une offre vous a été proposée !`,
                    'hired': `Félicitations ! Vous êtes embauché.`,
                    'rejected': `Votre candidature n'a pas été retenue.`
                };

                const message = statusMessages[status] || `Le statut de votre candidature a changé : ${status}`;

                await NotificationService.create({
                    userId: candidate.user_id,
                    type: 'application_status',
                    title: 'Mise à jour de votre candidature',
                    message: message,
                    data: {
                        application_id: id,
                        old_status: oldStatus,
                        new_status: status,
                        job_title: (await db('jobs').where('id', application.job_id).select('title').first())?.title
                    },
                    priority: status === 'interview' || status === 'offer' || status === 'hired' ? 'high' : 'medium',
                    channel: 'in_app'
                });
            }

            res.json({
                success: true,
                data: updatedApplication,
                message: `Application moved to ${status}`,
            });
        } catch (error) {
            console.error('Drag drop status error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Bulk Drag & Drop status update (Recruiter/Admin only)
    static async bulkDragDropStatus(req, res) {
        try {
            const { application_ids, status, notes } = req.body;
            const userId = req.user.id;

            if (!Array.isArray(application_ids) || application_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Application IDs array is required',
                });
            }

            // Get applications before update for notifications
            const applications = await db('applications')
                .whereIn('id', application_ids)
                .select('id', 'candidate_id', 'job_id', 'status');

            // Update applications in bulk
            const updatedApplications = await db('applications')
                .whereIn('id', application_ids)
                .update({
                    status,
                    recruiter_id: userId,
                    updated_at: db.fn.now(),
                })
                .returning('*');

            // Log activity for each update
            for (const appId of application_ids) {
                const oldApp = applications.find(a => a.id === appId);
                await auditLog({
                    action: 'bulk_drag_drop_status',
                    entity_type: 'application',
                    entity_id: appId,
                    user_id: userId,
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent'),
                    details: { old_status: oldApp?.status, new_status: status }
                });
            }

            // Send notifications to candidates
            for (const app of applications) {
                const candidate = await db('candidates')
                    .join('users', 'candidates.user_id', 'users.id')
                    .select('users.id as user_id', 'users.first_name', 'users.last_name')
                    .where('candidates.id', app.candidate_id)
                    .first();

                if (candidate) {
                    const statusMessages = {
                        'reviewing': `Votre candidature passe en évaluation`,
                        'interview': `Vous êtes sélectionné pour un entretien !`,
                        'offer': `Une offre vous a été proposée !`,
                        'hired': `Félicitations ! Vous êtes embauché.`,
                        'rejected': `Votre candidature n'a pas été retenue.`
                    };

                    const message = statusMessages[status] || `Le statut de votre candidature a changé : ${status}`;

                    await NotificationService.create({
                        userId: candidate.user_id,
                        type: 'application_status',
                        title: 'Mise à jour de votre candidature',
                        message: message,
                        data: {
                            application_id: app.id,
                            old_status: app.status,
                            new_status: status,
                            job_title: (await db('jobs').where('id', app.job_id).select('title').first())?.title
                        },
                        priority: status === 'interview' || status === 'offer' || status === 'hired' ? 'high' : 'medium',
                        channel: 'in_app'
                    });
                }
            }

            res.json({
                success: true,
                data: { applications: updatedApplications },
                message: `${application_ids.length} applications moved to ${status}`,
            });
        } catch (error) {
            console.error('Bulk drag drop status error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    static async updateOwnApplication(req, res) {
        try {
            const { id } = req.params;
            const { cover_letter, screening_answers } = req.body;
            const candidate = await db('candidates').where('user_id', req.user.id).first();
            if (!candidate) {
                return res.status(404).json({ success: false, error: 'Candidate profile not found' });
            }

            const application = await db('applications').where({ id, candidate_id: candidate.id }).first();
            if (!application) {
                return res.status(404).json({ success: false, error: 'Application not found' });
            }

            if (!['new', 'reviewing', 'screening'].includes(application.status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Application can no longer be edited at this stage',
                });
            }

            const payload = {
                updated_at: db.fn.now(),
            };
            if (typeof cover_letter === 'string') payload.cover_letter = cover_letter;
            if (screening_answers && typeof screening_answers === 'object') {
                payload.screening_answers = JSON.stringify(screening_answers);
            }

            const [updated] = await db('applications').where('id', id).update(payload).returning('*');
            await ApplicationController.recalculateApplicationScores(id);
            const recipients = await db('users')
                .whereIn('role', ['recruiter', 'admin'])
                .where('is_active', true)
                .select('id');
            for (const recipient of recipients) {
                await NotificationService.create({
                    userId: recipient.id,
                    type: 'application_updated',
                    title: 'Candidature mise à jour',
                    message: 'Un candidat a modifié sa candidature.',
                    data: { application_id: id },
                    priority: 'medium',
                    channel: 'in_app',
                });
            }

            await auditLog({
                action: 'candidate_update_application',
                entity_type: 'application',
                entity_id: id,
                user_id: req.user.id,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({ success: true, data: updated, message: 'Application updated successfully' });
        } catch (error) {
            console.error('Update own application error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async uploadApplicationDocument(req, res) {
        try {
            const { id } = req.params;
            const file = req.file;
            const candidate = await db('candidates').where('user_id', req.user.id).first();
            if (!candidate) return res.status(404).json({ success: false, error: 'Candidate profile not found' });
            if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });

            const application = await db('applications').where({ id, candidate_id: candidate.id }).first();
            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

            const uploadDir = path.resolve(process.cwd(), 'uploads', 'application-documents');
            await fs.mkdir(uploadDir, { recursive: true });
            const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
            const filename = `${crypto.randomUUID()}${ext}`;
            const fullPath = path.join(uploadDir, filename);
            await fs.writeFile(fullPath, file.buffer);

            const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
            const publicPath = `/uploads/application-documents/${filename}`;
            const scan_data = await ApplicationController.scanDocument(file);

            const [doc] = await db('application_documents')
                .insert({
                    application_id: application.id,
                    candidate_id: candidate.id,
                    file_path: publicPath,
                    original_name: file.originalname,
                    mime_type: file.mimetype,
                    file_size: file.size,
                    file_hash: fileHash,
                    scan_data: JSON.stringify(scan_data),
                })
                .returning('*');
            await ApplicationController.recalculateApplicationScores(application.id);
            await ApplicationController.logApplicationEvent({
                applicationId: application.id,
                userId: req.user.id,
                action: 'application_document_uploaded',
                details: { document_id: doc.id, file_name: file.originalname },
            });
            const recipients = await db('users')
                .whereIn('role', ['recruiter', 'admin'])
                .where('is_active', true)
                .select('id');
            for (const recipient of recipients) {
                await NotificationService.create({
                    userId: recipient.id,
                    type: 'application_document',
                    title: 'Nouveau document candidat',
                    message: `${file.originalname} a été ajouté à une candidature.`,
                    data: { application_id: application.id, document_id: doc.id },
                    priority: 'medium',
                    channel: 'in_app',
                });
            }

            await auditLog({
                action: 'upload_application_document',
                entity_type: 'application',
                entity_id: id,
                user_id: req.user.id,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.status(201).json({
                success: true,
                data: {
                    id: doc.id,
                    file_path: doc.file_path,
                    original_name: doc.original_name,
                    mime_type: doc.mime_type,
                    file_size: doc.file_size,
                    scan_data: typeof doc.scan_data === 'string' ? JSON.parse(doc.scan_data) : (doc.scan_data || {}),
                    created_at: doc.created_at,
                },
            });
        } catch (error) {
            console.error('Upload application document error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async getApplicationDocuments(req, res) {
        try {
            const { id } = req.params;
            const application = await db('applications').where('id', id).first();
            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

            if (req.user.role === 'candidate') {
                const candidate = await db('candidates').where('user_id', req.user.id).first();
                if (!candidate || candidate.id !== application.candidate_id) {
                    return res.status(403).json({ success: false, error: 'Forbidden' });
                }
            }

            const documents = await ApplicationController.listDocumentsForApplication(id);
            res.json({ success: true, data: documents });
        } catch (error) {
            console.error('Get application documents error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async deleteApplicationDocument(req, res) {
        try {
            const { id, documentId } = req.params;
            const candidate = await db('candidates').where('user_id', req.user.id).first();
            if (!candidate) return res.status(404).json({ success: false, error: 'Candidate profile not found' });

            const application = await db('applications').where({ id, candidate_id: candidate.id }).first();
            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

            const doc = await db('application_documents').where({ id: documentId, application_id: id, candidate_id: candidate.id }).first();
            if (!doc) return res.status(404).json({ success: false, error: 'Document not found' });

            const absolute = path.resolve(process.cwd(), doc.file_path.replace(/^\//, ''));
            await fs.unlink(absolute).catch(() => {});
            await db('application_documents').where('id', documentId).del();
            await ApplicationController.recalculateApplicationScores(id);
            await ApplicationController.logApplicationEvent({
                applicationId: id,
                userId: req.user.id,
                action: 'application_document_deleted',
                details: { document_id: documentId },
            });
            const recipients = await db('users')
                .whereIn('role', ['recruiter', 'admin'])
                .where('is_active', true)
                .select('id');
            for (const recipient of recipients) {
                await NotificationService.create({
                    userId: recipient.id,
                    type: 'application_document',
                    title: 'Document candidature supprimé',
                    message: 'Un document a été retiré d’une candidature.',
                    data: { application_id: id, document_id: documentId },
                    priority: 'low',
                    channel: 'in_app',
                });
            }

            res.json({ success: true, message: 'Document deleted successfully' });
        } catch (error) {
            console.error('Delete application document error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async listDocumentsForApplication(applicationId) {
        const docs = await db('application_documents')
            .where('application_id', applicationId)
            .orderBy('created_at', 'desc');
        return docs.map((doc) => ({
            id: doc.id,
            file_path: doc.file_path,
            original_name: doc.original_name,
            mime_type: doc.mime_type,
            file_size: doc.file_size,
            scan_data: typeof doc.scan_data === 'string' ? JSON.parse(doc.scan_data) : (doc.scan_data || {}),
            created_at: doc.created_at,
        }));
    }

    static async scanDocument(file) {
        if (file.mimetype === 'application/pdf') {
            const parsed = await pdf(file.buffer);
            return {
                type: 'pdf',
                pages: parsed.numpages || 0,
                text_preview: (parsed.text || '').slice(0, 500),
                scanned_at: new Date().toISOString(),
            };
        }
        if (file.mimetype.startsWith('image/')) {
            const metadata = await sharp(file.buffer).metadata();
            return {
                type: 'image',
                format: metadata.format || null,
                width: metadata.width || null,
                height: metadata.height || null,
                scanned_at: new Date().toISOString(),
            };
        }
        return { type: 'unknown', scanned_at: new Date().toISOString() };
    }

    static async updateRecruiterScore(req, res) {
        try {
            const { id } = req.params;
            const { recruiter_score, comment } = req.body;
            const application = await db('applications').where('id', id).first();
            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

            const normalizedRecruiterScore = ApplicationController.normalizeScore(recruiter_score);
            const finalScore = ApplicationController.computeFinalScore(application.ai_score, normalizedRecruiterScore);
            const currentMetadata = typeof application.metadata === 'string'
                ? JSON.parse(application.metadata || '{}')
                : (application.metadata || {});

            const [updated] = await db('applications')
                .where('id', id)
                .update({
                    recruiter_score: normalizedRecruiterScore,
                    metadata: JSON.stringify({
                        ...currentMetadata,
                        final_score: finalScore,
                    }),
                    updated_at: db.fn.now(),
                })
                .returning('*');

            await ApplicationController.logApplicationEvent({
                applicationId: id,
                userId: req.user.id,
                action: 'application_recruiter_score_updated',
                details: {
                    old_recruiter_score: application.recruiter_score,
                    new_recruiter_score: normalizedRecruiterScore,
                    final_score: finalScore,
                    comment: comment || null,
                },
            });

            const candidateUser = await db('candidates')
                .join('users', 'candidates.user_id', 'users.id')
                .where('candidates.id', application.candidate_id)
                .select('users.id as user_id')
                .first();
            if (candidateUser) {
                await NotificationService.create({
                    userId: candidateUser.user_id,
                    type: 'application_score',
                    title: 'Votre candidature a été évaluée',
                    message: `Votre candidature a reçu une nouvelle évaluation (score final: ${finalScore ?? '-'})`,
                    data: { application_id: id, recruiter_score: normalizedRecruiterScore, final_score: finalScore },
                    priority: 'medium',
                    channel: 'in_app',
                });
            }

            res.json({
                success: true,
                data: {
                    ...updated,
                    final_score: finalScore,
                },
                message: 'Recruiter score updated successfully',
            });
        } catch (error) {
            console.error('Update recruiter score error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async addRecruiterNote(req, res) {
        try {
            const { id } = req.params;
            const { note } = req.body;
            const application = await db('applications').where('id', id).first();
            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

            const existingNotes = Array.isArray(application.notes)
                ? application.notes
                : (typeof application.notes === 'string' ? JSON.parse(application.notes || '[]') : []);
            const noteEntry = {
                id: crypto.randomUUID(),
                note,
                author_id: req.user.id,
                created_at: new Date().toISOString(),
            };
            const notes = [noteEntry, ...existingNotes];

            const [updated] = await db('applications')
                .where('id', id)
                .update({
                    notes: JSON.stringify(notes),
                    updated_at: db.fn.now(),
                })
                .returning('*');

            await ApplicationController.logApplicationEvent({
                applicationId: id,
                userId: req.user.id,
                action: 'application_note_added',
                details: { note_id: noteEntry.id },
            });

            const candidateUser = await db('candidates')
                .join('users', 'candidates.user_id', 'users.id')
                .where('candidates.id', application.candidate_id)
                .select('users.id as user_id')
                .first();
            if (candidateUser) {
                await NotificationService.create({
                    userId: candidateUser.user_id,
                    type: 'application_note',
                    title: 'Mise à jour de votre dossier',
                    message: 'Votre dossier de candidature a reçu une nouvelle mise à jour.',
                    data: { application_id: id },
                    priority: 'low',
                    channel: 'in_app',
                });
            }

            res.status(201).json({ success: true, data: updated, message: 'Note added successfully' });
        } catch (error) {
            console.error('Add recruiter note error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    static async getApplicationTimeline(req, res) {
        try {
            const { id } = req.params;
            const application = await db('applications').where('id', id).first();
            if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

            if (req.user.role === 'candidate') {
                const candidate = await db('candidates').where('user_id', req.user.id).first();
                if (!candidate || candidate.id !== application.candidate_id) {
                    return res.status(403).json({ success: false, error: 'Forbidden' });
                }
            }

            const timeline = await db('audit_trail')
                .where({ entity_type: 'application', entity_id: id })
                .orderBy('created_at', 'desc')
                .select('id', 'action', 'new_values', 'created_at', 'user_id');

            res.json({ success: true, data: timeline });
        } catch (error) {
            console.error('Get application timeline error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

export { ApplicationController };