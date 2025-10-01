import mongoose from 'mongoose'
const { Schema } = mongoose

const EnrollmentSchema = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.model('Enrollment', EnrollmentSchema)
