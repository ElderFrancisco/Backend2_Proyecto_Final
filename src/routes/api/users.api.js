import { Router } from 'express';
import passport from 'passport';
import { file, premiumById } from '../../controllers/User.controller.js';
import upload from '../../middlewares/multer.js';

const router = Router();

const isAlreadyPremiumOrAdminMiddleware = (req, res, next) => {
  const user = req.user;
  if (user.rol === 'premium' || user.rol === 'admin') {
    return res.status(400).json({
      status: 'error',
      message: 'User already premium or admin',
    });
  }
  next();
};

router.get(
  '/premium/:id',
  passport.authenticate('jwt', { session: false }),
  isAlreadyPremiumOrAdminMiddleware,
  premiumById,
);
router.post(
  '/premium/:id/documents',
  passport.authenticate('jwt', { session: false }),
  isAlreadyPremiumOrAdminMiddleware,
  upload.array('file'),
  file,
);

export default router;
