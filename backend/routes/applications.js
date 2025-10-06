// File: backend/routes/applications.js (Corrected for Resume URL)

import express from 'express';
const router = express.Router();
import Application from '../models/Application.js';
// We no longer need 'upload' from multer for this route
// import upload from '../middleware/upload.js'; 

// GET all applications
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 }).populate('jobId', 'role');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- FIX: Removed the 'upload.single('resume')' middleware ---
// POST a new application
router.post('/', async (req, res) => {
    try {
        // All data, including the resume URL, is now in req.body
        const { jobId, name, contact, email, experience, currentSalary, expectedSalary, location, resume } = req.body;
        
        if (!resume) {
            return res.status(400).json({ message: 'A link to the resume is required.' });
        }

        // Create a new application instance with the data from the request body
        const newApplication = new Application({
            jobId, name, contact, email, experience, currentSalary, expectedSalary, location, resume
        });

        const savedApplication = await newApplication.save();

        // --- Notification Logic (Remains the same) ---
        const io = req.app.get('io');
        await savedApplication.populate('jobId', 'role');
        io.emit('newApplication', { 
            message: `New application from ${name} for the ${savedApplication.jobId.role} role.` 
        });

        res.status(201).json(savedApplication);
    } catch (err) {
        console.error("Error saving application:", err);
        res.status(400).json({ message: err.message });
    }
});

export default router;