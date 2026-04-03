/**
 * Scoring Engine Utility
 * Calculates matching scores between candidates and jobs
 */
export const ScoringEngine = {
    /**
     * Calculate a matching score for a candidate against a job
     * @param {Object} candidate - Candidate object from database
     * @param {Object} job - Job object from database
     * @returns {Object} Score breakdown and final percentage
     */
    calculateScore(candidate, job) {
        let totalScore = 0;
        let maxScore = 0;
        const breakdown = {};

        // 1. Skills Matching (Weight: 50%)
        const skillsScore = this.matchSkills(candidate.skills || [], job.skills_required || [], job.skills_preferred || []);
        breakdown.skills = skillsScore;
        totalScore += skillsScore.value * 0.5;
        maxScore += 100 * 0.5;

        // 2. Experience Level Matching (Weight: 20%)
        const experienceScore = this.matchExperienceLevel(candidate.experience_level, job.experience_level);
        breakdown.experience_level = experienceScore;
        totalScore += experienceScore.value * 0.2;
        maxScore += 100 * 0.2;

        // 3. Location/Remote Matching (Weight: 15%)
        const locationScore = this.matchLocation(candidate.location, job.location, job.remote_allowed);
        breakdown.location = locationScore;
        totalScore += locationScore.value * 0.15;
        maxScore += 100 * 0.15;

        // 4. Salary Expectations (Weight: 15%)
        const salaryScore = this.matchSalary(candidate.expected_salary_min, candidate.expected_salary_max, job.salary_min, job.salary_max);
        breakdown.salary = salaryScore;
        totalScore += salaryScore.value * 0.15;
        maxScore += 100 * 0.15;

        const finalScore = Math.round((totalScore / maxScore) * 100);

        return {
            finalScore,
            breakdown,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Compare candidate skills with job requirements
     */
    matchSkills(candidateSkills, required, preferred) {
        if (!required.length && !preferred.length) return { value: 100, message: 'No skills requirements specified' };

        const candSkillsSet = new Set(candidateSkills.map(s => (typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase())));
        
        let requiredMatched = 0;
        let preferredMatched = 0;

        required.forEach(skill => {
            if (candSkillsSet.has(skill.toLowerCase())) requiredMatched++;
        });

        preferred.forEach(skill => {
            if (candSkillsSet.has(skill.toLowerCase())) preferredMatched++;
        });

        const requiredScore = required.length ? (requiredMatched / required.length) * 100 : 100;
        const preferredScore = preferred.length ? (preferredMatched / preferred.length) * 100 : 100;

        // Required skills are more important
        const combinedScore = (requiredScore * 0.7) + (preferredScore * 0.3);

        return {
            value: Math.round(combinedScore),
            requiredMatched,
            requiredTotal: required.length,
            preferredMatched,
            preferredTotal: preferred.length
        };
    },

    /**
     * Compare experience levels
     */
    matchExperienceLevel(candLevel, jobLevel) {
        if (!jobLevel) return { value: 100, message: 'No experience level required' };
        if (!candLevel) return { value: 50, message: 'Candidate experience level unknown' };

        const levels = ['junior', 'mid', 'senior', 'executive'];
        const candIdx = levels.indexOf(candLevel.toLowerCase());
        const jobIdx = levels.indexOf(jobLevel.toLowerCase());

        if (candIdx >= jobIdx) return { value: 100, message: 'Meets or exceeds experience requirements' };
        if (candIdx === jobIdx - 1) return { value: 70, message: 'One level below requirements' };
        
        return { value: 30, message: 'Significantly below experience requirements' };
    },

    /**
     * Compare locations and remote preferences
     */
    matchLocation(candLoc, jobLoc, remoteAllowed) {
        if (remoteAllowed) return { value: 100, message: 'Remote work allowed' };
        if (!jobLoc) return { value: 100, message: 'No location specified' };
        if (!candLoc) return { value: 50, message: 'Candidate location unknown' };

        if (candLoc.toLowerCase() === jobLoc.toLowerCase()) return { value: 100, message: 'Location match' };
        
        return { value: 0, message: 'Location mismatch' };
    },

    /**
     * Compare salary expectations
     */
    matchSalary(candMin, candMax, jobMin, jobMax) {
        if (!jobMin && !jobMax) return { value: 100, message: 'No salary range specified for job' };
        if (!candMin && !candMax) return { value: 100, message: 'No salary expectations specified by candidate' };

        // If candidate min is within job range, it's a good match
        if (candMin && jobMax && candMin <= jobMax) return { value: 100, message: 'Salary expectations within budget' };
        if (candMin && jobMax && candMin > jobMax) return { value: 50, message: 'Salary expectations slightly above budget' };

        return { value: 100, message: 'Salary match' };
    },

    /**
     * Rank a list of candidates for a specific job
     * @param {Array} candidates 
     * @param {Object} job 
     */
    rankCandidates(candidates, job) {
        return candidates
            .map(candidate => ({
                candidate_id: candidate.id,
                ...this.calculateScore(candidate, job)
            }))
            .sort((a, b) => b.finalScore - a.finalScore);
    }
};
