import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    filePath: string;
    fileType: string;
    rawText: string;
    extractedSkills: string[];
    createdAt: Date;
    updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fileName: { type: String, required: true },
        filePath: { type: String, required: true },
        fileType: { type: String, required: true },
        rawText: { type: String, required: true },
        extractedSkills: [{ type: String }],
    },
    { timestamps: true }
);

const Resume = mongoose.model<IResume>('Resume', resumeSchema);
export default Resume;