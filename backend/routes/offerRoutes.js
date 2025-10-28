// File: backend/routes/offerRoutes.js

import express from 'express';
import Offer from '../models/Offer.js';
const router = express.Router();

/**
 * @route   POST /api/offers
 * @desc    Create or update the single offer entry (Upsert)
 * @access  Admin
 */
router.post('/', async (req, res) => {
  try {
    // The upsert logic correctly handles the new 'isActive' field from the form body
    const updatedOffer = await Offer.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(201).json(updatedOffer);
  } catch (err) {
    console.error('Error saving offer:', err);
    res.status(500).json({ message: 'Server error while saving the offer.' });
  }
});

/**
 * @route   GET /api/offers/latest
 * @desc    Get the most recently updated ACTIVE offer
 * @access  Public
 */
router.get('/latest', async (req, res) => {
  try {
    // --- UPDATED: Now only finds an offer if 'isActive' is true ---
    const latestOffer = await Offer.findOne({ isActive: true }).sort({ updatedAt: -1 });
    
    if (!latestOffer) {
      // This is expected if the offer is turned off.
      return res.status(404).json({ message: 'No active offer found.' });
    }
    res.json(latestOffer);
  } catch (err) {
    console.error('Error fetching latest offer:', err);
    res.status(500).json({ message: 'Server error while fetching the offer.' });
  }
});

export default router;