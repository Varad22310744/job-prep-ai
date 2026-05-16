import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import ApiError from './ApiError';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const extractSkillsFromText = async (
    resumeText: string
): Promise<string[]> => {
    if (!env.GEMINI_API_KEY) {
        throw new ApiError(500, 'Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
You are a resume parser. Extract all technical and professional skills from the resume text below.

Rules:
- Return ONLY a valid JSON array of strings
- Each item should be a single skill (e.g. "React", "Python", "Project Management")
- Normalize skills to proper casing (e.g. "javascript" → "JavaScript")
- Remove duplicates
- Include: programming languages, frameworks, tools, soft skills, certifications
- Do NOT include job titles, company names, or education degrees
- Do NOT add any explanation or text outside the JSON array

Resume text:
"""
${resumeText}
"""

Return format example:
["JavaScript", "React", "Node.js", "MongoDB", "Problem Solving"]
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();

        // Clean response in case Gemini adds markdown code blocks
        const cleaned = response
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const skills: string[] = JSON.parse(cleaned);

        if (!Array.isArray(skills)) {
            throw new ApiError(500, 'AI returned invalid skills format');
        }

        return skills;
    } catch (error: any) {
        console.error("Gemini AI Exact Error:", error);
        if (error instanceof ApiError) throw error;

        const errorMessage = error?.message || 'Unknown network or parsing error';
        throw new ApiError(500, 'Failed to extract skills using AI: ' + errorMessage);
    }
};
export const generateInterviewQuestions = async (
    jobTitle: string,
    requiredSkills: string[],
    missingSkills: string[]
): Promise<string[]> => {
    if (!env.GEMINI_API_KEY) {
        throw new ApiError(500, 'Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
You are an expert technical interviewer. Generate interview questions for the following job.

Job Title: ${jobTitle}
Required Skills: ${requiredSkills.join(', ')}
Skills the candidate is missing: ${missingSkills.join(', ')}

Rules:
- Return ONLY a valid JSON array of strings
- Generate exactly 10 questions total
- 4 questions on required skills (general technical)
- 3 questions specifically targeting the missing skills
- 2 behavioral questions (situation based)
- 1 system design or problem solving question
- Questions should be specific, not generic
- Do NOT add numbering inside the questions
- Do NOT add any explanation outside the JSON array

Return format example:
["Explain the difference between == and === in JavaScript", "How would you optimize a slow React component?"]
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();

        const cleaned = response
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const questions: string[] = JSON.parse(cleaned);

        if (!Array.isArray(questions)) {
            throw new ApiError(500, 'AI returned invalid questions format');
        }

        return questions;
    } catch (error: any) {
        console.error("Gemini AI Exact Error:", error);
        if (error instanceof ApiError) throw error;

        const errorMessage = error?.message || 'Unknown network or parsing error';
        throw new ApiError(500, 'Failed to generate interview questions: ' + errorMessage);
    }
};