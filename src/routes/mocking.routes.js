import { Router } from 'express';
import { mocking100products } from '../controllers/Mocking.controller.js';

const router = Router();

router.post('/', mocking100products);

router.post('/:number', mocking100products);

export default router;
