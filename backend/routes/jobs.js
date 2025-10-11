// File: backend/routes/jobs.js

import express from 'express'
const router = express.Router()
import Job from '../models/jobs.js'
import Company from '../models/Companies.js'
import Notification from '../models/notifications.js' // <-- Corrected Import

// GET all jobs
router.get('/', async (req, res) => {
  // ... (logic is correct, no changes needed here)
  try {
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyInfo',
        },
      },
      { $unwind: '$companyInfo' },
      { $addFields: { companyName: '$companyInfo.name' } },
      { $project: { companyInfo: 0 } },
      { $sort: { createdAt: -1 } },
    ])
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST a new job
router.post('/', async (req, res) => {
  const { companyId, role } = req.body
  const companyExists = await Company.findOne({ _id: companyId })

  if (companyExists) {
    try {
      const newJob = new Job(req.body)
      const savedJob = await newJob.save()

      // --- ADDED: Notification Logic ---
      const io = req.app.get('io')
      const message = `A new job for a ${role} was posted by ${companyExists.name}.`

      const notification = new Notification({
        title: 'New Job Posting',
        message: message,
        type: 'info',
        link: '/admin/manage-jobs', // Update if your link is different
      })
      await notification.save()

      io.emit('newJobPosting', { message })
      // ---------------------------------

      res.status(201).json(savedJob)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  } else {
    res.status(404).send('CompanyID not found')
  }
})

// DELETE a job by ID
router.delete('/:id', async (req, res) => {
  // ... (logic is correct, no changes needed here)
  try {
    const removedJob = await Job.findByIdAndDelete(req.params.id)
    if (!removedJob) return res.status(404).json({ message: 'Job not found' })
    res.json({ message: 'Job deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job' })
  }
})

router.patch('/:id', async (request, response) => {
  try {
    const companyUpdate = await Job.findByIdAndUpdate(
      { _id: request.params.id },
      { $set: request.body },
      { new: true },
    )
    response.send(companyUpdate)
  } catch (err) {
    response.send(err)
  }
})

export default router
