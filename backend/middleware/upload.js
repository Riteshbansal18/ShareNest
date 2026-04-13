const multer = require('multer');
const path = require('path');

// Use Cloudinary in production, local disk in development
const isProduction = process.env.NODE_ENV === 'production';

let upload;

if (isProduction) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'sharenest',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 80, fetch_format: 'webp' }],
    },
  });

  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

} else {
  const fs = require('fs');
  const sharp = require('sharp');

  const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

  const storage = multer.memoryStorage();
  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

  const compressAndSave = (type = 'property') => async (req, res, next) => {
    const uploadPath = path.join(__dirname, '../uploads/images');
    ensureDir(uploadPath);
    try {
      if (req.file) {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        await sharp(req.file.buffer)
          .resize(type === 'avatar' ? 400 : 1200, type === 'avatar' ? 400 : 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(uploadPath, filename));
        req.file.filename = filename;
        req.file.path = `/uploads/images/${filename}`;
      }
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
          await sharp(file.buffer)
            .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(uploadPath, filename));
          file.filename = filename;
          file.path = `/uploads/images/${filename}`;
        }
      }
      next();
    } catch (err) { next(err); }
  };

  upload.compressAndSave = compressAndSave;
}

// In production, Cloudinary gives us path directly — no compress needed
const compressAndSave = (type = 'property') => async (req, res, next) => {
  if (!isProduction) return upload.compressAndSave(type)(req, res, next);

  // Cloudinary already processed — just fix filename/path references
  if (req.file) {
    req.file.filename = req.file.path; // Cloudinary URL
  }
  if (req.files) {
    req.files.forEach(f => { f.filename = f.path; });
  }
  next();
};

module.exports = upload;
module.exports.compressAndSave = compressAndSave;
