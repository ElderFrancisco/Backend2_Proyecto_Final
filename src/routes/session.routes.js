import { Router } from 'express';
import passport from 'passport';
import { accessPublicWithoutAuth, authToHome } from '../util/jwt.js';
import {
  Render404,
  RenderAuthfailed,
  RenderCambios,
  RenderCurrent,
  RenderHome,
  RenderLogin,
  RenderRegister,
  RenderRestorePassword,
  RenderforgotPassword,
  premium,
} from '../controllers/Session.controller.js';

const router = Router();
router.get('/', authToHome, RenderHome);

router.get('/register', accessPublicWithoutAuth, RenderRegister);

router.get('/login', accessPublicWithoutAuth, RenderLogin);

router.get('/authfailed', accessPublicWithoutAuth, RenderAuthfailed);

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  RenderCurrent,
);
router.get('/reset-password/:id/:code', RenderRestorePassword);
router.get('/forgot-password', RenderforgotPassword);
router.get('/404', Render404);
router.get(
  '/premium',
  passport.authenticate('jwt', { session: false }),
  premium,
);
router.get('/cambios', accessPublicWithoutAuth, RenderCambios);

export default router;
