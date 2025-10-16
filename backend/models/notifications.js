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
        enum: ['info', 'success', 'warning', 'error']
    },
    link: {
        type: String,
        required: true
    },
    unread: {
        type: Boolean,
        default: true
    },
    // --- ADDED: This field links the notification to a user ---
    // It stores the ID of a document from the 'User' collection.
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This tells Mongoose to reference the 'User' model
        required: false // Optional, as some notifications might be system-generated
    }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);