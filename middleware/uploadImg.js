// middleware/uploadMiddleware.js

const multer = require("multer");
const path = require("path");

// Define a function to create storage configuration for Multer
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      // Define the destination directory for storing uploaded images
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      // Define the filename for the uploaded image
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Create a function to initialize Multer instance with custom storage configuration
const initMulter = (destination, fileSize) => {
  const storage = createStorage(destination);
  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * fileSize,
    },
    fileFilter: fileFilter,
  });
};

// Middleware function for handling file uploads
const uploadImg = (destination, fileSize) => {
  const upload = initMulter(destination, fileSize).single("image");
  return upload;
};

module.exports = uploadImg;
