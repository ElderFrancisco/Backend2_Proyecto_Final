import { Router } from 'express';
import {
  createNewCart,
  deleteProductById,
  emptyCartById,
  getCartById,
  getCarts,
  updateManyProducts,
  updateOneCartByIdProduct,
} from '../../controllers/Cart.controller.js';
import passport from 'passport';

const isUserMiddleware = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso no autorizado' });
  }
};

const router = Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createNewCart,
);

router.get(
  '/:cid',
  passport.authenticate('jwt', { session: false }),
  getCartById,
);

router.get('/', passport.authenticate('jwt', { session: false }), getCarts);

router.post(
  '/:cid/product/:pid',
  passport.authenticate('jwt', { session: false }),
  isUserMiddleware,
  updateOneCartByIdProduct,
);

router.delete(
  '/:cid/product/:pid',
  passport.authenticate('jwt', { session: false }),
  deleteProductById,
);

router.put(
  '/:cid',
  passport.authenticate('jwt', { session: false }),
  isUserMiddleware,
  updateManyProducts,
);

router.delete(
  '/:cid',
  passport.authenticate('jwt', { session: false }),
  emptyCartById,
);

export default router;
