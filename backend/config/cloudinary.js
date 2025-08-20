// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// const connectCloudinary = () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
// };

// export default connectCloudinary;

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const validateConfig = () => {
  const required = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY', 
    'CLOUDINARY_API_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing Cloudinary config: ${missing.join(', ')}`);
  }
};

const connectCloudinary = () => {
  try {
    validateConfig();
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true // Always use HTTPS
    });

    console.log('Cloudinary connected successfully');
    return cloudinary;
  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
    throw error; // Re-throw to prevent application startup
  }
};

export default connectCloudinary;