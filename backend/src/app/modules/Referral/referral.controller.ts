import { Request, Response } from "express";
import { User } from "../User/user.model";
import { Referral } from "./referral.model";

export async function listReferrals(req: Request, res: Response) {
  const userId = req.user!.id;
  const items = await Referral.find({ referrerId: userId })
    .sort({ createdAt: -1 })
    .populate("referredUserId", "email name createdAt");
  res.json({ referrals: items });
}

export async function referralLink(req: Request, res: Response) {
  const user = await User.findById(req.user!.id);
  const base = process.env.APP_BASE_URL || "http://localhost:4000";
  const link = `${base}/signup?ref=${user?.referralCode}`;
  res.json({ referralCode: user?.referralCode, referralLink: link });
}
