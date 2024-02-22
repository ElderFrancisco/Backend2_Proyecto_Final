import webSocketRoute from './websocket.route.js';
import productsRoute from './products.route.js';
import cartsRoute from './cart.route.js';
import sessionRoute from './session.route.js';
import mockingRoute from './mocking.route.js';
import loggerRoute from './logger.route.js';

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
