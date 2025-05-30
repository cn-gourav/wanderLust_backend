const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET

});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', // The folder in your Cloudinary account where images will be stored
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
  },
});

module.exports = {cloudinary, storage};
// This module exports the configured Cloudinary instance and storage for use in other parts of the application.