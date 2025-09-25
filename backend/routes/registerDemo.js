import RegisterDemo from "../models/RegisterDemo.js";
import express from "express";

const router = express.Router()

router.get('/', async (req , res) => {
    try {
        const registerDemo = await RegisterDemo.find();
        res.json(registerDemo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/', async (req , res) => {
    try {
        const {formName , fullName , email , mobileNumber , courseName , message } = req.body;
        const newRegisterDemo = new RegisterDemo({
           formName, fullName , email , mobileNumber , courseName , message
        });
        const savedRegisterDemo = await newRegisterDemo.save();
        res.status(201).json(savedRegisterDemo); 
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

export default router;