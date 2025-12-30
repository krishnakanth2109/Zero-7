import mongoose from 'mongoose'
const { Schema } = mongoose

const EnrollmentSchema = new Schema(
  {
    // --- ADDED: To store the name of the digital course ---
    course: { type: String, required: true },
    
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    // Removed location as it's not in the form
    message: { type: String, required: false } // Added message field from the form
  },
  { timestamps: true },
)

// Index to prevent the same user from enrolling in the same course twice
EnrollmentSchema.index({ email: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', EnrollmentSchema)