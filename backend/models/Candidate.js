// File: backend/models/Candidate.js

import mongoose from 'mongoose';
import Counter from './Counter.js'; // <-- Import the new Counter model

const { Schema } = mongoose;

const CandidateSchema = new Schema(
  {
    candidateId: {
      type: String,
      unique: true,
      // The ID is no longer required in the input, as we will generate it.
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
  { timestamps: true },
);

// This Mongoose pre-save hook runs before a new document is saved.
CandidateSchema.pre('save', async function (next) {
  // Only generate an ID if the document is new
  if (this.isNew) {
    try {
      // Find the counter for 'candidateId' and atomically increment its sequence number.
      // `findOneAndUpdate` with `upsert:true` will create the counter if it doesn't exist.
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'candidateId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Format the new ID with "Z7" and zero-padding (e.g., Z700001)
      this.candidateId = 'Z7' + String(counter.seq).padStart(6, '0');
      next();
    } catch (error) {
      // If there's an error, prevent the document from saving
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model('Candidate', CandidateSchema);