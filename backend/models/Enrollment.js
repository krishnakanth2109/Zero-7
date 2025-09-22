import mongoose from 'mongoose';
const { Schema } = mongoose;

const EnrollmentSchema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    resume: { type: String, required: true }, // Stores the path to the uploaded file
}, { timestamps: true });

export default mongoose.model('Enrollment', EnrollmentSchema);