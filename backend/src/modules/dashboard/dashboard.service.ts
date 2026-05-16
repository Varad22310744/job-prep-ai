import Resume from '../resume/resume.model';
import Job from '../job/job.model';
import Analysis from '../analysis/analysis.model';

interface DashboardData {
    user: {
        hasResume: boolean;
        skillsExtracted: boolean;
        totalSkills: number;
    };
    jobs: {
        total: number;
        analyzed: number;
    };
    analyses: {
        averageMatchScore: number;
        bestMatch: {
            jobTitle: string;
            company: string;
            matchScore: number;
            jobId: string;
        } | null;
        recentAnalyses: {
            jobTitle: string;
            company: string;
            matchScore: number;
            matchedSkills: number;
            missingSkills: number;
            jobId: string;
            analyzedAt: Date;
        }[];
    };
    topMissingSkills: {
        skill: string;
        count: number;
    }[];
}

export const getDashboardData = async (
    userId: string
): Promise<DashboardData> => {
    // Run all DB queries in parallel for speed
    const [resume, jobs, analyses] = await Promise.all([
        Resume.findOne({ userId }),
        Job.find({ userId }),
        Analysis.find({ userId })
            .populate('jobId', 'jobTitle company')
            .sort({ createdAt: -1 }),
    ]);

    // Resume stats
    const user = {
        hasResume: !!resume,
        skillsExtracted: !!(resume && resume.extractedSkills.length > 0),
        totalSkills: resume ? resume.extractedSkills.length : 0,
    };

    // Job stats
    const analyzedJobIds = analyses.map((a) => a.jobId.toString());
    const jobStats = {
        total: jobs.length,
        analyzed: analyzedJobIds.length,
    };

    // Analysis stats
    const averageMatchScore =
        analyses.length > 0
            ? Math.round(
                analyses.reduce((sum, a) => sum + a.matchScore, 0) / analyses.length
            )
            : 0;

    const bestMatch = analyses.reduce(
        (best, current) => {
            if (!best || current.matchScore > best.matchScore) {
                const job = current.jobId as any;
                return {
                    jobTitle: job.jobTitle,
                    company: job.company,
                    matchScore: current.matchScore,
                    jobId: job._id.toString(), // fix: use job._id not jobId
                };
            }
            return best;
        },
        null as DashboardData['analyses']['bestMatch']
    );

    const recentAnalyses = analyses.slice(0, 5).map((a) => {
        const job = a.jobId as any;
        return {
            jobTitle: job.jobTitle,
            company: job.company,
            matchScore: a.matchScore,
            matchedSkills: a.matchedSkills.length,
            missingSkills: a.missingSkills.length,
            jobId: job._id.toString(), // fix: same here
            analyzedAt: a.createdAt,
        };
    });

    // Count most frequent missing skills across all analyses
    const skillFrequency: Record<string, number> = {};
    analyses.forEach((a) => {
        a.missingSkills.forEach((skill) => {
            skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
        });
    });

    const topMissingSkills = Object.entries(skillFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([skill, count]) => ({ skill, count }));

    return {
        user,
        jobs: jobStats,
        analyses: {
            averageMatchScore,
            bestMatch,
            recentAnalyses,
        },
        topMissingSkills,
    };
};