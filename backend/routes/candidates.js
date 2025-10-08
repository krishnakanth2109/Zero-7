// File: backend/routes/candidates.js

import express from 'express';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Notification from '../models/notifications.js'; // <-- Correct Import
import {
  prepareCandidateAdd,
  renderEmailTemplate,
} from '../utils/emailTemplates.js';
import transporter from '../utils/mail.js';

const router = express.Router();

// GET all candidates
router.get('/', async (req, res) => {
    // ... (logic is correct, no changes needed here)
    try {
        const candidates = await Candidate.aggregate([
          { $addFields: { userObjectId: { $cond: { if: { $ne: ['$userId', null] }, then: { $toObjectId: '$userId' }, else: null } } } },
          { $lookup: { from: 'users', localField: 'userObjectId', foreignField: '_id', as: 'userDetails' } },
          { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
          { $project: { _id: 1, name: 1, role: 1, location: 1, email: 1, skills: 1, userName: { $cond: { if: { $eq: ['$userDetails.role', 'recruiter'] }, then: '$userDetails.name', else: null } }, userRole: { $cond: { if: { $eq: ['$userDetails.role', 'recruiter'] }, then: '$userDetails.role', else: null } } } }
        ]);
        res.json(candidates);
    } catch (err) {
        console.error('Error fetching candidates:', err);
        res.status(500).json({ error: 'Server error while fetching candidates.' });
    }
});

// POST a new candidate
router.post('/', async (req, res) => {
  try {
<<<<<<< Updated upstream
    // Create a new Candidate instance with the data from the request body
    const newCandidate = new Candidate(req.body)
    // Save the new candidate to the database
    const savedCandidate = await newCandidate.save()
    // const templateData = prepareCandidateAdd()
    // const htmlContent = renderEmailTemplate('enrollStudentAlert', templateData)
    // const mailOptions = {
    //   from: process.env.AUTH_MAIL,
    //   to: newCandidate.email,
    //   subject: 'Candidate Bench List',
    //   html: htmlContent,
    // }
    // await transporter.sendMail(mailOptions)
    // Respond with the newly created candidate data
    res.status(201).json(savedCandidate)
  } catch (err) {
    // Handle validation or other errors
    console.error('Error adding candidate:', err)
    res.status(400).json({ error: err.message })
  }
})
=======
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();

    // --- Email Logic ---
    const templateData = prepareCandidateAdd();
    const htmlContent = renderEmailTemplate('enrollStudentAlert', templateData);
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: newCandidate.email,
      subject: 'Candidate Bench List',
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
>>>>>>> Stashed changes

    // --- ADDED: Notification Logic ---
    const io = req.app.get('io');
    const message = `A new candidate, ${savedCandidate.name}, was added to the bench.`;

    const notification = new Notification({
        title: 'New Candidate Added',
        message: message,
        type: 'success',
        link: '/admin/manage-candidates'
    });
    await notification.save();
    
    io.emit('newCandidateAdded', { message });
    // -------------------------

    res.status(201).json(savedCandidate);
  } catch (err) {
    console.error('Error adding candidate:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET recruiters for search dropdown
router.get('/search', async (request, response) => {
  // ... (logic is correct, no changes needed here)
  try {
    const user = await User.find({ role: 'recruiter' }, { _id: 1, name: 1 });
    response.send({ user });
  } catch (err) {
    response.send(err);
  }
});

// PUT (update) a candidate
router.put('/:id', async (req, res) => {
    // ... (logic is correct, no changes needed here)
    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCandidate) {
            return res.status(404).json({ error: 'Candidate not found.' });
        }
        res.json(updatedCandidate);
    } catch (err) {
        console.error('Error updating candidate:', err);
        res.status(400).json({ error: err.message });
    }
});

// DELETE a candidate
router.delete('/:id', async (req, res) => {
    // ... (logic is correct, no changes needed here)
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