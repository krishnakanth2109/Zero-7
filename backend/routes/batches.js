// File: backend/routes/batches.js

import express from 'express';
const router = express.Router();
import Batch from '../models/Batch.js';

// GET all batches (No change)
router.get('/', async (req, res) => {
    try {
        const batches = await Batch.find().sort({ createdAt: -1 });
        res.json(batches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a single new batch (No change)
router.post('/', async (req, res) => {
    const newBatch = new Batch(req.body);
    try {
        const savedBatch = await newBatch.save();
        res.status(201).json(savedBatch);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- ADD THIS NEW ROUTE FOR BULK IMPORT ---
// POST multiple new batches
router.post('/bulk', async (req, res) => {
    try {
        const newBatches = await Batch.insertMany(req.body);
        res.status(201).json(newBatches);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// ---------------------------------------------

// DELETE a batch (No change)
router.delete('/:id', async (req, res) => {
    try {
        const removedBatch = await Batch.findByIdAndDelete(req.params.id);
        if (!removedBatch) return res.status(404).json({ message: "Batch not found" });
        res.json({ message: 'Batch deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;