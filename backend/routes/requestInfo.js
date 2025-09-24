import express from 'express';
import RequestInfo from '../models/RequestInfo.js';

const router = express.Router();

// GET all submitted requests (for admin)
router.get("/", async (req, res) => {
  try {
    const requests = await RequestInfo.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new info request (from public form)
router.post("/", async (req, res) => {
  try {
    const request = new RequestInfo(req.body);
    await request.save();
    
    // Notify admin via Socket.IO
    const io = req.app.get('io');
    io.emit('newInfoRequest', { message: `New candidate request from ${req.body.companyName}` });
    
    res.status(201).json({ message: "Request submitted successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;