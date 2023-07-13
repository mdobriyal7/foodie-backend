const cloudinary = require("cloudinary").v2;;

console.log(process.env.CLOUDINARY_API_KEY)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:688331351542189,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


