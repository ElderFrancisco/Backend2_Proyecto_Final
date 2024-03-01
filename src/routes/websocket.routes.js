import { Router } from 'express';
import { chat } from '../controllers/Socket.controller.js';
import passport from 'passport';

const isUserMiddleware = (req, res, next) => {
  if (req.user.rol === 'premium' || req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).redirect('/premium');
  }
};

const router = Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  isUserMiddleware,
  chat,
);
export default router;
