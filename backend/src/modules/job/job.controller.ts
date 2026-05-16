import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { createJob, getUserJobs, getJobById, deleteJob } from './job.service';

export const addJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { jobTitle, company, jobDescription } = req.body;
        const job = await createJob(req.userId!, jobTitle, company, jobDescription);
        res.status(201).json({
            success: true,
            message: 'Job added successfully',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

export const getJobs = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const jobs = await getUserJobs(req.userId!);
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};

export const getJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const job = await getJobById(req.params.id, req.userId!);
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

export const removeJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await deleteJob(req.params.id, req.userId!);
        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};
import { getOrGenerateQuestions } from './interviewQuestions.service';

export const getInterviewQuestions = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await getOrGenerateQuestions(req.userId!, req.params.jobId);
        res.status(200).json({
            success: true,
            message: result.fromCache
                ? 'Questions loaded from cache'
                : 'Interview questions generated successfully',
            fromCache: result.fromCache,
            data: {
                questions: result.questions,
                count: result.questions.length,
            },
        });
    } catch (error) {
        next(error);
    }
};