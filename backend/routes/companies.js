import express from 'express'
import Company from '../models/Companies.js'

const router = express.Router()

router.get('/', async (request, response) => {
  try {
    const data = await Company.find().sort({ createdAt: -1 })
    response.send(data)
  } catch (err) {
    response.send(err)
  }
})

router.post('/register', async (request, response) => {
  const { id, name, industry, address, email } = request.body
  const company = await Company.findOne({ _id: id, name: name })
  if (company) {
    response.send({ message: 'Company already Registered' })
  } else {
    const newCompany = new Company({
      _id: id,
      name: name,
      industry: industry,
      address: address,
      email: email,
    })
    await newCompany.save()
    response.send({ message: 'Company is Add to zero7technologies' })
  }
})
export default router
