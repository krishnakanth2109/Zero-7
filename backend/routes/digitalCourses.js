// File: backend/routes/digitalCourses.js

import express from 'express';
import DigitalCourse from '../models/DigitalCourse.js';

const router = express.Router();

// @route   GET /api/digital-courses
router.get('/', async (req, res) => {
  try {
    const courses = await DigitalCourse.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/digital-courses
router.post('/', async (req, res) => {
  try {
    const { heading, domain, paragraph, image, rating } = req.body;

    if (!heading || !paragraph || !image || !domain) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newCourse = new DigitalCourse({
      heading,
      domain,
      paragraph,
      image,
      rating: rating || 4.5
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/digital-courses/:id
router.put('/:id', async (req, res) => {
  try {
    const { heading, domain, paragraph, image, rating } = req.body;
    
    const updatedCourse = await DigitalCourse.findByIdAndUpdate(
      req.params.id,
      { heading, domain, paragraph, image, rating },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/digital-courses/:id
router.delete('/:id', async (req, res) => {
  try {
    const course = await DigitalCourse.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;