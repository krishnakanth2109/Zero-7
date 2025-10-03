import express from 'express'
import Company from '../models/Companies.js'

const router = express.Router()

// GET all companies
router.get('/', async (request, response) => {
  try {
    // Using .lean() for faster read operations when you don't need Mongoose documents
    const data = await Company.find().sort({ name: 1 }).lean()
    response.status(200).json(data)
  } catch (err) {
    console.error('Error fetching companies:', err)
    response.status(500).json({ message: 'Server error' })
  }
})

// POST a new company
router.post('/register', async (request, response) => {
  const { _id, name, industry, address, email } = request.body

  // Basic validation
  if (!_id || !name || !email || !industry) {
    return response.status(400).json({ message: 'All required fields must be provided.' })
  }

  try {
    const companyExists = await Company.findOne({ _id: _id })
    if (companyExists) {
      return response.status(409).json({ message: 'Company with this ID already exists.' })
    }

    const newCompany = new Company({
      _id,
      name,
      industry,
      address,
      email,
    })

    const savedCompany = await newCompany.save()
    response.status(201).json({ message: 'Company added successfully!', company: savedCompany })
  } catch (err) {
    console.error('Error registering company:', err)
    response.status(500).json({ message: 'Server error' })
  }
})

// DELETE a company by its ID
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const deletedCompany = await Company.findByIdAndDelete(id)

    if (!deletedCompany) {
      return response.status(404).json({ message: 'Company not found.' })
    }

    response.status(200).json({ message: 'Company deleted successfully.' })
  } catch (err) {
    console.error('Error deleting company:', err)
    response.status(500).json({ message: 'Server error' })
  }
})

export default router