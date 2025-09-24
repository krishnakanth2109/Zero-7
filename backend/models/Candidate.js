import mongoose from 'mongoose';
const { Schema } = mongoose;

const CandidateSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    exp: { type: String, required: true }, // e.g., "5+ Years"
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Candidate', CandidateSchema);