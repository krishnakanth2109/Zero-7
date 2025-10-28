import express from 'express';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Notification from '../models/notifications.js';
import Counter from '../models/Counter.js'; // Import the Counter model

const router = express.Router();

/**
 * @route   GET /api/candidates
 * @desc    Get all APPROVED candidates with recruiter details
 * @access  Admin
 */
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

/**
 * @route   GET /api/candidates/pendings
 * @desc    Get all PENDING candidates with recruiter details
 * @access  Admin
 */
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

/**
 * @route   GET /api/candidates/all
 * @desc    Get ALL candidates (pending, approved, rejected)
 * @access  Admin
 */
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

/**
 * @route   PATCH /api/candidates/:id/status
 * @desc    Update a candidate's status
 * @access  Admin
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status } },
      { new: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }
    res.json(updatedCandidate);
  } catch (err) {
    console.error('Error updating candidate status:', err);
    res.status(400).json({ message: 'Failed to update status.' });
  }
});

/**
 * @route   POST /api/candidates
 * @desc    Add a new candidate (ID is now auto-generated)
 * @access  Admin
 */
router.post('/', async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();

    const io = req.app.get('io');
    const message = `A new candidate, ${savedCandidate.name}, was added to the bench.`;
    const notification = new Notification({
      title: 'New Candidate Added',
      message,
      type: 'success',
      link: '/admin/manage-candidates',
    });
    await notification.save();
    io.emit('newCandidateAdded', { message });

    res.status(201).json(savedCandidate);
  } catch (err) {
    console.error('Error adding candidate:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A candidate with this ID or Email already exists.' });
    }
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   POST /api/candidates/bulk
 * @desc    Add multiple candidates (manually generating a block of IDs)
 * @access  Admin
 */
router.post('/bulk', async (req, res) => {
  try {
    const candidatesData = req.body;
    if (!Array.isArray(candidatesData) || candidatesData.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty candidate data provided.' });
    }
    
    // Atomically reserve a block of sequence numbers for the bulk insert
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'candidateId' },
      { $inc: { seq: candidatesData.length } },
      { new: true, upsert: true }
    );

    const lastSequence = counter.seq;
    const firstSequence = lastSequence - candidatesData.length;

    // Assign the generated, sequential IDs to each candidate in the array
    const candidatesWithIds = candidatesData.map((candidate, index) => {
      const newSequence = firstSequence + 1 + index;
      return {
        ...candidate,
        candidateId: 'Z7' + String(newSequence).padStart(6, '0'),
      };
    });

    const createdCandidates = await Candidate.insertMany(candidatesWithIds);
    
    res.status(201).json({ message: `${createdCandidates.length} candidates imported successfully.` });
  } catch (err) {
    console.error('Error during bulk import:', err);
    if (err.code === 11000) {
       return res.status(400).json({ message: 'Bulk import failed. One or more candidates have a duplicate ID or Email.' });
    }
    res.status(500).json({ message: 'Server error during bulk import.' });
  }
});

/**
 * @route   PUT /api/candidates/:id
 * @desc    Update an existing candidate
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    // Prevent the auto-generated candidateId from being changed on update
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

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete a candidate by ID
 * @access  Admin
 */
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