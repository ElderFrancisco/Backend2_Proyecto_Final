import passport from 'passport';
import { Router } from 'express';
import { renderGetCartById } from '../controllers/Cart.controller.js';

const router = Router();

router.get(
  '/:cid',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  renderGetCartById,
);
export default router;
