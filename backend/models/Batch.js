// File: backend/models/Batch.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const BatchSchema = new Schema({
    course: { type: String, required: true },
    date: { type: String, required: true },
    timing: { type: String, required: true },
    trainer: { type: String, required: true },
    demo: { type: String, required: true, enum: ['Yes', 'No'], default: 'No' },
}, { timestamps: true });

export default mongoose.model('Batch', BatchSchema);