// File: backend/routes/enrollments.js

import express from 'express'; // <-- Changed from require to import
const router = express.Router();

import Enrollment from '../models/Enrollment.js';
import upload from '../middleware/upload.js';

// POST a new enrollment
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { name, contact, email, location } = req.body;

        // Add a check to make sure a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Resume file is required.' });
        }
        const resume = req.file.path;

        const newEnrollment = new Enrollment({ name, contact, email, location, resume });
        const savedEnrollment = await newEnrollment.save();
        res.status(201).json(savedEnrollment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// (Add GET route for admin)
export default router;