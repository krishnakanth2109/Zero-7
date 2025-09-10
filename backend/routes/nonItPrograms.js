import express from "express";
import NonItProgram from "../models/NonItProgram.js";

const router = express.Router();

// GET all programs
router.get("/", async (req, res) => {
  try {
    const programs = await NonItProgram.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new program
router.post("/", async (req, res) => {
  try {
    const program = new NonItProgram(req.body);
    await program.save();
    res.status(201).json(program);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update program
router.put("/:id", async (req, res) => {
  try {
    const updated = await NonItProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE program
router.delete("/:id", async (req, res) => {
  try {
    await NonItProgram.findByIdAndDelete(req.params.id);
    res.json({ message: "Program deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
