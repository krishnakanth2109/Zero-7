// File: backend/routes/requestInfo.js

import express from 'express';
import RequestInfo from '../models/RequestInfo.js';
import Candidate from '../models/Candidate.js'; // <-- IMPORT CANDIDATE MODEL
import transporter from '../utils/mail.js';     // <-- IMPORT NODEMAILER TRANSPORTER
import { renderEmailTemplate, prepareCandidateDetailsForRequester } from '../utils/emailTemplates.js'; // <-- IMPORT EMAIL UTILS

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
    
    const io = req.app.get('io');
    io.emit('newInfoRequest', { message: `New candidate request from ${req.body.companyName}` });
    
    res.status(201).json({ message: "Request submitted successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (update) a request's status (for admin actions: approve/reject)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status value." });
    }

    const updatedRequest = await RequestInfo.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found." });
    }
    
    // --- START: NEW EMAIL SENDING LOGIC ON APPROVAL ---
    if (status === 'approved') {
        try {
            // 1. Find the full details of the requested candidate by name
            const candidate = await Candidate.findOne({ name: updatedRequest.candidateName });

            if (candidate) {
                // 2. Prepare data for the email template
                const templateData = prepareCandidateDetailsForRequester(updatedRequest, candidate);

                // 3. Render the HTML content for the email
                const htmlContent = renderEmailTemplate('candidateDetails', templateData);

                // 4. Configure mail options
                const mailOptions = {
                    from: process.env.AUTH_MAIL,
                    to: updatedRequest.email, // Send to the person who made the request
                    subject: `Candidate Information Approved: ${candidate.name}`,
                    html: htmlContent,
                };

                // 5. Send the email
                await transporter.sendMail(mailOptions);
                console.log(`✅ Candidate details for '${candidate.name}' sent to ${updatedRequest.email}.`);
            } else {
                console.error(`⚠️ Candidate '${updatedRequest.candidateName}' not found for approved request ID ${id}. Email could not be sent.`);
            }
        } catch (emailError) {
            console.error(`❌ Failed to send candidate details email for request ID ${id}:`, emailError);
            // We don't fail the API request here, just log the email error.
            // The status update itself was successful.
        }
    }
    // --- END: NEW EMAIL SENDING LOGIC ---

    const io = req.app.get('io');
    io.emit('requestStatusChange', updatedRequest);

    res.json({ message: `Request has been ${status}.`, request: updatedRequest });

  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: 'Server error while updating request.' });
  }
});

export default router;