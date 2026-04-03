import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';
import { ResumeParser } from '../utils/resumeParser.js';
import path from 'path';
import fs from 'fs/promises';

class CandidateController {
    // Get candidate profile
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

            // Remove sensitive or read-only fields
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

    // Get all candidates (Recruiter only)
    static async getAllCandidates(req, res) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const offset = (page - 1) * limit;

            const query = db('candidates')
                .join('users', 'candidates.user_id', 'users.id')
                .select('candidates.*', 'users.first_name', 'users.last_name', 'users.email');

            if (search) {
                query.where(function() {
                    this.where('users.first_name', 'ilike', `%${search}%`)
                        .orWhere('users.last_name', 'ilike', `%${search}%`)
                        .orWhere('users.email', 'ilike', `%${search}%`)
                        .orWhere('candidates.headline', 'ilike', `%${search}%`)
                        .orWhere('candidates.location', 'ilike', `%${search}%`);
                });
            }

            const [countResult, candidates] = await Promise.all([
                query.clone().count('candidates.id as count').first(),
                query.limit(limit).offset(offset).orderBy('candidates.created_at', 'desc')
            ]);

            const totalCount = parseInt(countResult.count);

            res.json({
                success: true,
                data: {
                    candidates,
                    pagination: {
                        total: totalCount,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(totalCount / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get all candidates error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve candidates',
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

            // Parse CV
            const parsedData = await ResumeParser.parse(file.buffer);

            // Check if profile exists
            const existingProfile = await db('candidates').where('user_id', userId).first();

            let candidate;
            const updateData = {
                resume_path: file.path || `uploads/resumes/${file.filename}`,
                resume_original_name: file.originalname,
                resume_mime_type: file.mimetype,
                resume_size: file.size,
                semantic_hash: parsedData.semantic_hash,
                skills: JSON.stringify(parsedData.skills),
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
}

export { CandidateController };
