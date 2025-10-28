// File: backend/models/Batch.js

import mongoose from 'mongoose'
const { Schema } = mongoose

const BatchSchema = new Schema(
  {
    course: { type: String, required: true },
    // MODIFICATION: Optional field for the demo date.
    demoDate: { type: Date, required: false },
    // MODIFICATION: Renamed from 'date' to be more specific.
    batchStartDate: { type: Date, required: true },
    duration: { type: String, required: true },
    // MODIFICATION: Renamed from 'timing' to 'mode' to better reflect its purpose.
    mode: { type: String, required: true },
    trainer: { type: String, required: true },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
)

export default mongoose.model('Batch', BatchSchema)