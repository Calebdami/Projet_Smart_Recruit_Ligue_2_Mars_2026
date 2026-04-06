import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
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
                data: applications,
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
}

export { ApplicationController };
