// File: backend/routes/candidates.js

import express from 'express';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Notification from '../models/notifications.js';
import Counter from '../models/Counter.js';

const router = express.Router();

// GET all APPROVED candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.aggregate([
      { $match: { status: 'approved' } },
      { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
      { $lookup: { from: 'users', localField: 'userObjectId', foreignField: '_id', as: 'userDetails' } },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          candidateId: 1,
          name: 1,
          surname: 1,
          role: 1,
          location: 1,
          email: 1,
          skills: 1,
          exp: 1,
          phone: 1,
          updatedAt: 1,
          userName: '$userDetails.name',
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching approved candidates:', err);
    res.status(500).json({ error: 'Server error while fetching candidates.' });
  }
});

// GET all PENDING candidates with recruiter details
router.get('/pendings', async (req, res) => {
  try {
    const candidates = await Candidate.aggregate([
      { $match: { status: 'pending' } },
      { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
      { $lookup: { from: 'users', localField: 'userObjectId', foreignField: '_id', as: 'userDetails' } },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          candidateId: 1,
          name: 1,
          surname: 1,
          role: 1,
          location: 1,
          email: 1,
          skills: 1,
          exp: 1,
          phone: 1,
          status: 1,
          userName: '$userDetails.name',
          updatedAt: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching pending candidates:', err);
    res.status(500).json({ error: 'Server error while fetching candidates.' });
  }
});

// GET ALL candidates (pending, approved, rejected)
router.get('/all', async (req, res) => {
  try {
    const candidates = await Candidate.aggregate([
      { $match: { status: { $in: ['pending', 'approved', 'rejected'] } } },
      { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
      { $lookup: { from: 'users', localField: 'userObjectId', foreignField: '_id', as: 'userDetails' } },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          candidateId: 1,
          name: 1,
          surname: 1,
          role: 1,
          location: 1,
          email: 1,
          skills: 1,
          exp: 1,
          phone: 1,
          status: 1,
          userName: '$userDetails.name',
          updatedAt: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching all candidates:', err);
    res.status(500).json({ error: 'Server error while fetching candidates.' });
  }
});

// POST - Add a new candidate
router.post('/', async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();

    // Send notification via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const message = `A new candidate, ${savedCandidate.name}, was added to the bench.`;
      const notification = new Notification({
        title: 'New Candidate Added',
        message,
        type: 'success',
        link: '/admin/manage-candidates',
      });
      await notification.save();
      io.emit('newCandidateAdded', { message });
    }

    res.status(201).json(savedCandidate);
  } catch (err) {
    console.error('Error adding candidate:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A candidate with this Email already exists.' });
    }
    res.status(400).json({ message: err.message });
  }
});

// POST - Bulk import candidates
router.post('/bulk', async (req, res) => {
  try {
    const candidatesData = req.body;
    
    if (!Array.isArray(candidatesData) || candidatesData.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty candidate data provided.' });
    }
    
    // Reserve a block of sequence numbers
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'candidateId' },
      { $inc: { seq: candidatesData.length } },
      { new: true, upsert: true }
    );

    const lastSequence = counter.seq;
    const firstSequence = lastSequence - candidatesData.length;

    // Assign sequential IDs to each candidate
    const candidatesWithIds = candidatesData.map((candidate, index) => {
      const newSequence = firstSequence + 1 + index;
      return {
        ...candidate,
        candidateId: 'Z7' + String(newSequence).padStart(6, '0'),
      };
    });

    const createdCandidates = await Candidate.insertMany(candidatesWithIds);
    
    res.status(201).json({ 
      message: `${createdCandidates.length} candidates imported successfully.`,
      count: createdCandidates.length 
    });
  } catch (err) {
    console.error('Error during bulk import:', err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Bulk import failed. One or more candidates have a duplicate Email.' 
      });
    }
    res.status(500).json({ message: 'Server error during bulk import.' });
  }
});

// PATCH - Update candidate status (approve/reject)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'pending', 'placed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Notify recruiter if status changed to approved/rejected
    if (['approved', 'rejected'].includes(status)) {
      const recruiter = await User.findById(updatedCandidate.userId);
      if (recruiter) {
        const io = req.app.get('io');
        if (io) {
          const message = `Your candidate submission, ${updatedCandidate.name}, has been ${status} by an admin.`;
          const notification = new Notification({
            title: `Candidate ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message,
            type: status === 'approved' ? 'success' : 'error',
            link: '/admin/manage-candidates',
          });
          await notification.save();
          io.to('recruiter').emit('candidateStatusUpdate', { message });
        }
      }
    }

    res.status(200).json(updatedCandidate);
  } catch (err) {
    console.error('Error updating candidate status:', err);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
});

// PUT - Update full candidate record
router.put('/:id', async (req, res) => {
  try {
    // Prevent candidateId from being changed
    delete req.body.candidateId;

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    res.json(updatedCandidate);
  } catch (err) {
    console.error('Error updating candidate:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A candidate with this email already exists.' });
    }
    res.status(400).json({ message: err.message });
  }
});

// DELETE a candidate
router.delete('/:id', async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!deletedCandidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    res.json({ message: 'Candidate deleted successfully.' });
  } catch (err) {
    console.error('Error deleting candidate:', err);
    res.status(500).json({ error: 'Server error while deleting candidate.' });
  }
});

export default router;