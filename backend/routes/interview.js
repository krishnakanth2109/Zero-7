// File: backend/routes/interview.js

import express from 'express'
import Interview from '../models/Interview.js'
import Candidate from '../models/Candidate.js'
import Job from '../models/jobs.js'
import Company from '../models/Companies.js'
import User from '../models/User.js'
import Notification from '../models/notifications.js' // <-- CORRECTED PATH
// import {
//   renderEmailTemplate,
//   prepareCandidateInterview,
// } from '../utils/emailTemplates.js'
// import transporter from '../utils/mail.js'
import jobs from '../models/jobs.js'

const router = express.Router()

/**
 * @route   GET /api/interview
 * @desc    Get all APPROVED interviews with populated details
 * @access  Public (No Middleware)
 */
router.get('/', async (req, res) => {
  try {
    const pipeline = [
      { $match: { approvalStatus: 'approved' } },
      {
        $addFields: {
          candidateObjectId: { $toObjectId: '$candidateId' },
          jobObjectId: { $toObjectId: '$jobId' },
        },
      },
      {
        $lookup: {
          from: 'candidates',
          localField: 'candidateObjectId',
          foreignField: '_id',
          as: 'candidateInfo',
        },
      },
      { $unwind: '$candidateInfo' },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobObjectId',
          foreignField: '_id',
          as: 'jobInfo',
        },
      },
      { $unwind: '$jobInfo' },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyInfo',
        },
      },
      { $unwind: { path: '$companyInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          candidateId: 1,
          jobId: 1,
          status: 1,
          companyId: 1,
          userId: 1,
          date: 1,
          interviewLevel: 1,
          createdAt: 1,
          updatedAt: 1,
          candidateName: '$candidateInfo.name',
          candidateEmail: '$candidateInfo.email',
          companyName: '$companyInfo.name',
          jobRole: '$jobInfo.role',
          salary: '$jobInfo.salary',
        },
      },
      { $sort: { date: -1 } },
    ]
    const result = await Interview.aggregate(pipeline)
    res.status(200).json(result)
  } catch (err) {
    console.error('Error fetching approved interviews:', err)
    res.status(500).json({ message: 'Server error while fetching interviews.' })
  }
})
//interview per User
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const pipeline = [
      { $match: { approvalStatus: 'approved', userId: userId } },
      {
        $addFields: {
          candidateObjectId: { $toObjectId: '$candidateId' },
          jobObjectId: { $toObjectId: '$jobId' },
        },
      },
      {
        $lookup: {
          from: 'candidates',
          localField: 'candidateObjectId',
          foreignField: '_id',
          as: 'candidateInfo',
        },
      },
      { $unwind: '$candidateInfo' },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobObjectId',
          foreignField: '_id',
          as: 'jobInfo',
        },
      },
      { $unwind: '$jobInfo' },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyInfo',
        },
      },
      { $unwind: { path: '$companyInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          candidateId: 1,
          jobId: 1,
          status: 1,
          companyId: 1,
          userId: 1,
          date: 1,
          interviewLevel: 1,
          createdAt: 1,
          updatedAt: 1,
          candidateName: '$candidateInfo.name',
          candidateEmail: '$candidateInfo.email',
          companyName: '$companyInfo.name',
          jobRole: '$jobInfo.role',
        },
      },
      { $sort: { date: -1 } },
    ]
    const result = await Interview.aggregate(pipeline)
    res.status(200).json(result)
  } catch (err) {
    console.error('Error fetching approved interviews:', err)
    res.status(500).json({ message: 'Server error while fetching interviews.' })
  }
})

/**
 * @route   GET /api/interview/all
 * @desc    Get ALL interviews (pending, approved, rejected)
 * @access  Public (No Middleware)
 */
router.get('/all', async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          approvalStatus: { $in: ['pending', 'approved', 'rejected'] },
        },
      },
      {
        $addFields: {
          candidateObjectId: { $toObjectId: '$candidateId' },
          jobObjectId: { $toObjectId: '$jobId' },
          userObjectId: { $toObjectId: '$userId' },
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
        $lookup: {
          from: 'candidates',
          localField: 'candidateObjectId',
          foreignField: '_id',
          as: 'candidateInfo',
        },
      },
      { $unwind: '$candidateInfo' },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobObjectId',
          foreignField: '_id',
          as: 'jobInfo',
        },
      },
      { $unwind: '$jobInfo' },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyInfo',
        },
      },
      { $unwind: { path: '$companyInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          candidateId: 1,
          jobId: 1,
          status: 1,
          companyId: 1,
          userId: 1,
          date: 1,
          interviewLevel: 1,
          approvalStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          userName: '$userDetails.name',
          candidateName: '$candidateInfo.name',
          candidateEmail: '$candidateInfo.email',
          companyName: '$companyInfo.name',
          jobRole: '$jobInfo.role',
        },
      },
      { $sort: { updatedAt: -1 } },
    ]
    const result = await Interview.aggregate(pipeline)
    res.status(200).json(result)
  } catch (err) {
    console.error('Error fetching all interviews:', err)
    res
      .status(500)
      .json({ message: 'Server error while fetching all interviews.' })
  }
})

/**
 * @route   POST /api/interview
 * @desc    Schedule a new interview (status: 'pending' for approval)
 * @access  Public (No Middleware)
 */
router.post('/', async (req, res) => {
  // We now expect the frontend to send `userName` in the body
  const { candidateId, jobId, companyId, interviewLevel, userName } = req.body
  try {
    const interviewExists = await Interview.findOne({
      candidateId,
      jobId,
      interviewLevel,
    })
    if (interviewExists) {
      return res.status(409).json({
        message: `An interview for level ${interviewLevel} already exists for this candidate and job.`,
      })
    }

    const job = await Job.findById(jobId)
    if (!job || job.companyId.toString() !== companyId) {
      return res.status(400).json({
        message: 'This job ID does not belong to the selected company.',
      })
    }

    const newInterview = new Interview(req.body)
    await newInterview.save()

    // --- Targeted Notification for Manager/Admin ---
    const io = req.app.get('io')
    const message = `${
      userName || 'A user'
    } scheduled a new ${interviewLevel} interview that needs your approval.`
    const notification = new Notification({
      title: 'Interview Approval Required',
      message,
      type: 'warning',
      link: '/admin/interviews/approvals',
    })
    await notification.save()
    io.to('manager').emit('newInterviewApproval', { message })

    res.status(201).json(newInterview)
  } catch (error) {
    console.error('Error scheduling interview:', error)
    res
      .status(500)
      .json({ message: 'Server error while scheduling interview.' })
  }
})

/**
 * @route   PATCH /api/interview/:id
 * @desc    Update interview status OR approval status
 * @access  Public (No Middleware)
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    // The frontend must send `approverName` if it's an approval action
    const { approverName, ...updateData } = req.body

    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    )
    if (!updatedInterview) {
      return res.status(404).json({ message: 'Interview not found.' })
    }

    const [candidate, job, company, recruiter] = await Promise.all([
      Candidate.findById(updatedInterview.candidateId),
      Job.findById(updatedInterview.jobId),
      Company.findById(updatedInterview.companyId),
      User.findById(updatedInterview.userId),
    ])

    if (candidate && job && company) {
      const io = req.app.get('io')
      let message = ''
      let title = ''

      if (updateData.status) {
        title = 'Interview Status Updated'
        message = `Hiring status for ${candidate.name}'s interview at ${company.name} is now "${updateData.status}".`
        if (recruiter)
          io.to(recruiter.role).emit('interviewStatusUpdated', { message })
        io.to('manager').emit('interviewStatusUpdated', { message })
      } else if (updateData.approvalStatus) {
        title = `Interview ${
          updateData.approvalStatus.charAt(0).toUpperCase() +
          updateData.approvalStatus.slice(1)
        }`
        message = `The interview for ${candidate.name} was ${
          updateData.approvalStatus
        } by ${approverName || 'a manager'}.`
        if (recruiter)
          io.to(recruiter.role).emit('interviewStatusUpdated', { message })
      }

      if (title && message) {
        const notification = new Notification({
          title,
          message,
          type: 'info',
          link: '/admin/interviews',
        })
        await notification.save()
      }
    }

    res.status(200).json(updatedInterview)
  } catch (error) {
    console.error('Error updating interview:', error)
    res.status(500).json({ message: 'Server error while updating interview.' })
  }
})

/**
 * @route   GET /api/interview/search
 * @desc    Get candidates and companies for form dropdowns
 * @access  Public (No Middleware)
 */
router.get('/search', async (req, res) => {
  try {
    const [candidates, companies, jobs] = await Promise.all([
      Candidate.find({ status: 'approved' }, { _id: 1, name: 1 }),
      Company.find({}, { _id: 1, name: 1 }),
    ])
    res.status(200).json({ candidates, companies })
  } catch (error) {
    console.error('Error fetching search options:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

router.get('/jobSearch/:id', async (req, res) => {
  try {
    const companyId = req.params.id
    const jobs = await Job.find(
      { companyId: companyId, status: 'active' },
      { _id: 1, role: 1, status: 1 },
    )
    res.send({ jobs })
  } catch (err) {
    res.send(err)
  }
})

export default router
