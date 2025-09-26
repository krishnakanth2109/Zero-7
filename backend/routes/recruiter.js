import Recruiter from '../models/Recruiter.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'

dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.MY_SECRET_KEY

// GET all recruiters
router.get('/', async (req, res) => {
  try {
    const recruiters = await Recruiter.find().select('-password')
    res.json(recruiters)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const recruiter = await Recruiter.findOne({ email })
    if (!recruiter)
      return res.status(400).json({ error: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, recruiter.password)
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' })

    const tokenPayload = {
      id: recruiter._id,
      email: recruiter.email,
      role: 'recruiter', // Add the role
    }
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '3h' })

    res.json({
      message: 'Login successful',
      token,
      user: tokenPayload,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// REGISTRATION
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' })
    }
    const existingRecruiter = await Recruiter.findOne({ email })
    if (existingRecruiter)
      return res.status(400).json({ error: 'Recruiter already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newRecruiter = new Recruiter({
      email,
      password: hashedPassword,
    })
    const savedRecruiter = await newRecruiter.save()
    res.status(201).json(savedRecruiter)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// UPDATE a recruiter
router.put('/:id', async (req, res) => {
  try {
    const { email } = req.body
    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      { email },
      { new: true },
    )
    if (!updatedRecruiter)
      return res.status(404).json({ message: 'Recruiter not found' })
    res.json(updatedRecruiter)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE a recruiter
router.delete('/:id', async (req, res) => {
  try {
    const deletedRecruiter = await Recruiter.findByIdAndDelete(req.params.id)
    if (!deletedRecruiter)
      return res.status(404).json({ message: 'Recruiter not found' })
    res.json({ message: 'Recruiter deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
