// File: backend/models/ContactInquiry.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const ContactInquirySchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'] },
    service: { type: String, required: [true, 'Service selection is required'] },
    message: { type: String, required: [true, 'Message is required'] },
  },
  { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('ContactInquiry', ContactInquirySchema);