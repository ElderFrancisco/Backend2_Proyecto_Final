import { Router } from 'express';
import passport from 'passport';
import {
  deleteInactiveUsers,
  file,
  getUsers,
  premiumById,
  deleteById,
  makeUserById,
} from '../../controllers/User.controller.js';
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
const isAdmin = (req, res, next) => {
  if (req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso no autorizado, only admin' });
  }
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

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getUsers,
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteInactiveUsers,
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteById,
);
router.put(
  '/returnToUser/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  makeUserById,
);

export default router;
