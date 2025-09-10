import express from "express";
import ItProgram from "../models/ItProgram.js";

const router = express.Router();

// ✅ GET all programs
router.get("/", async (req, res) => {
  try {
    const programs = await ItProgram.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST new program
router.post("/", async (req, res) => {
  try {
    const newProgram = new ItProgram(req.body);
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ PUT update program by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProgram = await ItProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProgram) return res.status(404).json({ error: "Program not found" });
    res.json(updatedProgram);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE program by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProgram = await ItProgram.findByIdAndDelete(req.params.id);
    if (!deletedProgram) return res.status(404).json({ error: "Program not found" });
    res.json({ message: "Program deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
