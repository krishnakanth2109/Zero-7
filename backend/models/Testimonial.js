import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, default: '' }, // URL to image
  message: { type: String, required: true },
  rating: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;