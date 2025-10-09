import mongoose from 'mongoose'

const InterviewSchema = new mongoose.Schema(
  {
    candidateId: { type: String, required: true },
    jobId: { type: String, required: true },
    status: { type: String, required: true },
    companyId: { type: String, required: true },
    userId: { type: String, ref: 'recruiter' },
    date: { type: Date, required: true },
    interviewLevel: {
      type: String,
      enum: ['L1', 'L2', 'L3', 'L4', 'L5', 'HR'],
      default: 'L1',
    },
    approvalStatus: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true },
) // Added timestamps for createdAt and updatedAt

export default mongoose.model('Interview', InterviewSchema)
