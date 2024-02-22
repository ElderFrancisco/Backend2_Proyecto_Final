import {
  renderGetProducts,
  renderGetProductById,
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
    '/:pid',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login',
    }),
    renderGetProductById,
  );
export default router
