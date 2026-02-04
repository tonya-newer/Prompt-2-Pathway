const multer = require('multer');
const path = require('path');
const fs = require('fs');

const allowedImageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/x-icon',
  'image/tiff',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.fieldname === 'image';
    const dir = isImage
      ? path.join(__dirname, '../uploads/images')
      : path.join(__dirname, '../uploads/audio');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.fieldname === 'image' ? '.png' : '');
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    return allowedImageTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Invalid image type'), false);
  }
  cb(null, true);
};

const assessmentUpload = multer({ storage, fileFilter });

module.exports = assessmentUpload;
