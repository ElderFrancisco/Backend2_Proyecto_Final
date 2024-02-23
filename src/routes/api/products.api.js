import { Router } from 'express';
import passport from 'passport';
import {
  getProducts,
  addProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from '../../controllers/Product.controller.js';

const isAdminMiddleware = (req, res, next) => {
  if (req.user.user.rol === 'admin' || req.user.user.rol === 'premium') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso no autorizado' });
  }
};

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), getProducts);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdminMiddleware,
  addProduct,
);

router.get(
  '/:pid',
  passport.authenticate('jwt', { session: false }),
  getProductById,
);

router.put(
  '/:pid',
  passport.authenticate('jwt', { session: false }),
  isAdminMiddleware,
  updateProductById,
);

router.delete(
  '/:pid',
  passport.authenticate('jwt', { session: false }),
  isAdminMiddleware,
  deleteProductById,
);

export default router;
