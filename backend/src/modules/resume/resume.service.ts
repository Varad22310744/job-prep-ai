import path from 'path';
import fs from 'fs';
import Resume, { IResume } from './resume.model';
import { extractTextFromFile } from '../../utils/resumeParser';
import ApiError from '../../utils/ApiError';

export const uploadAndParseResume = async (
    userId: string,
    file: Express.Multer.File
): Promise<IResume> => {
    const fileExt = path.extname(file.originalname).toLowerCase();

    // Extract text from the uploaded file
    const rawText = await extractTextFromFile(file.path, fileExt);

    if (!rawText || rawText.length < 50) {
        // Delete the uploaded file if parsing failed
        fs.unlinkSync(file.path);
        throw new ApiError(400, 'Could not extract text from resume. Please upload a readable file.');
    }

    // Check if user already has a resume — update it
    const existing = await Resume.findOne({ userId });

    if (existing) {
        // Delete old file
        if (fs.existsSync(existing.filePath)) {
            fs.unlinkSync(existing.filePath);
        }
        existing.fileName = file.originalname;
        existing.filePath = file.path;
        existing.fileType = fileExt;
        existing.rawText = rawText;
        existing.extractedSkills = [];
        await existing.save();
        return existing;
    }

    // Create new resume record
    const resume = await Resume.create({
        userId,
        fileName: file.originalname,
        filePath: file.path,
        fileType: fileExt,
        rawText,
        extractedSkills: [],
    });

    return resume;
};

export const getResumeByUserId = async (userId: string): Promise<IResume> => {
    const resume = await Resume.findOne({ userId });
    if (!resume) throw new ApiError(404, 'No resume found for this user');
    return resume;
};