import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

dotenv.config()

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//  LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Request body:", req.body);

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) return res.status(400).json({ error: "Recruiter not found" });

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
 
    const token = jwt.sign(
      { id: recruiter._id, email: recruiter.email },
      JWT_SECRET,
      { expiresIn: "3h" } 
    );

    res.json({
      message: "Login successful",
      token,
      recruiter: recruiter
    });  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//  REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { email, password} = req.body;

    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) return res.status(400).json({ error: "Recruiter  already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRecruiter = new Recruiter({
      email,
      password: hashedPassword
    });

    const savedRecruiter = await newRecruiter.save();

    res.status(201).json({
      message: "Recruiter registered successfully",
      recruiter: savedRecruiter
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;