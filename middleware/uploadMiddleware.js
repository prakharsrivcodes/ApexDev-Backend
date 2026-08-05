const multer = require('multer');
const path = require('path');

// Configure WHERE and HOW uploaded files get stored on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // files will be saved in a folder called "uploads"
  },
  filename: (req, file, cb) => {
    // Create a unique filename: timestamp + original extension
    // e.g. 1712345678-screenshot.png (avoids overwriting files with same name)
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Only allow image files (jpg, png, etc.)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // accept file
  } else {
    cb(new Error('Only image files are allowed'), false); // reject file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;