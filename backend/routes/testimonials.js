import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// 1. GET ALL (For Admin Dashboard - returns both active and inactive)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET ACTIVE ONLY (For Public Website / BenchList)
router.get('/public', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. POST (Create New)
router.post('/', async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. PUT (Update/Edit)
router.put('/:id', async (req, res) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE (Remove)
router.delete('/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;