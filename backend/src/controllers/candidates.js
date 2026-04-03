import { db } from '../config/database.js';
import { ResumeParser } from '../utils/resumeParser.js';
import { ScoringEngine } from '../utils/scoringEngine.js';
import { AuditLogger } from '../utils/audit.js';
import { StorageService } from '../utils/storage.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const CandidateController = {
    /**
     * Get all candidates with pagination and filters
     */
    async getAll(req, res) {
        try {
            const { page = 1, limit = 20, location, experience_level, skill } = req.query;
            const offset = (page - 1) * limit;

            let query = db('candidates')
                .join('users', 'candidates.user_id', '=', 'users.id')
                .select(
                    'candidates.*',
                    'users.first_name',
                    'users.last_name',
                    'users.email',
                    'users.avatar_url'
                );

            if (location) query.where('candidates.location', 'ilike', `%${location}%`);
            if (experience_level) query.where('candidates.experience_level', experience_level);
            if (skill) query.whereRaw('skills @> ?', [JSON.stringify([skill])]);

            const candidates = await query.limit(limit).offset(offset).orderBy('candidates.created_at', 'desc');
            const total = await db('candidates').count('id as count').first();

            res.json({
                success: true,
                data: candidates,
                pagination: {
                    total: parseInt(total.count),
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Get candidate by ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const candidate = await db('candidates')
                .join('users', 'candidates.user_id', '=', 'users.id')
                .select('candidates.*', 'users.first_name', 'users.last_name', 'users.email', 'users.avatar_url')
                .where('candidates.id', id)
                .first();

            if (!candidate) {
                return res.status(404).json({ success: false, message: 'Candidate not found' });
            }

            res.json({ success: true, data: candidate });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Create a new candidate profile
     */
    async create(req, res) {
        try {
            const { user_id, ...candidateData } = req.body;
            const targetUserId = user_id || req.user.id;

            const [candidate] = await db('candidates').insert({
                user_id: targetUserId,
                ...candidateData,
                skills: JSON.stringify(candidateData.skills || []),
                education: JSON.stringify(candidateData.education || []),
                experience: JSON.stringify(candidateData.experience || []),
                created_at: db.fn.now(),
                updated_at: db.fn.now()
            }).returning('*');

            await AuditLogger.log(req.user.id, 'CANDIDATE_PROFILE_CREATED', { candidate_id: candidate.id });
            res.status(201).json({ success: true, data: candidate });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Update candidate profile
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body, updated_at: db.fn.now() };

            if (updateData.skills) updateData.skills = JSON.stringify(updateData.skills);
            if (updateData.education) updateData.education = JSON.stringify(updateData.education);
            if (updateData.experience) updateData.experience = JSON.stringify(updateData.experience);

            const [candidate] = await db('candidates').where('id', id).update(updateData).returning('*');
            if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });

            await AuditLogger.log(req.user.id, 'CANDIDATE_PROFILE_UPDATED', { candidate_id: id });
            res.json({ success: true, data: candidate });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Parse resume and update candidate profile
     */
    async parseResume(req, res) {
        try {
            if (!req.file) return res.status(400).json({ success: false, message: 'No resume file uploaded' });

            const candidateId = req.params.id;
            const localPath = req.file.path;
            const key = `resumes/${candidateId}/${uuidv4()}${path.extname(req.file.originalname)}`;
            
            // Parse local file first
            const parsedData = await ResumeParser.parseResume(localPath);

            // Upload to S3
            const s3Url = await StorageService.uploadFile(localPath, key, req.file.mimetype);

            const [updatedCandidate] = await db('candidates')
                .where('id', candidateId)
                .update({
                    resume_path: s3Url,
                    resume_original_name: req.file.originalname,
                    resume_mime_type: req.file.mimetype,
                    resume_size: req.file.size,
                    semantic_hash: parsedData.semanticHash,
                    skills: JSON.stringify(parsedData.skills),
                    headline: parsedData.headline,
                    location: parsedData.location,
                    years_experience: parsedData.years_experience,
                    experience: JSON.stringify(parsedData.detailedExperience || []),
                    updated_at: db.fn.now()
                })
                .returning('*');

            await AuditLogger.log(req.user.id, 'CANDIDATE_RESUME_PARSED', { candidate_id: candidateId, s3_key: key });
            res.json({ success: true, message: 'Resume uploaded to S3 and parsed successfully', data: updatedCandidate });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Calculate match score for a specific job
     */
    async getMatchScore(req, res) {
        try {
            const { id, jobId } = req.params;
            const candidate = await db('candidates').where('id', id).first();
            const job = await db('jobs').where('id', jobId).first();

            if (!candidate || !job) return res.status(404).json({ success: false, message: 'Candidate or Job not found' });

            const scoreResult = ScoringEngine.calculateScore(candidate, job);
            res.json({ success: true, data: scoreResult });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
