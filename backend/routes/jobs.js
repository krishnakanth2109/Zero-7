// File: backend/routes/jobs.js

import express from 'express';
import Job from '../models/jobs.js';
import Company from '../models/Companies.js';
import Notification from '../models/notifications.js';

const router = express.Router();

// GET all jobs
router.get('/', async (req, res) => {
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
      {
        $project: {
          _id: 1,
          role: 1,
          exp: 1,
          skills: 1,
          salary: 1,
          location: 1,
          industry: 1,
          status: 1,
          createdAt: 1,
          companyName: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new job
router.post('/', async (req, res) => {
  const { companyId, role } = req.body;
  
  try {
    const companyExists = await Company.findOne({ _id: companyId });

    if (!companyExists) {
      return res.status(404).json({ message: 'CompanyID not found' });
    }

    const newJob = new Job(req.body);
    const savedJob = await newJob.save();

    // Notification Logic
    const io = req.app.get('io');
    if (io) {
      const message = `A new job for a ${role} was posted by ${companyExists.name}.`;
      
      const notification = new Notification({
        title: 'New Job Posting',
        message: message,
        type: 'info',
        link: '/admin/manage-jobs',
      });
      await notification.save();
      
      io.emit('newJobPosting', { message });
    }

    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a job by ID
router.delete('/:id', async (req, res) => {
  try {
    const removedJob = await Job.findByIdAndDelete(req.params.id);
    if (!removedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// PATCH/UPDATE a job by ID
router.patch('/:id', async (req, res) => {
  try {
    const jobUpdate = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!jobUpdate) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(jobUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;