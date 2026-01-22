// File: backend/routes/manager.js

import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; 

const router = express.Router();

// GET all users with the 'manager' role
router.get('/', async (req, res) => {
    try {
        const managers = await User.find({ role: 'manager' });
        res.status(200).json(managers);
    } catch (error) {
        console.error("Error fetching managers:", error);
        res.status(500).json({ error: 'Server error while fetching managers' });
    }
});

// POST a new user with the 'manager' role
router.post('/register', async (req, res) => {
    const { name, email, employeeID, password, assigned_Company, phone, age } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { employeeId: employeeID }] });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email or employee ID already exists.' });
        }

        // FIX: Removed manual bcrypt hashing here to prevent Double Hashing.
        // The User model's pre-save hook will handle the hashing.
        
        const newManager = new User({
            name,
            email,
            employeeId: employeeID, 
            password: password, // Send plain text, let the Model hash it
            assigned_Company,
            phone,
            age,
            role: 'manager'
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

        // We DO need manual hashing here because findByIdAndUpdate bypasses the pre-save hook
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