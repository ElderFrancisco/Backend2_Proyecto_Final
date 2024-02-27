import passport from 'passport';
import { Router } from 'express';
import { purchaseView } from '../controllers/Purchase.controller.js';

const router = Router();

router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  purchaseView,
);
export default router;
