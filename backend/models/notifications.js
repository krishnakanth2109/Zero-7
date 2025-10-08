// File: backend/models/Notification.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['info', 'success', 'warning', 'error'] // Defines the possible notification styles
    },
    link: {
        type: String,
        required: true // The target URL in the admin panel
    },
    unread: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.model('Notification', NotificationSchema);