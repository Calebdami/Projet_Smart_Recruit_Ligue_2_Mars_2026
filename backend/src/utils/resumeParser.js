import pdf from 'pdf-parse';
import natural from 'natural';
import fs from 'fs/promises';
import crypto from 'crypto';
import mammoth from 'mammoth';
import path from 'path';

const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer();

/**
 * Resume Parser Utility
 * Extracts information from PDF and DOCX resumes using pattern matching and NLP
 */
export const ResumeParser = {
    /**
     * Parse a resume (PDF or DOCX) and extract key entities
     * @param {string} filePath - Path to the resume file
     * @returns {Promise<Object>} Extracted candidate data
     */
    async parseResume(filePath) {
        try {
            const ext = path.extname(filePath).toLowerCase();
            let text = '';

            if (ext === '.pdf') {
                const dataBuffer = await fs.readFile(filePath);
                const data = await pdf(dataBuffer);
                text = data.text;
            } else if (ext === '.docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                text = result.value;
            } else {
                throw new Error('Unsupported file format: ' + ext);
            }

            // Generate semantic hash for anti-duplication
            const semanticHash = this.generateSemanticHash(text);

            return {
                text,
                semanticHash,
                ...this.extractEntities(text)
            };
        } catch (error) {
            console.error('Error parsing resume:', error);
            throw new Error('Failed to parse resume: ' + error.message);
        }
    },

    /**
     * Generate a hash from normalized text to detect duplicates
     * @param {string} text 
     * @returns {string}
     */
    generateSemanticHash(text) {
        const normalized = text.toLowerCase().replace(/\s+/g, '').slice(0, 1000);
        return crypto.createHash('md5').update(normalized).digest('hex');
    },

    /**
     * Extract entities like email, phone, skills, etc. from text
     * @param {string} text 
     * @returns {Object}
     */
    extractEntities(text) {
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

        const emails = text.match(emailRegex) || [];
        const phones = text.match(phoneRegex) || [];

        const commonSkills = [
            'javascript', 'nodejs', 'react', 'vue', 'python', 'java', 'sql', 'mongodb', 
            'postgresql', 'docker', 'kubernetes', 'aws', 'azure', 'git', 'typescript',
            'html', 'css', 'sass', 'express', 'knex', 'redis', 'elasticsearch'
        ];

        const tokens = tokenizer.tokenize(text.toLowerCase());
        const foundSkills = commonSkills.filter(skill => tokens.includes(skill.toLowerCase()));

        // Improved years of experience extraction
        const yearsExperience = this.extractExperienceDuration(text);
        const detailedExperience = this.extractDetailedExperience(text);

        return {
            email: emails[0] || null,
            phone: phones[0] || null,
            skills: foundSkills,
            years_experience: yearsExperience,
            detailedExperience,
            headline: this.extractHeadline(text),
            location: this.extractLocation(text)
        };
    },

    /**
     * Advanced extraction of company names and durations
     * @param {string} text 
     * @returns {Array} List of experience objects
     */
    extractDetailedExperience(text) {
        const experiences = [];
        // Regex to find potential work experience blocks
        // Example: "Software Engineer at Google (2018-2021)" or "Microsoft - Developer - 3 years"
        const expPatterns = [
            /([^.\n]+)\s+(?:at|chez|@)\s+([^.\n,]+)(?:\s*\(?(\d{4})\s*-\s*(\d{4}|present|aujourd'hui)\)?)?/gi,
            /([^.\n,]+)\s*-\s*([^.\n,]+)\s*-\s*(\d+)\s*years?/gi
        ];

        for (const pattern of expPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const role = match[1].trim();
                const company = match[2].trim();
                const startYear = match[3];
                const endYear = match[4];
                
                // Avoid capturing long sentences
                if (company.length < 50 && role.length < 50) {
                    experiences.push({
                        role,
                        company,
                        duration: startYear && endYear ? `${startYear} - ${endYear}` : match[3] ? `${match[3]} years` : 'Unknown'
                    });
                }
            }
        }
        return experiences.slice(0, 5); // Limit to top 5
    },

    /**
     * Improved experience duration extraction using date ranges
     * @param {string} text 
     * @returns {number|null}
     */
    extractExperienceDuration(text) {
        // 1. Look for direct mentions like "5+ years of experience"
        const directMatch = text.match(/(\d+)\+?\s*years?\s*of\s*experience/i);
        if (directMatch) return parseInt(directMatch[1]);

        // 2. Look for date ranges like "2015 - 2020" or "Jan 2018 - Present"
        const yearRegex = /\b(19|20)\d{2}\b/g;
        const years = text.match(yearRegex);
        
        if (years && years.length >= 2) {
            const uniqueYears = [...new Set(years.map(Number))].sort((a, b) => a - b);
            const minYear = uniqueYears[0];
            const maxYear = uniqueYears[uniqueYears.length - 1];
            
            // If the latest year is old, but mentions "Present", use current year
            const hasPresent = /present|current|aujourd'hui/i.test(text);
            const currentYear = new Date().getFullYear();
            const effectiveMaxYear = hasPresent ? currentYear : maxYear;

            const duration = effectiveMaxYear - minYear;
            return duration > 0 ? duration : null;
        }

        return null;
    },

    /**
     * Attempt to extract a professional headline
     * @param {string} text 
     */
    extractHeadline(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
        return lines[0] || null;
    },

    /**
     * Attempt to extract location
     * @param {string} text 
     */
    extractLocation(text) {
        const commonCities = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'London', 'Berlin', 'New York'];
        for (const city of commonCities) {
            if (new RegExp(city, 'i').test(text)) {
                return city;
            }
        }
        return null;
    }
};
