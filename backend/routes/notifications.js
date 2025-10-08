// File: backend/routes/notifications.js

import express from 'express'
import Notification from '../models/notifications.js'

const router = express.Router()

/**
 * @route   GET /api/notifications
 * @desc    Fetch all notifications, sorted from newest to oldest
 * @access  Private (for admin)
 */
router.get('/', async (req, res) => {
  try {
    // Fetch the 50 most recent notifications
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(notifications)
  } catch (err) {
    console.error('Error fetching notifications:', err)
    res
      .status(500)
      .json({ message: 'Server error while fetching notifications.' })
  }
})

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all unread notifications as read
 * @access  Private (for admin)
 */
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany({ unread: true }, { $set: { unread: false } })
    res.status(200).json({ message: 'All notifications marked as read.' })
  } catch (err) {
    console.error('Error marking notifications as read:', err)
    res
      .status(500)
      .json({ message: 'Server error while updating notifications.' })
  }
})

export default router
