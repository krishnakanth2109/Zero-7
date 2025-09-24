import mongoose from 'mongoose'

const Admin = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetOTP: { type: String },
  passwordResetExpires: { type: Date },
})

export default mongoose.model('Admin', Admin)
