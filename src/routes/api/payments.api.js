import { Router } from 'express';
import passport from 'passport';
import {
  purchaseCartByIdStripe,
  successPayment,
} from '../../controllers/Payment.controller.js';

const router = Router();

router.post(
  '/create-checkout/stripe/:cid',
  passport.authenticate('jwt', { session: false }),
  purchaseCartByIdStripe,
);
router.get(
  '/success/:tid',
  passport.authenticate('jwt', { session: false }),
  successPayment,
);

export default router;
