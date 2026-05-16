import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    userId: mongoose.Types.ObjectId;
    jobTitle: string;
    company: string;
    jobDescription: string;
    requiredSkills: string[];
    createdAt: Date;
    updatedAt: Date;
    interviewQuestions: string[];
    questionsGeneratedAt: Date | null;
}

const jobSchema = new Schema<IJob>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        jobTitle: { type: String, required: true, trim: true },
        company: { type: String, required: true, trim: true },
        jobDescription: { type: String, required: true },
        requiredSkills: [{ type: String }],
        interviewQuestions: [{ type: String }],
        questionsGeneratedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const Job = mongoose.model<IJob>('Job', jobSchema);
export default Job;