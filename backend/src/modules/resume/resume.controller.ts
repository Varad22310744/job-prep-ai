import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { uploadAndParseResume, getResumeByUserId } from './resume.service';
import { extractAndSaveSkills } from './skillExtraction.service';

export const uploadResume = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }

        const resume = await uploadAndParseResume(req.userId!, req.file);

        res.status(201).json({
            success: true,
            message: 'Resume uploaded and parsed successfully',
            data: {
                id: resume._id,
                fileName: resume.fileName,
                fileType: resume.fileType,
                textLength: resume.rawText.length,
                extractedSkills: resume.extractedSkills,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getResume = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const resume = await getResumeByUserId(req.userId!);
        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        next(error);
    }
};

export const extractSkills = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await extractAndSaveSkills(req.userId!);

        res.status(200).json({
            success: true,
            message: result.fromCache
                ? 'Skills loaded from cache'
                : 'Skills extracted successfully using AI',
            fromCache: result.fromCache,
            data: { skills: result.skills, count: result.skills.length },
        });
    } catch (error) {
        next(error);
    }
};