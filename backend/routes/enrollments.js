// File: backend/routes/enrollments.js

import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/notifications.js';

const router = express.Router();

/**
 * @route   POST /api/enrollments
 * @desc    Create a new student enrollment for a digital course
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, contact, message, course } = req.body;

    const emailCheck = await Enrollment.findOne({ email, course });
    if (emailCheck) {
      return res.status(409).json({ message: `You are already enrolled for the ${course} course.` });
    }
    
    const newEnrollment = new Enrollment({ name, email, contact, message, course });
    const savedEnrollment = await newEnrollment.save();
    
    const io = req.app.get('io');
    const notificationMessage = `New enrollment for ${course} from student: ${name}.`;
    const notification = new Notification({
        title: 'New Course Enrollment',
        message: notificationMessage,
        type: 'info',
        link: '/admin/digital-courses-enrollment'
    });
    await notification.save();
    
    io.emit('newEnrollment', { message: notificationMessage });

    res.status(201).json(savedEnrollment);
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(400).json({ message: "Failed to create enrollment.", error: err.message });
  }
});

/**
 * @route   GET /api/enrollments
 * @desc    Get all student enrollments
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    res.status(500).json({ message: "Server error while fetching enrollments." });
  }
});

/**
 * @route   DELETE /api/enrollments/:id
 * @desc    Delete a student enrollment by ID
 * @access  Admin
 * --- THIS ENTIRE BLOCK IS NEW ---
 */
router.delete('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    await enrollment.deleteOne();

    res.json({ message: 'Enrollment deleted successfully.' });
  } catch (err) {
    console.error("Error deleting enrollment:", err);
    res.status(500).json({ message: 'Server error while deleting enrollment.' });
  }
});

export default router;