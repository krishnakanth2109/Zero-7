import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,    // ✅ Consistent naming
  api_key: process.env.CLOUDINARY_API_KEY,          // ✅ Consistent naming
  api_secret: process.env.CLOUDINARY_API_SECRET,    // ✅ Consistent naming
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zero7_blog_images',
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

export { cloudinary, storage };