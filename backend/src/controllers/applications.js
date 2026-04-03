import { db } from '../config/database.js';
import { ScoringEngine } from '../utils/scoringEngine.js';
import { EmailService } from '../utils/email.js';
import { AuditLogger } from '../utils/audit.js';

export const ApplicationController = {
    /**
     * Submit a new application and check for high match
     */
    async submit(req, res) {
        try {
            const { job_id, candidate_id } = req.body;

            // Check if already applied
            const existing = await db('applications')
                .where({ job_id, candidate_id })
                .first();

            if (existing) {
                return res.status(400).json({ success: false, message: 'Already applied for this job' });
            }

            // Create application
            const [application] = await db('applications').insert({
                job_id,
                candidate_id,
                status: 'applied',
                applied_at: db.fn.now(),
                created_at: db.fn.now(),
                updated_at: db.fn.now()
            }).returning('*');

            // Calculate score for notification
            const job = await db('jobs').where('id', job_id).first();
            const candidate = await db('candidates')
                .join('users', 'candidates.user_id', '=', 'users.id')
                .select('candidates.*', 'users.first_name', 'users.last_name')
                .where('candidates.id', candidate_id)
                .first();

            if (job && candidate) {
                const scoreResult = ScoringEngine.calculateScore(candidate, job);
                
                // Update score in application table
                await db('applications').where('id', application.id).update({
                    ai_score: scoreResult.finalScore
                });

                // High match notification (> 80%)
                if (scoreResult.finalScore > 80) {
                    const recruiter = await db('users').where('id', job.created_by).first();
                    if (recruiter) {
                        await EmailService.sendHighMatchNotification(recruiter.email, {
                            candidateName: `${candidate.first_name} ${candidate.last_name}`,
                            jobTitle: job.title,
                            score: scoreResult.finalScore,
                            breakdown: scoreResult.breakdown
                        });
                    }
                }
            }

            await AuditLogger.log(req.user.id, 'APPLICATION_SUBMITTED', { job_id, application_id: application.id });

            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: application
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Get applications for a job
     */
    async getByJob(req, res) {
        try {
            const { job_id } = req.params;
            const applications = await db('applications')
                .join('candidates', 'applications.candidate_id', '=', 'candidates.id')
                .join('users', 'candidates.user_id', '=', 'users.id')
                .select('applications.*', 'users.first_name', 'users.last_name', 'users.email')
                .where('applications.job_id', job_id)
                .orderBy('score', 'desc');

            res.json({ success: true, data: applications });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
