// File: backend/routes/recruiter.js

import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; // <-- IMPORTANT: We use the unified User model

const router = express.Router();

// GET all users with the 'recruiter' role
router.get('/', async (req, res) => {
    try {
        const recruiters = await User.find({ role: 'recruiter' });
        res.status(200).json(recruiters);
    } catch (error) {
        console.error("Error fetching recruiters:", error);
        res.status(500).json({ error: 'Server error while fetching recruiters' });
    }
});

// POST a new user with the 'recruiter' role
router.post('/register', async (req, res) => {
    const { name, email, employeeID, password, assigned_Company, phone, age } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { employeeId: employeeID }] });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email or employee ID already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newRecruiter = new User({
            name,
            email,
            employeeId: employeeID,
            password: hashedPassword,
            assigned_Company,
            phone,
            age,
            role: 'recruiter' // CRITICAL: Set the role explicitly
        });

        await newRecruiter.save();
        res.status(201).json({ message: 'Recruiter created successfully', user: newRecruiter });
    } catch (error) {
        console.error("Error creating recruiter:", error);
        res.status(500).json({ error: 'Server error while creating recruiter' });
    }
});

// PUT (Update) a recruiter by their ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, employeeID, assigned_Company, phone, age, password } = req.body;
    try {
        const updateData = { name, email, employeeId: employeeID, assigned_Company, phone, age };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedRecruiter = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedRecruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }
        res.status(200).json(updatedRecruiter);
    } catch (error) {
        console.error("Error updating recruiter:", error);
        res.status(500).json({ error: 'Server error while updating recruiter' });
    }
});

// DELETE a recruiter by their ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecruiter = await User.findByIdAndDelete(id);
        if (!deletedRecruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }
        res.status(200).json({ message: 'Recruiter deleted successfully' });
    } catch (error) {
        console.error("Error deleting recruiter:", error);
        res.status(500).json({ error: 'Server error while deleting recruiter' });
    }
});

export default router;