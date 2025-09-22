import mongoose from 'mongoose';
const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: String, required: true },
    currentSalary: { type: String, required: true },
    expectedSalary: { type: String, required: true },
    location: { type: String, required: true },
    resume: { type: String, required: true }, // Path to the resume
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);