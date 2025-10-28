// File: backend/models/Counter.js

import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  // This _id will be a name for our sequence, e.g., 'candidateId'
  _id: { type: String, required: true },
  // This seq will hold the last number that was used
  seq: { type: Number, default: 0 }
});

export default mongoose.model('Counter', CounterSchema);