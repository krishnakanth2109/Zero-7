// File: backend/routes/formRoutes.js

import express from "express";
import FormSubmission from "../models/FormSubmission.js";
import Notification from "../models/notifications.js"; // This import will now work correctly

const router = express.Router();

/**
 * @route   POST /api/forms
 * @desc    Submit a new contact form
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const newForm = new FormSubmission(req.body);
    await newForm.save();

    // --- Save Notification to Database ---
    const notification = new Notification({
        title: 'New Contact Message',
        message: `From ${newForm.name} regarding "${newForm.purpose}"`,
        type: 'warning',
        link: '/admin/forms'
    });
    await notification.save();
    // -------------------------------------

    // Emit a real-time event to connected admin clients
    req.app.get("io").emit("newFormSubmission", newForm);

    res.status(201).json(newForm);
  } catch (err) {
    console.error("Error saving form submission:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/forms
 * @desc    Get all form submissions
 * @access  Admin
 */
router.get("/", async (req, res) => {
  try {
    const forms = await FormSubmission.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error("Error fetching form submissions:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;