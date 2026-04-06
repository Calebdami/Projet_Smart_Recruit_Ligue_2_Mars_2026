/**
 * Scoring Engine Utility
 * Calculates matching scores between candidates and jobs based on skills, experience, and other criteria.
 */
class ScoringEngine {
    /**
     * Calculate a matching score (0-100)
     * @param {Object} candidate - Candidate profile data
     * @param {Object} job - Job requirements data
     * @returns {number} Score between 0 and 100
     */
    static calculateScore(candidate, job) {
        let totalScore = 0;
        let weights = {
            requiredSkills: 50,
            preferredSkills: 20,
            experience: 20,
            location: 10
        };

        // 1. Required Skills (50%)
        const requiredSkills = job.skills_required || [];
        const candidateSkills = candidate.skills || [];
        
        if (requiredSkills.length > 0) {
            let matchedRequired = requiredSkills.filter(skill => 
                candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
            );
            totalScore += (matchedRequired.length / requiredSkills.length) * weights.requiredSkills;
        } else {
            // If no required skills specified, give full points for this section
            totalScore += weights.requiredSkills;
        }

        // 2. Preferred Skills (20%)
        const preferredSkills = job.skills_preferred || [];
        if (preferredSkills.length > 0) {
            let matchedPreferred = preferredSkills.filter(skill => 
                candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
            );
            totalScore += (matchedPreferred.length / preferredSkills.length) * weights.preferredSkills;
        } else {
            totalScore += weights.preferredSkills;
        }

        // 3. Experience Level (20%)
        if (job.experience_level && candidate.experience_level) {
            const levels = ['junior', 'mid', 'senior', 'executive'];
            const jobLevelIdx = levels.indexOf(job.experience_level.toLowerCase());
            const candidateLevelIdx = levels.indexOf(candidate.experience_level.toLowerCase());
            
            if (candidateLevelIdx >= jobLevelIdx) {
                totalScore += weights.experience;
            } else if (candidateLevelIdx === jobLevelIdx - 1) {
                totalScore += weights.experience * 0.5; // Half points for being one level below
            }
        } else {
            totalScore += weights.experience;
        }

        // 4. Location/Remote (10%)
        if (job.remote_allowed) {
            totalScore += weights.location;
        } else if (job.location && candidate.location) {
            if (job.location.toLowerCase() === candidate.location.toLowerCase()) {
                totalScore += weights.location;
            }
        } else {
            totalScore += weights.location;
        }

        return Math.round(totalScore * 100) / 100;
    }

    /**
     * Detailed analysis of the matching
     */
    static analyzeMatch(candidate, job) {
        const candidateSkills = candidate.skills || [];
        const requiredSkills = job.skills_required || [];
        
        const missingSkills = requiredSkills.filter(skill => 
            !candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
        );

        const matchedSkills = requiredSkills.filter(skill => 
            candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
        );

        return {
            score: this.calculateScore(candidate, job),
            matchedSkills,
            missingSkills,
            isStrongMatch: matchedSkills.length >= requiredSkills.length * 0.7
        };
    }
}

export { ScoringEngine };
