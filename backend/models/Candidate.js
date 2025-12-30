// File: backend/models/Candidate.js

import mongoose from 'mongoose';
import Counter from './Counter.js';

const { Schema } = mongoose;

const CandidateSchema = new Schema(
  {
    candidateId: {
      type: String,
      unique: true,
    },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    role: { type: String, required: true },
    skills: { type: String, required: true },
    exp: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'placed', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate candidateId
CandidateSchema.pre('save', async function (next) {
  if (this.isNew && !this.candidateId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'candidateId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.candidateId = 'Z7' + String(counter.seq).padStart(6, '0');
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model('Candidate', CandidateSchema);