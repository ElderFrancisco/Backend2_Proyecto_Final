import { Router } from 'express';
import passport from 'passport';
import { file, premiumById } from '../../controllers/User.controller.js';
import upload from '../../middlewares/multer.js';

const router = Router();

router.get(
  '/premium/:id',
  passport.authenticate('jwt', { session: false }),
  premiumById,
);
router.post(
  '/premium/:id/documents',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  file,
);

export default router;
