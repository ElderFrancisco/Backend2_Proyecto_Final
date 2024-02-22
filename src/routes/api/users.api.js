import { Router } from 'express';
import passport from 'passport';
import { premiumById } from '../../controllers/User.controller.js';

const router = Router();

router.get(
  '/premium/:id',
  passport.authenticate('jwt', { session: false }),
  premiumById,
);

export default router;
