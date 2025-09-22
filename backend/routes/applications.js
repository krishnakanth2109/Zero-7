// File: backend/routes/applications.js

import express from 'express';
const router = express.Router();
import Application from '../models/Application.js';
import upload from '../middleware/upload.js';

// GET all applications
router.get('/', async (req, res) => {
    try {
        // Populate 'jobId' to get job details along with the application
        const applications = await Application.find().sort({ createdAt: -1 }).populate('jobId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new application
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { jobId, name, contact, email, experience, currentSalary, expectedSalary, location } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Resume file is required.' });
        }
        const resume = req.file.path;
        const newApplication = new Application({
            jobId, name, contact, email, experience, currentSalary, expectedSalary, location, resume
        });
        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;