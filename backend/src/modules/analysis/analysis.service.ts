import Resume from '../resume/resume.model';
import Job from '../job/job.model';
import Analysis, { IAnalysis } from './analysis.model';
import ApiError from '../../utils/ApiError';
import { normalizeSkill } from '../../utils/skillsDictionary';

export const analyzeSkillGap = async (
    userId: string,
    jobId: string
): Promise<IAnalysis> => {
    // Fetch resume and job
    const resume = await Resume.findOne({ userId });
    if (!resume) throw new ApiError(404, 'No resume found. Please upload a resume first.');

    if (!resume.extractedSkills || resume.extractedSkills.length === 0) {
        throw new ApiError(400, 'Please extract skills from your resume first.');
    }

    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) throw new ApiError(404, 'Job not found.');

    if (!job.requiredSkills || job.requiredSkills.length === 0) {
        throw new ApiError(400, 'No required skills found in this job description.');
    }

    // Normalize resume skills for comparison
    const resumeSkillsNormalized = resume.extractedSkills.map((s) =>
        normalizeSkill(s).toLowerCase()
    );

    // Normalize job skills for comparison
    const jobSkillsNormalized = job.requiredSkills.map((s) =>
        normalizeSkill(s).toLowerCase()
    );

    // Calculate matched skills
    const matchedSkills = job.requiredSkills.filter((skill) =>
        resumeSkillsNormalized.includes(normalizeSkill(skill).toLowerCase())
    );

    // Calculate missing skills
    const missingSkills = job.requiredSkills.filter(
        (skill) =>
            !resumeSkillsNormalized.includes(normalizeSkill(skill).toLowerCase())
    );

    // Calculate extra skills (in resume but not required by job)
    const extraSkills = resume.extractedSkills.filter(
        (skill) =>
            !jobSkillsNormalized.includes(normalizeSkill(skill).toLowerCase())
    );

    // Calculate match score as percentage
    const matchScore = Math.round(
        (matchedSkills.length / job.requiredSkills.length) * 100
    );

    // Update existing analysis or create new one
    const existing = await Analysis.findOne({ userId, jobId });

    if (existing) {
        existing.resumeId = resume._id as any;
        existing.matchedSkills = matchedSkills;
        existing.missingSkills = missingSkills;
        existing.extraSkills = extraSkills;
        existing.matchScore = matchScore;
        await existing.save();
        return existing;
    }

    const analysis = await Analysis.create({
        userId,
        resumeId: resume._id,
        jobId,
        matchedSkills,
        missingSkills,
        extraSkills,
        matchScore,
    });

    return analysis;
};

export const getAnalysisByJob = async (
    userId: string,
    jobId: string
): Promise<IAnalysis> => {
    const analysis = await Analysis.findOne({ userId, jobId });
    if (!analysis)
        throw new ApiError(
            404,
            'No analysis found for this job. Run analysis first.'
        );
    return analysis;
};

export const getAllAnalyses = async (userId: string): Promise<IAnalysis[]> => {
    return Analysis.find({ userId })
        .populate('jobId', 'jobTitle company')
        .sort({ createdAt: -1 });
};