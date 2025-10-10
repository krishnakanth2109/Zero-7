// File: backend/routes/interview.js

import express from 'express';
import Interview from '../models/Interview.js';
import Candidate from '../models/Candidate.js';
import Job from '../models/jobs.js'; // Corrected variable name from 'jobs' to 'Job' for clarity
import Company from '../models/Companies.js'; // Corrected variable name
import User from '../models/User.js';
import transporter from '../utils/mail.js';
import { renderEmailTemplate, prepareCandidateInterview } from '../utils/emailTemplates.js';
import Notification from '../models/notifications.js'; // <-- CORRECTED: Import path is singular

const router = express.Router();

/**
 * @route   GET /api/interview
 * @desc    Get all interviews with populated details
 * @access  Admin
 */
router.get('/', async (request, response) => {
  try {
    const pipeline = [
      { $addFields: { candidateObjectId: { $toObjectId: '$candidateId' }, jobObjectId: { $toObjectId: '$jobId' } } },
      { $lookup: { from: 'candidates', localField: 'candidateObjectId', foreignField: '_id', as: 'candidateInfo' } },
      { $unwind: '$candidateInfo' },
      { $lookup: { from: 'jobs', localField: 'jobObjectId', foreignField: '_id', as: 'jobInfo' } },
      { $unwind: '$jobInfo' },
      { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyInfo' } },
      { $unwind: { path: '$companyInfo', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, candidateId: 1, jobId: 1, status: 1, companyId: 1, userId: 1, date: 1, createdAt: 1, updatedAt: 1, candidateName: '$candidateInfo.name', companyName: '$companyInfo.name', jobRole: '$jobInfo.role' } },
      { $sort: { date: -1 } },
    ];
    const result = await Interview.aggregate(pipeline);
    response.status(200).json(result);
  } catch (err) {
    console.error("Error fetching interviews:", err);
    response.status(500).json({ message: 'Server error while fetching interviews.' });
  }
});

/**
 * @route   POST /api/interview
 * @desc    Schedule a new interview
 * @access  Admin
 */
router.post('/', async (request, response) => {
  const { candidateId, jobId, status, companyId, date } = request.body;
  try {
    const interviewPosted = await Interview.findOne({ candidateId, jobId });
    if (interviewPosted) {
      return response.status(409).send('An interview for this candidate and job has already been scheduled.');
    }

    const [candidate, job, company, recruiter] = await Promise.all([
      Candidate.findById(candidateId),
      Job.findById(jobId),
      Company.findById(companyId),
      User.findById(request.body.userId || 'defaultUserId') // Assumes userId might be passed
    ]);

    if (!candidate) return response.status(404).send('Candidate not found.');
    if (!job) return response.status(404).send('Job not found.');
    if (!company) return response.status(404).send('Company not found.');
    if (job.companyId.toString() !== companyId) {
        return response.status(400).send('Mismatch: This job does not belong to the selected company.');
    }

    const newInterview = new Interview({ candidateId, jobId, status, companyId, date });
    await newInterview.save();

    // --- Email Logic ---
    const templateData = prepareCandidateInterview(request, candidate, recruiter, newInterview, job, company);
    const htmlContent = renderEmailTemplate('interviewDetails', templateData);
    await transporter.sendMail({
      from: process.env.AUTH_MAIL,
      to: candidate.email,
      cc: recruiter?.email,
      subject: `Interview Scheduled for ${job.role} at ${company.name}`,
      html: htmlContent,
    });
    
    // --- Notification Logic ---
    const io = request.app.get('io');
    const message = `New interview scheduled for ${candidate.name} at ${company.name} for the ${job.role} role.`;
    const notification = new Notification({
        title: 'New Interview Scheduled',
        message: message,
        type: 'success',
        link: '/admin/interviews'
    });
    await notification.save();
    io.emit('newInterview', { message });
    // -------------------------

    response.status(201).json(newInterview);
  } catch (error) {
    console.error("Error scheduling interview:", error);
    response.status(500).json({ message: 'Server error while scheduling interview.' });
  }
});

/**
 * @route   PATCH /api/interview/:id
 * @desc    Update the status of an interview
 * @access  Admin
 */
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status field is required.' });
        }

        const updatedInterview = await Interview.findByIdAndUpdate(
            id,
            { status }, // Update only the status field
            { new: true } // Return the updated document
        );

        if (!updatedInterview) {
            return res.status(404).json({ message: 'Interview not found.' });
        }

        // --- Notification Logic for Status Update ---
        // We need to fetch related names for a descriptive message
        const [candidate, job, company] = await Promise.all([
            Candidate.findById(updatedInterview.candidateId),
            Job.findById(updatedInterview.jobId),
            Company.findById(updatedInterview.companyId),
        ]);
        
        if (candidate && job && company) {
            const io = req.app.get('io');
            const message = `Status for ${candidate.name}'s interview at ${company.name} updated to "${status}".`;
            const notification = new Notification({
                title: 'Interview Status Updated',
                message: message,
                type: 'info',
                link: '/admin/interviews'
            });
            await notification.save();
            io.emit('interviewStatusUpdated', { message, interview: updatedInterview });
        }
        // -----------------------------------------

        res.status(200).json(updatedInterview);
    } catch (error) {
        console.error('Error updating interview status:', error);
        res.status(500).json({ message: 'Server error while updating status.' });
    }
});

/**
 * @route   GET /api/interview/search
 * @desc    Get candidates and companies for form dropdowns
 * @access  Admin
 */
router.get('/search', async (request, response) => {
  try {
    const [candidates, companies] = await Promise.all([
        Candidate.find({}, { _id: 1, name: 1 }),
        Company.find({}, { _id: 1, name: 1 })
    ]);
    response.status(200).json({ candidates, companies });
  } catch (error) {
    console.error('Error fetching search options:', error);
    response.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;