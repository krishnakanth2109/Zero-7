// File: backend/models/CollegeProposal.js

import mongoose from 'mongoose';

const collegeProposalSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    proposalType: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// This line creates the model with all its functions (.find, .save, etc.)
// and exports it so other files can use it.
export default mongoose.model('CollegeProposal', collegeProposalSchema);