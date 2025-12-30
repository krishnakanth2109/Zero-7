import mongoose from 'mongoose';
const { Schema } = mongoose;

const PayrollConsultationSchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Work email is required'] },
    company: { type: String, required: [true, 'Company name is required'] },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.model('PayrollConsultation', PayrollConsultationSchema);