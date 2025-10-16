// File: backend/routes/batchEnrollmentRoutes.js

import express from 'express';
import BatchEnrollment from '../models/BatchEnrollment.js';
import Notification from '../models/notifications.js';

const router = express.Router();

/**
 * @route   POST /api/batch-enrollments
 * @desc    Submit a new batch/demo registration
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, selectedCourse } = req.body;
    const newEnrollment = new BatchEnrollment(req.body);
    await newEnrollment.save();
    
    // --- Notification & Real-time update logic ---
    const notification = new Notification({
        title: 'New Demo Registration',
        message: `A new registration was submitted by ${name} for the ${selectedCourse} demo.`,
        type: 'success',
        link: '/admin/batch-enrollments'
    });
    await notification.save();
    
    if (req.app.get('io')) {
        req.app.get('io').emit('newBatchEnrollment', newEnrollment);
    }
    // --- End Notification Logic ---

    res.status(201).json({ message: 'Registration successful!', enrollment: newEnrollment });
  } catch (err) {
    console.error('Error saving batch enrollment:', err);
    if (err.code === 11000) {
        return res.status(409).json({ message: 'You have already registered for this course demo with this email.' });
    }
    res.status(500).json({ message: 'Failed to submit registration due to a server error.' });
  }
});

/**
 * @route   GET /api/batch-enrollments
 * @desc    Get all batch enrollments for the admin page
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const enrollments = await BatchEnrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error('Error fetching batch enrollments:', err);
    res.status(500).json({ message: 'Server error while fetching enrollments.' });
  }
});

/**
 * @route   DELETE /api/batch-enrollments/:id
 * @desc    Delete a batch enrollment by its ID
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedEnrollment = await BatchEnrollment.findByIdAndDelete(req.params.id);
    if (!deletedEnrollment) {
        return res.status(404).json({ message: "Enrollment not found." });
    }
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    console.error("Error deleting enrollment:", err);
    res.status(500).json({ message: 'Failed to delete enrollment.' });
  }
});

export default router;