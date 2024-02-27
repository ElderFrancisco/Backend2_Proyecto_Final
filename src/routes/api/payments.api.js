import { Router } from "express";
import passport from "passport";
import { purchaseCartByIdStripe } from "../../controllers/Payment.controller.js";

const router = Router();

router.get(
  "/stripe/checkout/:cid",
  passport.authenticate("jwt", { session: false }),
  purchaseCartByIdStripe
);

export default router;
