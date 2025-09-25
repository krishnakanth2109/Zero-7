import Manager from "../models/Manager.js";
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

    const manager = await Manager.findOne({ email });
    if (!manager) return res.status(400).json({ error: "Manager not found" });

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
 
    const token = jwt.sign(
      { id: manager._id, email: manager.email },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({
      message: "Login successful",
      token,
      manager: {
        id: manager._id,
        email: manager.email,
        name: manager.name,
        assigned_Company: manager.assigned_Company,
        age: manager.age,
        phone: manager.phone,
        employeeID: manager.employeeID
      }
    });  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//  REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, assigned_Company, age, phone, employeeID } = req.body;

    const existingManager = await Manager.findOne({ email });
    if (existingManager) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newManager = new Manager({
      email,
      password: hashedPassword,
      name,
      assigned_Company,
      age,
      phone,
      employeeID
    });

    const savedManager = await newManager.save();

    res.status(201).json({
      message: "Manager registered successfully",
      manager: {
        id: savedManager._id,
        email: savedManager.email,
        name: savedManager.name,
        assigned_Company: savedManager.assigned_Company,
        age: savedManager.age,
        phone: savedManager.phone,
        employeeID: savedManager.employeeID
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
