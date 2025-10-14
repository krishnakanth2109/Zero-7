// File: backend/models/CandidateEnrollment.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const CandidateEnrollmentSchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    contact: { type: String, required: [true, 'Contact is required'] },
    email: { type: String, required: [true, 'Email is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    role: { type: String, required: [true, 'Role is required'] },
    skills: { type: String, required: [true, 'Skills are required'] },
  },
  { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// To prevent duplicate submissions with the same email
CandidateEnrollmentSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('CandidateEnrollment', CandidateEnrollmentSchema);