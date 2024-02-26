import multer from 'multer';

import __dirname from '../utils.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body.type);
    let uploadPath = __dirname + '/public/documents'; // Por defecto, sube a la carpeta 'documents'
    if (req.body.type === 'product') {
      uploadPath = __dirname + '/public/documents/products';
      console.log('product');
    } else if (req.body.type === 'profile') {
      uploadPath = __dirname + '/public/documents/profiles';
      console.log('profile');
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;
