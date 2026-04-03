import { db } from '../config/database.js';
import { ScoringEngine } from '../utils/scoringEngine.js';
import { AuditLogger } from '../utils/audit.js';

export const JobController = {
    /**
     * Get all jobs with filters
     */
    async getAll(req, res) {
        try {
            const { page = 1, limit = 20, status = 'open', location, experience_level } = req.query;
            const offset = (page - 1) * limit;
            let query = db('jobs').where('status', status);
            if (location) query.where('location', 'ilike', `%${location}%`);
            if (experience_level) query.where('experience_level', experience_level);
            const jobs = await query.limit(limit).offset(offset).orderBy('created_at', 'desc');
            const total = await db('jobs').where('status', status).count('id as count').first();
            res.json({ success: true, data: jobs, pagination: { total: parseInt(total.count), page: parseInt(page), limit: parseInt(limit) } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Get job by ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const job = await db('jobs').where('id', id).first();
            if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
            res.json({ success: true, data: job });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Create a new job
     */
    async create(req, res) {
        try {
            const jobData = {
                ...req.body,
                created_by: req.user.id,
                skills_required: JSON.stringify(req.body.skills_required || []),
                skills_preferred: JSON.stringify(req.body.skills_preferred || []),
                created_at: db.fn.now(),
                updated_at: db.fn.now()
            };
            const [job] = await db('jobs').insert(jobData).returning('*');
            await AuditLogger.log(req.user.id, 'JOB_CREATED', { job_id: job.id, title: job.title });
            res.status(201).json({ success: true, data: job });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Get matching candidates for a job
     */
    async getMatchingCandidates(req, res) {
        try {
            const { id } = req.params;
            const { minScore = 0, limit = 50 } = req.query;
            const job = await db('jobs').where('id', id).first();
            if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
            const candidates = await db('candidates').join('users', 'candidates.user_id', '=', 'users.id').select('candidates.*', 'users.first_name', 'users.last_name', 'users.email').where('candidates.is_active', true);
            const ranked = ScoringEngine.rankCandidates(candidates, job);
            const results = ranked.filter(r => r.finalScore >= minScore).slice(0, limit);
            const detailedResults = results.map(r => {
                const candidate = candidates.find(c => c.id === r.candidate_id);
                return { ...candidate, match_details: { score: r.finalScore, breakdown: r.breakdown } };
            });
            res.json({ success: true, data: detailedResults, count: detailedResults.length });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
