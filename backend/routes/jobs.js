import express from 'express';
const router = express.Router();
// Correctly imports your model file
import Job from '../models/jobs.js';

// GET all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new job
router.post('/', async (req, res) => {
    const { role, exp, skills, salary, location } = req.body;
    const newJob = new Job({ role, exp, skills, salary, location });
    try {
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a job by ID
router.delete('/:id', async (req, res) => {
    try {
        const removedJob = await Job.findByIdAndDelete(req.params.id);
        if (!removedJob) return res.status(404).json({ message: "Job not found" });
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting job' });
    }
});

export default router;