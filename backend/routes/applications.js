// File: backend/routes/applications.js

import express from 'express';
const router = express.Router();
import Application from '../models/Application.js';
import Notification from '../models/notifications.js'; // <-- Corrected Import

// GET all applications
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 }).populate('jobId', 'role');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new application
router.post('/', async (req, res) => {
    try {
        const { jobId, name, resume } = req.body;
        
        if (!resume) {
            return res.status(400).json({ message: 'A link to the resume is required.' });
        }

        const newApplication = new Application(req.body);
        const savedApplication = await newApplication.save();

        // Populate job details to get the role name
        await savedApplication.populate('jobId', 'role');
        
        const io = req.app.get('io');
        const message = `New application from ${name} for the ${savedApplication.jobId.role} role.`;

        // --- ADDED: Save Notification ---
        const notification = new Notification({
            title: 'New Job Application',
            message: message,
            type: 'success',
            link: '/admin/applications'
        });
        await notification.save();
        // --------------------------------

        // Emit real-time event
        io.emit('newApplication', { message });

        res.status(201).json(savedApplication);
    } catch (err) {
        console.error("Error saving application:", err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
<<<<<<< Updated upstream
    await Application.findByIdAndDelete(req.params.id)
    res.json({ message: 'Application deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete application' })
  }
})

=======
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete application' });
  }
});
>>>>>>> Stashed changes

export default router;