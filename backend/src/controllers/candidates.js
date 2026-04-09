import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
import { ResumeParser } from '../utils/resumeParser.js';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';

class CandidateController {
    static async saveUploadedFile(file) {
        const uploadDir = path.resolve(process.cwd(), 'uploads', 'resumes');
        await fs.mkdir(uploadDir, { recursive: true });
        const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
        const filename = `${crypto.randomUUID()}${ext}`;
        const fullPath = path.join(uploadDir, filename);
        await fs.writeFile(fullPath, file.buffer);
        return {
            publicPath: `/uploads/resumes/${filename}`,
            fullPath,
        };
    }

    static async buildParsedData(file) {
        if (file.mimetype === 'application/pdf') {
            return ResumeParser.parse(file.buffer);
        }
        if (file.mimetype.startsWith('image/')) {
            const metadata = await sharp(file.buffer).metadata();
            return {
                semantic_hash: crypto.createHash('sha256').update(file.buffer).digest('hex'),
                email: null,
                phone: null,
                skills: [],
                languages: [],
                experience_years: 0,
                image_metadata: {
                    format: metadata.format || null,
                    width: metadata.width || null,
                    height: metadata.height || null,
                },
            };
        }
        return {
            semantic_hash: crypto.createHash('sha256').update(file.buffer).digest('hex'),
            email: null,
            phone: null,
            skills: [],
            languages: [],
            experience_years: 0,
        };
    }

    // Get candidate profile (Self)
    static async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const candidate = await db('candidates').where('user_id', userId).first();

            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: 'Profile not found',
                    message: 'No candidate profile exists for this user',
                });
            }

            res.json({
                success: true,
                data: candidate,
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve candidate profile',
            });
        }
    }

    // Create or update candidate profile
    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const profileData = req.body;

            // Remove sensitive or read-only fields to prevent injection
            const { id, user_id, created_at, updated_at, ...updateData } = profileData;

            // Check if profile exists
            const existingProfile = await db('candidates').where('user_id', userId).first();

            let candidate;
            if (existingProfile) {
                // Update existing profile
                [candidate] = await db('candidates')
                    .where('user_id', userId)
                    .update({
                        ...updateData,
                        updated_at: db.fn.now(),
                    })
                    .returning('*');
            } else {
                // Create new profile
                [candidate] = await db('candidates')
                    .insert({
                        ...updateData,
                        user_id: userId,
                        created_at: db.fn.now(),
                        updated_at: db.fn.now(),
                    })
                    .returning('*');
            }

            // Log activity
            await auditLog({
                action: existingProfile ? 'update' : 'create',
                entity_type: 'candidate',
                entity_id: candidate.id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: candidate,
                message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to update candidate profile',
            });
        }
    }

    // Get all candidates (Recruiter only) - FIXED GROUP BY ERROR & ADDED FILTERS
    static async getAllCandidates(req, res) {
        try {
            const { 
                page = 1, 
                limit = 20, 
                search = '', 
                job_id = '', 
                status = '', 
                smart_score_min = '' 
            } = req.query;
            
            const offset = (page - 1) * limit;
            // 1. REQUÊTE DE COMPTAGE (Pour la pagination)
            const countQuery = db('candidates').leftJoin('users', 'candidates.user_id', 'users.id');

            if (req.user.role === 'recruiter') {
                const subQuery = db('applications')
                    .whereRaw('applications.candidate_id = candidates.id')
                    .andWhere('applications.recruiter_id', req.user.id);
                countQuery.whereExists(subQuery);
            }

            if (search && search.trim()) {
                countQuery.where(function() {
                    this.where('users.first_name', 'ilike', `%${search}%`)
                        .orWhere('users.last_name', 'ilike', `%${search}%`)
                        .orWhere('users.email', 'ilike', `%${search}%`)
                        .orWhere('candidates.headline', 'ilike', `%${search}%`);
                });
            }

            if (status) countQuery.where('candidates.is_available', status === 'active');

            const countResult = await countQuery.count('candidates.id as count').first();
            const totalCount = parseInt(countResult?.count || 0);

            // 2. REQUÊTE DE DONNÉES (Sans count pour éviter l'erreur GROUP BY)
            const dataQuery = db('candidates')
                .leftJoin('users', 'candidates.user_id', 'users.id')
                .select(
                    'candidates.*', 
                    'users.first_name', 
                    'users.last_name', 
                    'users.email'
                );

            if (req.user.role === 'recruiter') {
                const subQuery = db('applications')
                    .whereRaw('applications.candidate_id = candidates.id')
                    .andWhere('applications.recruiter_id', req.user.id);
                dataQuery.whereExists(subQuery);
            }

            // Appliquer les mêmes filtres que pour le count
            if (search && search.trim()) {
                dataQuery.where(function() {
                    this.where('users.first_name', 'ilike', `%${search}%`)
                        .orWhere('users.last_name', 'ilike', `%${search}%`)
                        .orWhere('users.email', 'ilike', `%${search}%`)
                        .orWhere('candidates.headline', 'ilike', `%${search}%`);
                });
            }

            if (status) dataQuery.where('candidates.is_available', status === 'active');

            const candidates = await dataQuery
                .limit(limit)
                .offset(offset)
                .orderBy('candidates.created_at', 'desc');

            res.json({
                success: true,
                data: {
                    candidates: candidates || [],
                    pagination: {
                        total: totalCount,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(totalCount / limit) || 1
                    }
                }
            });
        } catch (error) {
            console.error('Get all candidates error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error.message || 'Failed to retrieve candidates',
            });
        }
    }

    // Get candidate by ID (Recruiter only)
    static async getCandidateById(req, res) {
        try {
            const { id } = req.params;
            const candidate = await db('candidates')
                .join('users', 'candidates.user_id', 'users.id')
                .select('candidates.*', 'users.first_name', 'users.last_name', 'users.email')
                .where('candidates.id', id)
                .first();

            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: 'Candidate not found',
                });
            }

            res.json({
                success: true,
                data: candidate,
            });
        } catch (error) {
            console.error('Get candidate by ID error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve candidate',
            });
        }
    }

    // Upload and Parse Resume
    static async uploadResume(req, res) {
        try {
            const userId = req.user.id;
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded',
                });
            }

            const parsedData = await CandidateController.buildParsedData(file);
            const { publicPath } = await CandidateController.saveUploadedFile(file);

            // Check if profile exists
            const existingProfile = await db('candidates').where('user_id', userId).first();

            let candidate;
            const updateData = {
                resume_path: publicPath,
                resume_original_name: file.originalname,
                resume_mime_type: file.mimetype,
                resume_size: file.size,
                semantic_hash: parsedData.semantic_hash,
                // PostgreSQL JSONB handling: Knex handles objects automatically if type is jsonb
                skills: typeof parsedData.skills === 'string' ? parsedData.skills : JSON.stringify(parsedData.skills),
                years_experience: parsedData.experience_years,
                updated_at: db.fn.now(),
            };

            if (existingProfile) {
                [candidate] = await db('candidates')
                    .where('user_id', userId)
                    .update(updateData)
                    .returning('*');
            } else {
                [candidate] = await db('candidates')
                    .insert({
                        ...updateData,
                        user_id: userId,
                        created_at: db.fn.now(),
                    })
                    .returning('*');
            }

            // Log activity
            await auditLog({
                action: 'upload_resume',
                entity_type: 'candidate',
                entity_id: candidate.id,
                user_id: userId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            });

            res.json({
                success: true,
                data: {
                    candidate,
                    extracted: {
                        skills: parsedData.skills,
                        experience_years: parsedData.experience_years,
                        email: parsedData.email,
                        mime_type: file.mimetype,
                    }
                },
                message: 'Resume uploaded and parsed successfully',
            });
        } catch (error) {
            console.error('Upload resume error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to upload and parse resume',
            });
        }
    }

    static async uploadResumeById(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const candidate = await db('candidates').where('user_id', userId).first();
            if (!candidate || candidate.id !== id) {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'You can only upload CV for your own profile',
                });
            }
            return CandidateController.uploadResume(req, res);
        } catch (error) {
            console.error('Upload resume by ID error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to upload resume',
            });
        }
    }

    // Get candidate CV (Recruiter only)
    static async getCandidateCV(req, res) {
        try {
            const { id } = req.params;
            if (req.user.role === 'candidate') {
                const ownCandidate = await db('candidates').where('user_id', req.user.id).first();
                if (!ownCandidate || ownCandidate.id !== id) {
                    return res.status(403).json({ success: false, error: 'Forbidden' });
                }
            }
            const candidate = await db('candidates')
                .where('id', id)
                .select('id', 'resume_path', 'resume_original_name', 'skills', 'years_experience', 'semantic_hash')
                .first();

            if (!candidate || !candidate.resume_path) {
                return res.status(404).json({
                    success: false,
                    error: 'CV not found',
                });
            }

            res.json({
                success: true,
                data: {
                    cv: {
                        url: candidate.resume_path,
                        original_name: candidate.resume_original_name,
                        parsed_data: {
                            // Safe parsing for PostgreSQL
                            skills: typeof candidate.skills === 'string' ? JSON.parse(candidate.skills) : (candidate.skills || []),
                            experience_years: candidate.years_experience,
                            semantic_hash: candidate.semantic_hash
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Get candidate CV error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve CV',
            });
        }
    }

    // Parse/Reparse candidate CV (Recruiter only)
    static async parseCV(req, res) {
        try {
            const { id } = req.params;
            if (req.user.role === 'candidate') {
                const ownCandidate = await db('candidates').where('user_id', req.user.id).first();
                if (!ownCandidate || ownCandidate.id !== id) {
                    return res.status(403).json({ success: false, error: 'Forbidden' });
                }
            }
            const candidate = await db('candidates').where('id', id).first();

            if (!candidate || !candidate.resume_path) {
                return res.status(404).json({
                    success: false,
                    error: 'CV not found',
                });
            }

            res.json({
                success: true,
                data: {
                    parsed_data: {
                        skills: typeof candidate.skills === 'string' ? JSON.parse(candidate.skills) : (candidate.skills || []),
                        experience_years: candidate.years_experience,
                        semantic_hash: candidate.semantic_hash
                    },
                    match_score: candidate.smart_score || 0
                }
            });
        } catch (error) {
            console.error('Parse CV error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to parse CV',
            });
        }
    }

    // Get candidate applications (Recruiter only)
    static async getCandidateApplications(req, res) {
        try {
            const { id } = req.params;
            const applications = await db('applications')
                .join('jobs', 'applications.job_id', 'jobs.id')
                .where('applications.candidate_id', id)
                .select(
                    'applications.id',
                    'applications.status',
                    'applications.created_at',
                    'jobs.title as job_title',
                    'jobs.id as job_id'
                )
                .orderBy('applications.created_at', 'desc');

            res.json({
                success: true,
                data: {
                    applications: applications.map(app => ({
                        id: app.id,
                        status: app.status,
                        created_at: app.created_at,
                        job: {
                            id: app.job_id,
                            title: app.job_title
                        }
                    }))
                }
            });
        } catch (error) {
            console.error('Get candidate applications error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve applications',
            });
        }
    }
}

export { CandidateController };