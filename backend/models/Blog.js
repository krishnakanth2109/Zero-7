// File: backend/models/Blog.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const BlogSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Blog', BlogSchema);