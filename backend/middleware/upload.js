const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Use memory storage so sharp can process before writing to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Middleware to compress and save images after multer
const compressAndSave = (type = 'property') => async (req, res, next) => {
  const uploadPath = path.join(__dirname, '../uploads/images');
  ensureDir(uploadPath);

  try {
    // Handle single file (avatar)
    if (req.file) {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      await sharp(req.file.buffer)
        .resize(type === 'avatar' ? 400 : 1200, type === 'avatar' ? 400 : 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(uploadPath, filename));
      req.file.filename = filename;
    }

    // Handle multiple files (property images)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        await sharp(file.buffer)
          .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(uploadPath, filename));
        file.filename = filename;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = upload;
module.exports.compressAndSave = compressAndSave;
