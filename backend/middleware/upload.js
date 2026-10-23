const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanName = `fundus_${Date.now()}_${uuidv4().slice(0, 8)}${ext}`;
    cb(null, cleanName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid retinal image file. Only JPEG, PNG, or WEBP image formats are accepted.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB maximum
  }
});

module.exports = upload;
