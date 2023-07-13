const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

// Set up multer and cloudinary for image uploading 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
  folder: "ecommerce/products",
  allowedFormats: ["jpg", "png","svg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

   
const parser = multer({ storage: storage, fileFilter: multerFilter, });


module.exports = parser;
