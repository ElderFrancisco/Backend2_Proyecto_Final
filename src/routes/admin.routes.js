import passport from 'passport';
import { Router } from 'express';
import {
  renderAdminUsers,
  renderAdmin,
} from '../controllers/User.controller.js';

const router = Router();

const isAdminMiddleware = (req, res, next) => {
  if (req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).redirect('/products');
  }
};
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  isAdminMiddleware,
  renderAdmin,
);

router.get(
  '/users',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  isAdminMiddleware,
  renderAdminUsers,
);
export default router;
