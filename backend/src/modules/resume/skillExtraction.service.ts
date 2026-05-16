import Resume, { IResume } from './resume.model';
import { extractSkillsFromText } from '../../utils/aiService';
import ApiError from '../../utils/ApiError';

export const extractAndSaveSkills = async (
    userId: string
): Promise<{ skills: string[]; fromCache: boolean }> => {
    const resume = await Resume.findOne({ userId });

    if (!resume) {
        throw new ApiError(404, 'No resume found. Please upload a resume first.');
    }

    // Return cached skills if already extracted — avoid repeat AI calls
    if (resume.extractedSkills && resume.extractedSkills.length > 0) {
        return { skills: resume.extractedSkills, fromCache: true };
    }

    if (!resume.rawText || resume.rawText.length < 50) {
        throw new ApiError(400, 'Resume text is too short to extract skills from.');
    }

    // Call Gemini API
    const skills = await extractSkillsFromText(resume.rawText);

    // Save extracted skills to DB so we never call AI again for this resume
    resume.extractedSkills = skills;
    await resume.save();

    return { skills, fromCache: false };
};