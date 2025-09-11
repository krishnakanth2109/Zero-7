import express from "express";
import FormSubmission from "../models/FormSubmission.js";

const router = express.Router();

// 📌 Submit form
router.post("/", async (req, res) => {
  try {
    const newForm = new FormSubmission(req.body);
    await newForm.save();

    // 🔔 Emit socket.io event
    req.app.get("io").emit("newFormSubmission", newForm);

    res.status(201).json(newForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all submissions
router.get("/", async (req, res) => {
  try {
    const forms = await FormSubmission.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
