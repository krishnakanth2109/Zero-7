// File: backend/routes/enrollments.js

import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/notifications.js'; // <-- CORRECTED: Import path is singular
import {
  renderEmailTemplate,
  prepareCandidateEnrollForAdmin,
  prepareStudentAcknowledgment,
} from '../utils/emailTemplates.js';
import transporter from '../utils/mail.js';

const router = express.Router();

/**
 * @route   POST /api/enrollments
 * @desc    Create a new student enrollment
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if the student has already enrolled
    const emailCheck = await Enrollment.findOne({ email });
    if (emailCheck) {
      // Use return to stop execution
      return res.status(409).json({ message: 'You are already enrolled.' });
    }
    
    // Create and save the new enrollment record
    const newEnrollment = new Enrollment(req.body);
    const savedEnrollment = await newEnrollment.save();
    
    // --- Email Sending Logic ---
    // 1. Send an alert email to the admin
    const adminTemplate = prepareCandidateEnrollForAdmin(newEnrollment);
    const adminHtml = renderEmailTemplate('enrollmentAlert', adminTemplate);
    await transporter.sendMail({
      from: process.env.AUTH_MAIL,
      to: process.env.AUTH_MAIL,
      subject: 'Candidate Enrollment Form Alert',
      html: adminHtml,
    });
    
    // 2. Send an acknowledgment email to the student
    const studentTemplate = prepareStudentAcknowledgment(name);
    const studentHtml = renderEmailTemplate('enrollmentStudentConfirmation', studentTemplate);
    await transporter.sendMail({
      from: process.env.AUTH_MAIL,
      to: email,
      subject: 'Thank You for Your Response',
      html: studentHtml,
    });
    // --- End Email Logic ---

    // --- Notification Logic ---
    const io = req.app.get('io');
    const message = `New enrollment from student: ${name}.`;

    const notification = new Notification({
        title: 'New Enrollment',
        message: message,
        type: 'info',
        link: '/admin/studentenrollment'
    });
    await notification.save();
    
    io.emit('newEnrollment', { message });
    // -------------------------

    res.status(201).json(savedEnrollment);
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(400).json({ message: "Failed to create enrollment.", error: err.message });
  }
});

export default router;