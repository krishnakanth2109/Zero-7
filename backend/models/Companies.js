import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  address: { type: String },
})
export default mongoose.model('Company', CompanySchema)
