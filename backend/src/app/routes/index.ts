import { Router } from 'express';
import authRouter from '../modules/Auth/auth.route';
import referralRouter from '../modules/Referral/referral.route';
import purchaseRouter from '../modules/Purchase/purchase.route';
import dashboardRouter from '../modules/Dashboard/dashboard.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/referrals', referralRouter);
router.use('/purchases', purchaseRouter);
router.use('/dashboard', dashboardRouter);

export default router;
