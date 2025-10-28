import express from 'express';
import mongoose from 'mongoose'; // <<< 1. IMPORT MONGOOSE FOR ID VALIDATION
import Notification from '../models/notifications.js'; // Ensure this file exists

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Fetch all notifications
 * @access  Public (no middleware)
 */
router.get('/', async (req, res) => {
  try {
    // Fetch the 50 most recent notifications
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error while fetching notifications." });
  }
});

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all unread notifications as read
 * @access  Public (no middleware)
 */
router.put('/mark-all-read', async (req, res) => {
  try {
    // Update all documents where unread is true
    await Notification.updateMany({ unread: true }, { $set: { unread: false } });
    res.status(200).json({ message: "All notifications marked as read." });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ message: "Server error while updating notifications." });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification by its ID
 * @access  Public (no middleware)
 */
router.delete('/:id', async (req, res) => {
  try {
    const  notificationId  = req.params.id;
    const deletereq= await Notification.deleteOne({_id:notificationId})
    res.send({message:"delete sucess"})
  }catch(err){
    res.send({message:"unsucess"})
  }
});


export default router;