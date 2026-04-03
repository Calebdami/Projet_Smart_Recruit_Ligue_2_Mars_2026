import { ScoringEngine } from '../../src/utils/scoringEngine.js';

describe('ScoringEngine', () => {
    const mockJob = {
        skills_required: ['JavaScript', 'NodeJS'],
        skills_preferred: ['React', 'Docker'],
        experience_level: 'senior',
        location: 'Paris',
        remote_allowed: false,
        salary_min: 60000,
        salary_max: 80000
    };

    const mockCandidate = {
        skills: ['JavaScript', 'NodeJS', 'React'],
        experience_level: 'senior',
        location: 'Paris',
        expected_salary_min: 70000,
        expected_salary_max: 90000
    };

    test('should calculate a perfect score for a matching candidate', () => {
        const result = ScoringEngine.calculateScore(mockCandidate, mockJob);
        expect(result.finalScore).toBeGreaterThanOrEqual(90);
        expect(result.breakdown.skills.value).toBeGreaterThan(80);
        expect(result.breakdown.location.value).toBe(100);
    });

    test('should penalize for missing required skills', () => {
        const weakCandidate = { ...mockCandidate, skills: ['JavaScript'] };
        const result = ScoringEngine.calculateScore(weakCandidate, mockJob);
        expect(result.finalScore).toBeLessThan(80);
    });

    test('should handle remote work correctly', () => {
        const remoteJob = { ...mockJob, remote_allowed: true };
        const distantCandidate = { ...mockCandidate, location: 'Marseille' };
        const result = ScoringEngine.calculateScore(distantCandidate, remoteJob);
        expect(result.breakdown.location.value).toBe(100);
    });

    test('should penalize for lower experience level', () => {
        const juniorCandidate = { ...mockCandidate, experience_level: 'junior' };
        const result = ScoringEngine.calculateScore(juniorCandidate, mockJob);
        expect(result.breakdown.experience_level.value).toBeLessThan(50);
    });

    test('should handle empty skills gracefully', () => {
        const noSkillsCandidate = { ...mockCandidate, skills: [] };
        const result = ScoringEngine.calculateScore(noSkillsCandidate, mockJob);
        expect(result.breakdown.skills.value).toBe(0);
    });

    test('should handle salary matching when budget is exceeded', () => {
        const expensiveCandidate = { ...mockCandidate, expected_salary_min: 100000 };
        const result = ScoringEngine.calculateScore(expensiveCandidate, mockJob);
        expect(result.breakdown.salary.value).toBeLessThan(100);
    });

    test('should rank multiple candidates correctly', () => {
        const candidates = [
            { id: '1', ...mockCandidate, skills: ['JavaScript'] }, // Low
            { id: '2', ...mockCandidate }, // High
            { id: '3', ...mockCandidate, skills: ['JavaScript', 'NodeJS'] } // Mid
        ];
        const ranked = ScoringEngine.rankCandidates(candidates, mockJob);
        expect(ranked[0].candidate_id).toBe('2');
        expect(ranked[1].candidate_id).toBe('3');
        expect(ranked[2].candidate_id).toBe('1');
    });
});
