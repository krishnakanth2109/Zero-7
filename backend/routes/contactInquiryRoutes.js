// File: backend/routes/contactInquiryRoutes.js

import express from 'express';
import ContactInquiry from '../models/ContactInquiry.js';
import Notification from '../models/notifications.js';

const router = express.Router();

/**
 * @route   POST /api/contact-inquiries
 * @desc    Submit a new contact inquiry
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, service } = req.body;
    const newInquiry = new ContactInquiry(req.body);
    await newInquiry.save();
    
    // --- Notification & Real-time update logic ---
    const notification = new Notification({
        title: 'New Contact Inquiry',
        message: `You have a new message from ${name} regarding "${service}".`,
        type: 'warning',
        link: '/admin/contact-inquiries'
    });
    await notification.save();
    
    // Emit event to connected admin clients
    if (req.app.get('io')) {
        req.app.get('io').emit('newContactInquiry', newInquiry);
    }
    // --- End Notification Logic ---

    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
  } catch (err) {
    console.error('Error saving contact inquiry:', err);
    res.status(500).json({ message: 'Failed to submit inquiry due to a server error.' });
  }
});

/**
 * @route   GET /api/contact-inquiries
 * @desc    Get all contact inquiries for the admin page
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ message: 'Server error while fetching inquiries.' });
  }
});

/**
 * @route   DELETE /api/contact-inquiries/:id
 * @desc    Delete a contact inquiry by its ID
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedInquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
    
    if (!deletedInquiry) {
        return res.status(404).json({ message: "Inquiry not found." });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    res.status(500).json({ message: 'Failed to delete inquiry.' });
  }
});

export default router;