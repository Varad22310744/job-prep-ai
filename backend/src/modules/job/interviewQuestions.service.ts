import Job from './job.model';
import Analysis from '../analysis/analysis.model';
import { generateInterviewQuestions } from '../../utils/aiService';
import ApiError from '../../utils/ApiError';

export const getOrGenerateQuestions = async (
    userId: string,
    jobId: string
): Promise<{ questions: string[]; fromCache: boolean }> => {
    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) throw new ApiError(404, 'Job not found');

    // Return cached questions if already generated
    if (job.interviewQuestions && job.interviewQuestions.length > 0) {
        return { questions: job.interviewQuestions, fromCache: true };
    }

    // Get missing skills from analysis if available
    const analysis = await Analysis.findOne({ userId, jobId });
    const missingSkills = analysis ? analysis.missingSkills : [];

    if (!job.requiredSkills || job.requiredSkills.length === 0) {
        throw new ApiError(400, 'No required skills found for this job.');
    }

    // Call Gemini
    const questions = await generateInterviewQuestions(
        job.jobTitle,
        job.requiredSkills,
        missingSkills
    );

    // Cache questions in DB
    job.interviewQuestions = questions;
    job.questionsGeneratedAt = new Date();
    await job.save();

    return { questions, fromCache: false };
};