// File: backend/routes/payrollConsultations.js

import express from 'express';
import PayrollConsultation from '../models/PayrollConsultation.js';
import Notification from '../models/notifications.js';

const router = express.Router();

/**
 * @route   POST /api/payroll-consultations
 * @desc    Submit a new payroll consultation request
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, company } = req.body;

    // Server-side validation
    if (!name || !email || !company) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newRequest = new PayrollConsultation({ name, email, company });
    await newRequest.save();

    // --- Notification Logic for Admin ---
    const io = req.app.get('io');
    const message = `New payroll consultation request from ${name} at ${company}.`;
    const notification = new Notification({
      title: 'New Payroll Request',
      message: message,
      type: 'info',
      link: '/admin/payroll-requests', // Link to the new admin page
    });
    await notification.save();
    io.emit('newPayrollRequest', { message });
    // ------------------------------------

    res.status(201).json({ message: 'Request submitted successfully!' });
  } catch (err) {
    console.error('Error submitting payroll request:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

/**
 * @route   GET /api/payroll-consultations
 * @desc    Get all payroll consultation requests
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const requests = await PayrollConsultation.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Error fetching payroll requests:', err);
    res.status(500).json({ message: 'Server error while fetching requests.' });
  }
});

/**
 * @route   DELETE /api/payroll-consultations/:id
 * @desc    Delete a payroll consultation request
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const request = await PayrollConsultation.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    await request.deleteOne();
    res.json({ message: 'Request deleted successfully.' });
  } catch (err) {
    console.error('Error deleting payroll request:', err);
    res.status(500).json({ message: 'Server error while deleting request.' });
  }
});

export default router;