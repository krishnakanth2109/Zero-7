import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, require: true, unique: true },
  role: { type: String, require: true },
  employeeId: { type: String, require: true },
  password: { type: String, require: true },
  passwordResetOTP: { type: String },
  passwordResetExpires: { type: Date },
})

export default mongoose.model('Users', UserSchema)
