// File: backend/routes/candidates.js

import express from 'express'
import Candidate from '../models/Candidate.js'
import User from '../models/User.js'
import Notification from '../models/notifications.js' // <-- CORRECTED: Import path is singular
import {
  prepareCandidateAdd,
  renderEmailTemplate,
} from '../utils/emailTemplates.js'
import transporter from '../utils/mail.js'

const router = express.Router()

/**
 * @route   GET /api/candidates
 * @desc    Get all candidates with recruiter details
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.aggregate([
      // This pipeline joins candidates with users to get the recruiter's name
      {
        $match: {
          status: 'approved',
        },
      },
      {
        $addFields: {
          userObjectId: {
            $cond: {
              if: { $ne: ['$userId', null] },
              then: { $toObjectId: '$userId' },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          role: 1,
          location: 1,
          email: 1,
          skills: 1,
          exp: 1,
          userName: '$userDetails.name',
        },
      },
    ])
    res.json(candidates)
  } catch (err) {
    console.error('Error fetching candidates:', err)
    res.status(500).json({ error: 'Server error while fetching candidates.' })
  }
})

// wait to be approved candidates List
router.get('/pendings', async (req, res) => {
  try {
    const candidates = await Candidate.aggregate([
      // This pipeline joins candidates with users to get the recruiter's name
      {
        $match: {
          status: 'pending',
        },
      },
      {
        $addFields: {
          userObjectId: {
            $cond: {
              if: { $ne: ['$userId', null] },
              then: { $toObjectId: '$userId' },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          role: 1,
          location: 1,
          email: 1,
          skills: 1,
          exp: 1,
          status: 1,
          userName: '$userDetails.name',
        },
      },
    ])
    res.json(candidates)
  } catch (err) {
    console.error('Error fetching candidates:', err)
    res.status(500).json({ error: 'Server error while fetching candidates.' })
  }
})
// all candida
router.get('/all', async (req, res) => {
  try {
    const candidates = await Candidate.aggregate([
      // This pipeline joins candidates with users to get the recruiter's name
  {
  $match: {
    status: { $in: ['pending', 'approved', 'rejected'] }
  }
},
      {
        $addFields: {
          userObjectId: {
            $cond: {
              if: { $ne: ['$userId', null] },
              then: { $toObjectId: '$userId' },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          role: 1,
          location: 1,
          email: 1,
          skills: 1,
          exp: 1,
          status: 1,
          userName: '$userDetails.name',
        },
      },
    ])
    res.json(candidates)
  } catch (err) {
    console.error('Error fetching candidates:', err)
    res.status(500).json({ error: 'Server error while fetching candidates.' })
  }
})
//update status of candidate either approved or reject
router.patch('/:id/status', async (request, response) => {
  const candidateId = request.params
  const { status } = request.body
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId.id,
      { $set: { status: status } },
      { new: true },
    )
    response.send(candidate)
  } catch (err) {
    response.status(400).send(err)
  }
})

/**
 * @route   POST /api/candidates
 * @desc    Add a new candidate
 * @access  Admin
 */
router.post('/', async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body)
    const savedCandidate = await newCandidate.save()

    // --- Email Sending Logic ---
    const templateData = prepareCandidateAdd()
    const htmlContent = renderEmailTemplate('enrollStudentAlert', templateData)
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: newCandidate.email,
      subject: 'Candidate Bench List',
      html: htmlContent,
    }
    await transporter.sendMail(mailOptions)
    // --- End Email Logic ---

    // --- Notification Logic ---
    const io = req.app.get('io')
    const message = `A new candidate, ${savedCandidate.name}, was added to the bench.`

    const notification = new Notification({
      title: 'New Candidate Added',
      message: message,
      type: 'success',
      link: '/admin/manage-candidates',
    })
    await notification.save()

    io.emit('newCandidateAdded', { message })
    // -------------------------

    res.status(201).json(savedCandidate)
  } catch (err) {
    console.error('Error adding candidate:', err)
    res.status(400).json({ error: err.message })
  }
})

/**
 * @route   GET /api/candidates/search
 * @desc    Get recruiters for dropdowns
 * @access  Admin
 */
router.get('/search', async (req, res) => {
  try {
    const users = await User.find({ role: 'recruiter' }, { _id: 1, name: 1 })
    res.json({ user: users })
  } catch (err) {
    console.error('Error fetching recruiters for search:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * @route   PUT /api/candidates/:id
 * @desc    Update an existing candidate
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found.' })
    }
    res.json(updatedCandidate)
  } catch (err) {
    console.error('Error updating candidate:', err)
    res.status(400).json({ error: err.message })
  }
})

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete a candidate by ID
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id)
    if (!deletedCandidate) {
      return res.status(404).json({ error: 'Candidate not found.' })
    }
    res.json({ message: 'Candidate deleted successfully.' })
  } catch (err) {
    console.error('Error deleting candidate:', err)
    res.status(500).json({ error: 'Server error while deleting candidate.' })
  }
})

export default router
