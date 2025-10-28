// File: backend/config/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with your credentials from the .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for storage
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes', // This will create a 'resumes' folder in your Cloudinary account
    resource_type: 'raw', // Important: Tells Cloudinary to treat this as a generic file
    // --- THIS IS THE CORRECT PLACE FOR VALIDATION ---
    // Cloudinary will automatically reject any file that isn't a pdf or docx.
    allowed_formats: ['pdf', 'docx'],
  },
});

export { cloudinary, resumeStorage };