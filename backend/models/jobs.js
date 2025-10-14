import mongoose from 'mongoose'
const { Schema } = mongoose

const JobSchema = new Schema(
  {
    companyId: { type: String, required: true },
    role: { type: String, required: true },
    exp: { type: String, required: true },
    skills: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['active', 'in active'], default: 'active' },
  },
  { timestamps: true },
)

export default mongoose.model('Job', JobSchema)
