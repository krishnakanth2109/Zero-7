import mongoose from 'mongoose'

const InterviewSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  jobId: { type: String, required: true },
  status: { type: String, required: true },
  companyId: { type: String, required: true },
  userId: { type: String, ref: 'recruiter' },
  date: { type: Date, required: true },
})

export default mongoose.model('Interview', InterviewSchema)
