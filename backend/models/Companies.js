import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, 'Company ID is required.'],
  },
  name: {
    type: String,
    required: [true, 'Company name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Company email is required.'],
    trim: true,
    lowercase: true,
  },
  industry: {
    type: String,
    required: [true, 'Industry is required.'],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
})

export default mongoose.model('Company', CompanySchema)