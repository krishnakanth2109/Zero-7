// File: backend/routes/candidateEnrollment.js

import express from 'express';
import CandidateEnrollment from '../models/CandidateEnrollment.js';
import Notification from '../models/notifications.js';

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
    
    // --- Notification & Real-time update logic ---
    const notification = new Notification({
        title: 'New Candidate Enrollment',
        message: `A new candidate, ${name}, enrolled for the ${role} role.`,
        type: 'info',
        link: '/admin/candidate-enrollment'
    });
    await notification.save();
    
    req.app.get('io').emit('newCandidateEnrollment', { message: `New enrollment from ${name}` });
    // --- End Notification Logic ---

    const newEnrollment = new CandidateEnrollment({ name, contact, email, location, role, skills });
    const savedEnrollment = await newEnrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (err) {
    console.error('Error creating candidate enrollment:', err);
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
    const enrollments = await CandidateEnrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error('Error fetching candidate enrollments:', err);
    res.status(500).json({ message: 'Server error while fetching enrollments.' });
  }
});

/**
 * @route   DELETE /api/candidate-enrollment/:id
 * @desc    Delete a candidate enrollment by its ID
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedEnrollment = await CandidateEnrollment.findByIdAndDelete(req.params.id);
    
    if (!deletedEnrollment) {
        return res.status(404).json({ message: "Enrollment not found." });
    }

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    console.error("Error deleting enrollment:", err);
    res.status(500).json({ message: 'Failed to delete enrollment' });
  }
});


export default router;