import {
  renderGetProducts,
  renderGetProductById,
  renderAddProduct,
} from '../controllers/Product.controller.js';

import { Router } from 'express';
import passport from 'passport';

const isAdminOrPremium = (req, res, next) => {
  if (req.user.rol === 'admin' || req.user.rol === 'premium') {
    next();
  } else {
    res.redirect('/login');
  }
};

const router = Router();
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  renderGetProducts,
);
router.get(
  '/add',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  isAdminOrPremium,
  renderAddProduct,
);

router.get(
  '/:pid',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  renderGetProductById,
);

export default router;
