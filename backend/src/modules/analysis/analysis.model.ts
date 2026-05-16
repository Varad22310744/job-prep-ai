import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysis extends Document {
    userId: mongoose.Types.ObjectId;
    resumeId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    matchedSkills: string[];
    missingSkills: string[];
    extraSkills: string[];
    matchScore: number;
    createdAt: Date;
    updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        matchedSkills: [{ type: String }],
        missingSkills: [{ type: String }],
        extraSkills: [{ type: String }],
        matchScore: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);
export default Analysis;