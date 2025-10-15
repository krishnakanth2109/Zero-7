// File: backend/models/Offer.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const OfferSchema = new Schema(
  {
    heading: { type: String, required: true, default: 'Check Out Our Latest Offer!' },
    paragraph: { type: String, required: true, default: 'We are providing exclusive deals and opportunities. Contact us now to learn more.' },
    imageUrl: { type: String, required: true, default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470' },
    // --- ADDED: This field will control the offer's visibility ---
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Offer', OfferSchema);