// File: backend/routes/collegeProposalRoutes.js

import express from 'express'
import CollegeProposal from '../models/CollegeProposal.js'
import Notification from '../models/notifications.js'

const router = express.Router()

/**
 * @route   POST /api/college-proposals
 * @desc    Submit a new college proposal form
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const newProposal = new CollegeProposal(req.body)
    await newProposal.save()

    // --- Save Notification to Database ---
    const notification = new Notification({
      title: 'New College Proposal',
      message: `From ${newProposal.collegeName} regarding "${newProposal.proposalType}"`,
      type: 'info', // Changed type for differentiation
      link: '/admin/forms', // Or a new admin link like '/admin/proposals'
    })
    await notification.save()
    // -------------------------------------

    // Emit a real-time event to connected admin clients
    // Note: AdminHomeForm.jsx uses polling, but this is good for future real-time updates.
    req.app.get('io').emit('newCollegeProposal', newProposal)

    res.status(201).json(newProposal)
  } catch (err) {
    console.error('Error saving college proposal:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * @route   GET /api/college-proposals
 * @desc    Get all college proposal submissions
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const proposals = await CollegeProposal.find().sort({ createdAt: -1 })
    res.json(proposals)
  } catch (err) {
    console.error('Error fetching college proposals:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router