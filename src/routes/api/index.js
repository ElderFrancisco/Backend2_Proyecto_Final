import cartsApi from './carts.api.js';
import productsApi from './products.api.js';
import sessionsApi from './session.api.js';
import usersApi from './users.api.js';

import { Router } from 'express';
const router = Router();

router.use('/carts', cartsApi);
router.use('/session', sessionsApi);
router.use('/users', usersApi);

router.use('/products', productsApi);

export default router;
