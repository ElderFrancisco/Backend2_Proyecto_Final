import {
  renderGetProducts,
  renderGetProductById,
  renderAddProduct,
  renderOwnerProducts,
  renderOwnerProductModify,
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
  '/ownerproducts',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  isAdminOrPremium,
  renderOwnerProducts,
);
router.get(
  '/modify/:pid',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  isAdminOrPremium,
  renderOwnerProductModify,
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
