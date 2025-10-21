import { Router } from "express";
import { listReferrals, referralLink } from "./referral.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
router.get("/", authMiddleware, listReferrals);
router.get("/link", authMiddleware, referralLink);
export default router;
