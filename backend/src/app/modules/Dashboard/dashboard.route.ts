import { Router } from 'express';
import { getDashboard } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();
router.get('/', authMiddleware, getDashboard);
export default router;
