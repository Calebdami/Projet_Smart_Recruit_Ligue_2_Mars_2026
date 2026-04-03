import pdf from 'pdf-parse';
import natural from 'natural';
import crypto from 'crypto';

/**
 * Resume Parser Utility
 * Extracts structured data from CV (PDF) using natural language processing
 */
class ResumeParser {
    static SKILL_KEYWORDS = [
        'javascript', 'typescript', 'node.js', 'react', 'vue', 'angular', 'python', 'java', 'c++',
        'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'devops',
        'machine learning', 'ai', 'data science', 'sql', 'nosql', 'php', 'laravel', 'symfony',
        'ruby', 'rails', 'go', 'rust', 'swift', 'kotlin', 'flutter', 'react native', 'express',
        'nest.js', 'graphql', 'rest api', 'tailwind', 'bootstrap', 'sass', 'git', 'ci/cd'
    ];

    /**
     * Parse PDF buffer and extract information
     * @param {Buffer} buffer - PDF file buffer
     * @returns {Promise<Object>} Extracted data
     */
    static async parse(buffer) {
        try {
            const data = await pdf(buffer);
            const text = data.text;
            
            // Generate semantic hash for anti-duplicate
            const semanticHash = crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');

            const extractedData = {
                text: text,
                semantic_hash: semanticHash,
                email: this.extractEmail(text),
                phone: this.extractPhone(text),
                skills: this.extractSkills(text),
                languages: this.extractLanguages(text),
                experience_years: this.estimateExperience(text)
            };

            return extractedData;
        } catch (error) {
            console.error('Error parsing resume PDF:', error);
            throw new Error('Failed to parse resume');
        }
    }

    /**
     * Extract email from text
     */
    static extractEmail(text) {
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const matches = text.match(emailRegex);
        return matches ? matches[0] : null;
    }

    /**
     * Extract phone number from text
     */
    static extractPhone(text) {
        const phoneRegex = /(\+?\d{1,4}[\s.-]?)?\(?\d{2,5}\)?[\s.-]?\d{2,5}[\s.-]?\d{2,5}/g;
        const matches = text.match(phoneRegex);
        return matches ? matches[0].trim() : null;
    }

    /**
     * Extract skills using keyword matching and natural NLP
     */
    static extractSkills(text) {
        const lowerText = text.toLowerCase();
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(lowerText);
        
        const foundSkills = new Set();
        
        // Simple keyword matching for common tech skills
        this.SKILL_KEYWORDS.forEach(skill => {
            if (lowerText.includes(skill.toLowerCase())) {
                foundSkills.add(skill);
            }
        });

        return Array.from(foundSkills);
    }

    /**
     * Extract common languages
     */
    static extractLanguages(text) {
        const languages = ['french', 'english', 'spanish', 'german', 'chinese', 'arabic', 'français', 'anglais', 'espagnol', 'allemand'];
        const lowerText = text.toLowerCase();
        return languages.filter(lang => lowerText.includes(lang));
    }

    /**
     * Estimate years of experience based on date mentions
     * (Basic implementation)
     */
    static estimateExperience(text) {
        const yearRegex = /20\d{2}/g;
        const years = text.match(yearRegex);
        if (!years || years.length < 2) return 0;
        
        const uniqueYears = [...new Set(years.map(Number))].sort();
        const minYear = uniqueYears[0];
        const maxYear = uniqueYears[uniqueYears.length - 1];
        
        const diff = maxYear - minYear;
        return diff > 0 ? diff : 0;
    }
}

export { ResumeParser };
