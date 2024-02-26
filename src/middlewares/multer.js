import multer from 'multer';

import __dirname from '../utils.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'src/public/documents'; // Por defecto, sube a la carpeta 'documents'
    if (req.body.type === 'product') {
      uploadPath = 'src/public/documents/products';
    } else if (req.body.type === 'profile') {
      uploadPath = 'src/public/documents/profiles';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;
