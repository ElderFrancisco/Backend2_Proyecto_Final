import { Router } from 'express';
import {chat} from '../controllers/Socket.controller.js';
import passport from 'passport';


const isUserMiddleware = (req, res, next) => {
  if (req.user.user.rol !== 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso no autorizado' });
  }
};



  const router = Router();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
    isUserMiddleware,
    chat,
  );
 export default router
