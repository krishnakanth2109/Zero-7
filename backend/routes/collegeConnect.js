import CollegeConncet from "../models/CollegeConncet.js";
import express from "express";

const router = express.Router();

router.get('/', async (req , res) => {
    try {
        const collegeConnect = await CollegeConncet.find();
        res.json(collegeConnect);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/', async (req , res) => {
    try {
        const {formName , collegeName , contactPerson , Email , Phone , ProposalType , Message} = req.body;
        const newCollegeConnect = new CollegeConncet({
            formName , collegeName , contactPerson , Email , Phone , ProposalType , Message
        });
        const savedCollegeConnect = await newCollegeConnect.save();
        res.status(201).json(savedCollegeConnect); 
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

export default router;