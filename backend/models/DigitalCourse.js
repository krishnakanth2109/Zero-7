// File: backend/models/DigitalCourse.js

import mongoose from 'mongoose';

const digitalCourseSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true, // Needed for filtering on the frontend
    trim: true
  },
  paragraph: {
    type: String,
    required: true
  },
  image: {
    type: String, // Storing the Image URL string
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 4.5
  }
}, {
  timestamps: true 
});

const DigitalCourse = mongoose.model('DigitalCourse', digitalCourseSchema);

export default DigitalCourse;