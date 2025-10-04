import express from 'express'
import Candidate from '../models/Candidate.js'
import User from '../models/User.js'

const router = express.Router()

/**
 * @route   GET /api/candidates
 * @desc    Get all candidates from the database
 * @access  Public (or private if you add authentication middleware)
 */
router.get('/', async (req, res) => {
  try {
    // Find all candidates and sort them by creation date (newest first)
    const candidates = await Candidate.aggregate([
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
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          role: 1,
          location: 1,
          email: 1,
          skills: 1,
          userName: {
            $cond: {
              if: { $eq: ['$userDetails.role', 'recruiter'] },
              then: '$userDetails.name',
              else: null,
            },
          },
          userRole: {
            $cond: {
              if: { $eq: ['$userDetails.role', 'recruiter'] },
              then: '$userDetails.role',
              else: null,
            },
          },
        },
      },
    ])
    res.json(candidates)
  } catch (err) {
    // Handle potential server errors
    console.error('Error fetching candidates:', err)
    res.status(500).json({ error: 'Server error while fetching candidates.' })
  }
})

/**
 * @route   POST /api/candidates
 * @desc    Add a new candidate to the database
 * @access  Public (or private)
 */
router.post('/', async (req, res) => {
  try {
    // Create a new Candidate instance with the data from the request body
    const newCandidate = new Candidate(req.body)
    // Save the new candidate to the database
    const savedCandidate = await newCandidate.save()
    // Respond with the newly created candidate data
    res.status(201).json(savedCandidate)
  } catch (err) {
    // Handle validation or other errors
    console.error('Error adding candidate:', err)
    res.status(400).json({ error: err.message })
  }
})

router.get('/search', async (request, response) => {
  try {
    const user = await User.find({ role: 'recruiter' }, { _id: 1, name: 1 })
    response.send({ user })
  } catch (err) {
    response.send(err)
  }
})

/**
 * @route   PUT /api/candidates/:id
 * @desc    Update an existing candidate by their ID
 * @access  Public (or private)
 */
router.put('/:id', async (req, res) => {
  try {
    // Find a candidate by its ID and update it with the new data
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // This option returns the updated document
    )

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found.' })
    }

    // Respond with the updated candidate data
    res.json(updatedCandidate)
  } catch (err) {
    // Handle potential errors
    console.error('Error updating candidate:', err)
    res.status(400).json({ error: err.message })
  }
})

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete a candidate by their ID
 * @access  Public (or private)
 */
router.delete('/:id', async (req, res) => {
  try {
    // Find a candidate by its ID and delete it
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id)

    if (!deletedCandidate) {
      return res.status(404).json({ error: 'Candidate not found.' })
    }

    // Respond with a success message
    res.json({ message: 'Candidate deleted successfully.' })
  } catch (err) {
    // Handle potential server errors
    console.error('Error deleting candidate:', err)
    res.status(500).json({ error: 'Server error while deleting candidate.' })
  }
})

export default router
