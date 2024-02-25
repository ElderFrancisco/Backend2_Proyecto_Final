import { Router } from 'express';
import passport from 'passport';
import {
  current,
  forgotPassword,
  githubcallback,
  login,
  logout,
  register,
  restorePassword,
} from '../../controllers/Session.controller.js';

const router = Router();

router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/authfailed' }),
  login,
);

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/authfailed' }),
  register,
);

router.get(
  '/login-github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/authfailed' }),
  githubcallback,
);

router.get(
  '/logout',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login',
  }),
  logout,
);

router.get(
  '/current',
  passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
  current,
);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:id/:code', restorePassword);
export default router;
