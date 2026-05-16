import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { analyzeSkillGap, getAnalysisByJob, getAllAnalyses } from './analysis.service';

export const runAnalysis = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { jobId } = req.params;
        const analysis = await analyzeSkillGap(req.userId!, jobId);
        res.status(200).json({
            success: true,
            message: 'Skill gap analysis completed',
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};

export const getAnalysis = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const analysis = await getAnalysisByJob(req.userId!, req.params.jobId);
        res.status(200).json({ success: true, data: analysis });
    } catch (error) {
        next(error);
    }
};

export const getAllUserAnalyses = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const analyses = await getAllAnalyses(req.userId!);
        res.status(200).json({ success: true, data: analyses });
    } catch (error) {
        next(error);
    }
};
import { generateSuggestions } from './suggestions.service';

export const getSuggestions = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await generateSuggestions(req.userId!, req.params.jobId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};