import {
  renderGetProducts,
  renderGetProductById,
  renderAddProduct,
} from '../controllers/Product.controller.js';

import { Router } from 'express';
import passport from 'passport';

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
  '/file',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
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
