// File: backend/routes/manager.js

import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; // <-- IMPORTANT: We use the unified User model

const router = express.Router();

// GET all users with the 'manager' role
router.get('/', async (req, res) => {
    try {
        // Find all documents in the 'Users' collection where the role is 'manager'
        const managers = await User.find({ role: 'manager' });
        res.status(200).json(managers);
    } catch (error) {
        console.error("Error fetching managers:", error);
        res.status(500).json({ error: 'Server error while fetching managers' });
    }
});

// POST a new user with the 'manager' role
// Note: This endpoint is slightly different from your frontend component, which calls /register.
// We are making the backend match the frontend's expectation.
router.post('/register', async (req, res) => {
    // The component sends 'employeeID' but the model uses 'employeeId'. We handle this.
    const { name, email, employeeID, password, assigned_Company, phone, age } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { employeeId: employeeID }] });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email or employee ID already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newManager = new User({
            name,
            email,
            employeeId: employeeID, // Map frontend 'employeeID' to model's 'employeeId'
            password: hashedPassword,
            assigned_Company,
            phone,
            age,
            role: 'manager' // CRITICAL: Set the role explicitly
        });

        await newManager.save();
        res.status(201).json({ message: 'Manager created successfully', user: newManager });
    } catch (error) {
        console.error("Error creating manager:", error);
        res.status(500).json({ error: 'Server error while creating manager' });
    }
});

// PUT (Update) a manager by their ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, employeeID, assigned_Company, phone, age, password } = req.body;
    try {
        const updateData = { name, email, employeeId: employeeID, assigned_Company, phone, age };

        // If a new password is provided in the form, hash it and add it to the update
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedManager = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedManager) {
            return res.status(404).json({ error: 'Manager not found' });
        }
        res.status(200).json(updatedManager);
    } catch (error) {
        console.error("Error updating manager:", error);
        res.status(500).json({ error: 'Server error while updating manager' });
    }
});

// DELETE a manager by their ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedManager = await User.findByIdAndDelete(id);
        if (!deletedManager) {
            return res.status(404).json({ error: 'Manager not found' });
        }
        res.status(200).json({ message: 'Manager deleted successfully' });
    } catch (error) {
        console.error("Error deleting manager:", error);
        res.status(500).json({ error: 'Server error while deleting manager' });
    }
});

export default router;