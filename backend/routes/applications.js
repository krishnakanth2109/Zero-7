// File: backend/routes/applications.js

import express from 'express'
import Application from '../models/Application.js'
import Notification from '../models/notifications.js' // <-- CORRECTED: Path is singular

const router = express.Router()

/**
 * @route   GET /api/applications
 * @desc    Get all applications, populated with job role
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate('jobId', 'role') // Populates the 'role' field from the Job model
    res.json(applications)
  } catch (err) {
    console.error('Error fetching applications:', err)
    res
      .status(500)
      .json({ message: 'Server error while fetching applications.' })
  }
})

/**
 * @route   POST /api/applications
 * @desc    Create a new job application
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, jobId, resume } = req.body
    const checkApplication = await Application.find({
      _id: jobId,
      email: email,
    })

    // Basic validation
    if (!resume) {
      return res
        .status(400)
        .json({ message: 'A link to the resume is required.' })
    }

    // Create and save the new application
    if (checkApplication.length === 0) {
      const newApplication = new Application(req.body)
      const savedApplication = await newApplication.save()
      await savedApplication.populate('jobId', 'role')
      const io = req.app.get('io')
      const message = `New application from ${name} for the ${savedApplication.jobId.role} role.`

      // --- Save Notification to Database ---
      const notification = new Notification({
        title: 'New Job Application',
        message: message,
        type: 'success',
        link: '/admin/applications',
      })
      await notification.save()
      // ------------------------------------

      // Emit a real-time event to connected admin clients
      io.emit('newApplication', { message })
      res.status(201).send({ message: 'Successfully Submited' })
    } else {
      res.send({ message: 'Already Applied' })
    }
    // Populate job details to get the role name for the notification
  } catch (err) {
    console.error('Error saving application:', err)
    // Provide a more specific error for duplicate entries if applicable
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Duplicate application detected.' })
    }
    res
      .status(400)
      .json({ message: 'Failed to create application.', error: err.message })
  }
})

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete an application by its ID
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(
      req.params.id,
    )

    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found.' })
    }

    res.json({ message: 'Application deleted successfully' })
  } catch (err) {
    console.error('Error deleting application:', err)
    res.status(500).json({ message: 'Failed to delete application' })
  }
})

export default router
