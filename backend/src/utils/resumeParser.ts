import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

import mammoth from 'mammoth';
import ApiError from './ApiError';

export const extractTextFromFile = async (
    filePath: string,
    fileType: string
): Promise<string> => {
    const ext = path.extname(fileType).toLowerCase() || fileType.toLowerCase();

    try {
        if (ext === '.pdf' || ext === 'pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            // Initialize the parser with your buffer
            const parser = new PDFParse({ data: dataBuffer });

            // Extract the text
            const result = await parser.getText();
            const text = result.text; // Here is your extracted text!

            // Always destroy the parser when finished to free up memory
            await parser.destroy();

            return text.trim();
        }

        if (ext === '.docx' || ext === 'docx' || ext === '.doc' || ext === 'doc') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value.trim();
        }

        throw new ApiError(400, 'Unsupported file type');
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, 'Failed to parse resume file');
    }
};