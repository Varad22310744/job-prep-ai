import Analysis from './analysis.model';
import Job from '../job/job.model';
import ApiError from '../../utils/ApiError';

interface Suggestion {
    skill: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    resources: string[];
}

interface SuggestionsResult {
    matchScore: number;
    totalMissing: number;
    suggestions: Suggestion[];
    summary: string;
}

const LEARNING_RESOURCES: Record<string, string[]> = {
    'React': ['reactjs.org/docs', 'fullstackopen.com', 'scrimba.com/react'],
    'TypeScript': ['typescriptlang.org/docs', 'totaltypescript.com'],
    'Node.js': ['nodejs.org/docs', 'nodeschool.io'],
    'Python': ['docs.python.org', 'realpython.com'],
    'MongoDB': ['mongodb.com/docs', 'mongoosejs.com/docs'],
    'Docker': ['docs.docker.com', 'docker.com/101-tutorial'],
    'AWS': ['aws.amazon.com/training', 'acloudguru.com'],
    'PostgreSQL': ['postgresql.org/docs', 'pgexercises.com'],
    'GraphQL': ['graphql.org/learn', 'apollographql.com/docs'],
    'Git': ['git-scm.com/doc', 'learngitbranching.js.org'],
};

const getResourcesForSkill = (skill: string): string[] => {
    return (
        LEARNING_RESOURCES[skill] || [
            `google.com/search?q=learn+${encodeURIComponent(skill)}`,
            `youtube.com/search?q=${encodeURIComponent(skill)}+tutorial`,
        ]
    );
};

export const generateSuggestions = async (
    userId: string,
    jobId: string
): Promise<SuggestionsResult> => {
    const analysis = await Analysis.findOne({ userId, jobId });
    if (!analysis) {
        throw new ApiError(404, 'No analysis found. Please run skill gap analysis first.');
    }

    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) throw new ApiError(404, 'Job not found');

    const suggestions: Suggestion[] = analysis.missingSkills.map((skill) => {
        // Determine priority based on how common the skill is in the JD
        const jdText = job.jobDescription.toLowerCase();
        const skillLower = skill.toLowerCase();
        const occurrences = (jdText.match(new RegExp(skillLower, 'g')) || []).length;

        let priority: 'high' | 'medium' | 'low' = 'low';
        if (occurrences >= 3) priority = 'high';
        else if (occurrences >= 2) priority = 'medium';

        return {
            skill,
            priority,
            reason: `Required for ${job.jobTitle} at ${job.company} — mentioned ${occurrences} time(s) in the job description`,
            resources: getResourcesForSkill(skill),
        };
    });

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    const summary =
        analysis.matchScore >= 70
            ? 'Strong match! Focus on the few missing skills to maximize your chances.'
            : analysis.matchScore >= 40
                ? 'Decent match. Upskilling in the missing areas will significantly improve your profile.'
                : 'Low match for this role. Consider building core skills or targeting better-matched roles.';

    return {
        matchScore: analysis.matchScore,
        totalMissing: analysis.missingSkills.length,
        suggestions,
        summary,
    };
};