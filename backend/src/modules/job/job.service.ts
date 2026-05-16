import Job, { IJob } from './job.model';
import { extractSkillsFromJD } from '../../utils/skillsDictionary';
import ApiError from '../../utils/ApiError';

export const createJob = async (
    userId: string,
    jobTitle: string,
    company: string,
    jobDescription: string
): Promise<IJob> => {
    // Extract required skills from JD using dictionary matching
    const requiredSkills = extractSkillsFromJD(jobDescription);

    const job = await Job.create({
        userId,
        jobTitle,
        company,
        jobDescription,
        requiredSkills,
    });

    return job;
};

export const getUserJobs = async (userId: string): Promise<IJob[]> => {
    return Job.find({ userId }).sort({ createdAt: -1 });
};

export const getJobById = async (
    jobId: string,
    userId: string
): Promise<IJob> => {
    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) throw new ApiError(404, 'Job not found');
    return job;
};

export const deleteJob = async (
    jobId: string,
    userId: string
): Promise<void> => {
    const job = await Job.findOneAndDelete({ _id: jobId, userId });
    if (!job) throw new ApiError(404, 'Job not found');
};