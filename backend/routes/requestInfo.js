import express from 'express';
import RequestInfo from '../models/RequestInfo.js';

const router = express.Router();

// GET all submitted requests (for admin)
router.get("/", async (req, res) => {
  try {
    // Sort by creation date, newest first
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
    
    // Notify admin via Socket.IO of a new request
    const io = req.app.get('io');
    io.emit('newInfoRequest', { message: `New candidate request from ${req.body.companyName}` });
    
    res.status(201).json({ message: "Request submitted successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- ADDED ---
// PUT (update) a request's status (for admin actions: approve/reject)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting { status: 'approved' } or { status: 'rejected' }

    // Validate the status value
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status value." });
    }

    // Find the request by ID and update its status
    const updatedRequest = await RequestInfo.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found." });
    }
    
    // Notify admin clients of the status change
    const io = req.app.get('io');
    io.emit('requestStatusChange', updatedRequest);

    res.json({ message: `Request has been ${status}.`, request: updatedRequest });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;