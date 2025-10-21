import { Router } from 'express';
import { createPurchase } from './purchase.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();
router.post('/', authMiddleware, createPurchase);
export default router;
