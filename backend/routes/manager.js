import Manager from '../models/Manager.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'

dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.MY_SECRET_KEY

// GET all managers
router.get('/', async (req, res) => {
  try {
    const managers = await Manager.find().select('-password')
    res.json(managers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const manager = await Manager.findOne({ email })
    if (!manager) return res.status(400).send({ error: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, manager.password)
    if (!isMatch) return res.status(400).send({ error: 'Invalid credentials' })

    const tokenPayload = {
      id: manager._id,
      email: manager.email,
      name: manager.name,
      role: 'manager', // Add the role
    }
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '3h' })

    res.send({
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
    const { email, password, name, assigned_Company, age, phone, employeeID } =
      req.body
    const existingManager = await Manager.findOne({ email })
    if (existingManager)
      return res.status(400).json({ error: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newManager = new Manager({
      email,
      password: hashedPassword,
      name,
      assigned_Company,
      age,
      phone,
      employeeID,
    })
    const savedManager = await newManager.save()
    res.status(201).send(savedManager)
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: 'Server error' })
  }
})

// UPDATE a manager
router.put('/:id', async (req, res) => {
  try {
    const updatedManager = await Manager.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!updatedManager)
      return res.status(404).send({ message: 'Manager not found' })
    res.json(updatedManager)
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: 'Server error' })
  }
})

// DELETE a manager
router.delete('/:id', async (req, res) => {
  try {
    const deletedManager = await Manager.findByIdAndDelete(req.params.id)
    if (!deletedManager)
      return res.status(404).send({ message: 'Manager not found' })
    res.json({ message: 'Manager deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: 'Server error' })
  }
})

export default router
