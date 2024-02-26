import webSocketRoute from './websocket.routes.js';
import productsRoute from './products.routes.js';
import cartsRoute from './cart.routes.js';
import sessionRoute from './session.routes.js';
import mockingRoute from './mocking.routes.js';
import loggerRoute from './logger.routes.js';

import api from './api/index.js';

import { Router } from 'express';
import { notFound } from '../controllers/NotFound.controller.js';
import { accessPublicWithoutAuth, authToHome } from '../util/jwt.js';
const router = Router();

router.use('/chat', webSocketRoute);
router.use('/cart', cartsRoute);
router.use('/products', productsRoute);
router.use('/', sessionRoute);
router.use('/loggerTest', loggerRoute);
router.use('/mockingproducts', mockingRoute);

router.use('/api', api);

router.use('*', authToHome, notFound);
export default router;
