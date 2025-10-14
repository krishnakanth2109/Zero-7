// File: backend/routes/candidateEnrollment.js

import express from 'express';
import CandidateEnrollment from '../models/CandidateEnrollment.js';

const router = express.Router();

/**
 * @route   POST /api/candidate-enrollment
 * @desc    Create a new candidate enrollment from the public form
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, contact, email, location, role, skills } = req.body;

    // Server-side validation
    if (!name || !contact || !email || !location || !role || !skills) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newEnrollment = new CandidateEnrollment({
      name,
      contact,
      email,
      location,
      role,
      skills,
    });

    const savedEnrollment = await newEnrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (err) {
    console.error('Error creating candidate enrollment:', err);
    // Handle duplicate email error
    if (err.code === 11000) {
        return res.status(409).json({ message: 'An enrollment with this email already exists.' });
    }
    res.status(500).json({ message: 'Failed to submit enrollment due to a server error.' });
  }
});

/**
 * @route   GET /api/candidate-enrollment
 * @desc    Get all candidate enrollments for the admin page
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    // Find all enrollments and sort them with the newest ones first
    const enrollments = await CandidateEnrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error('Error fetching candidate enrollments:', err);
    res.status(500).json({ message: 'Server error while fetching enrollments.' });
  }
});

export default router;