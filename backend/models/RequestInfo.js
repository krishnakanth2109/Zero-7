import mongoose from 'mongoose';
const { Schema } = mongoose;

const RequestInfoSchema = new Schema({
    candidateName: { type: String, required: true },
    companyName: { type: String, required: true },
    website: { type: String },
    contactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    requirementDetails: { type: String, required: true },
    numberOfPositions: { type: Number, required: true },
    budget: { type: String },
    notes: { type: String },
    // --- ADDED ---
    // Add status field to store the request's state
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

export default mongoose.model('RequestInfo', RequestInfoSchema);