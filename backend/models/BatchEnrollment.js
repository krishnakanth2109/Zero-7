// File: backend/models/BatchEnrollment.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const BatchEnrollmentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    selectedCourse: { type: String, required: true },
    programType: { type: String, required: true },
    message: { type: String, required: false }, // Message is optional
    
    // You can also store the batch details if needed
    trainer: { type: String },
    date: { type: String },
    timings: { type: String },
    duration: { type: String },
  },
  { 
    timestamps: true 
  }
);

// Prevent a user from registering for the same course twice with the same email
BatchEnrollmentSchema.index({ email: 1, selectedCourse: 1 }, { unique: true });

export default mongoose.model('BatchEnrollment', BatchEnrollmentSchema);