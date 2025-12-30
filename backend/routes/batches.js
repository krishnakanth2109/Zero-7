// File: backend/routes/batches.js

import express from 'express'
const router = express.Router()
import Batch from '../models/Batch.js'

// GET all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 })
    res.json(batches)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST a single new batch
router.post('/', async (req, res) => {
  // The request body will now contain the new schema fields
  const newBatch = new Batch(req.body)
  try {
    const savedBatch = await newBatch.save()
    res.status(201).json(savedBatch)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST multiple new batches for bulk import
router.post('/bulk', async (req, res) => {
  try {
    // Expects an array of batch objects matching the new schema
    const newBatches = await Batch.insertMany(req.body)
    res.status(201).json(newBatches)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PATCH (Update) a batch by ID
router.patch('/:id', async (request, response) => {
  try {
    const updatedBatch = await Batch.findByIdAndUpdate(
      request.params.id,
      { $set: request.body }, // Updates fields based on the new schema data
      { new: true },
    )
    response.send(updatedBatch)
  } catch (err) {
    response.status(500).send(err)
  }
})

// DELETE a batch by ID
router.delete('/:id', async (req, res) => {
  try {
    const removedBatch = await Batch.findByIdAndDelete(req.params.id)
    if (!removedBatch)
      return res.status(404).json({ message: 'Batch not found' })
    res.json({ message: 'Batch deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router