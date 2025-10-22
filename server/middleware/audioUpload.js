const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Save uploaded audio files to 'uploads/audio' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/audio");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  }
});

const audioUpload = multer({ storage });

module.exports = audioUpload;
