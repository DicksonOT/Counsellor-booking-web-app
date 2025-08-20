import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

// Safer directory creation
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
