import { Router } from 'express';
import passport from 'passport';
import {
  purchaseCartByIdMercadopago,
  purchaseCartByIdStripe,
  successPayment,
  failurePayment,
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

router.get(
  '/failure',
  passport.authenticate('jwt', { session: false }),
  failurePayment,
);

router.post(
  '/create-checkout/mercadopago/:cid',
  passport.authenticate('jwt', { session: false }),
  purchaseCartByIdMercadopago,
);

export default router;
