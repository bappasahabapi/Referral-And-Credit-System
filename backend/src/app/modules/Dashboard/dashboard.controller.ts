import { Request, Response } from 'express';
import { Referral } from '../Referral/referral.model';
import { CreditLedger } from '../Purchase/credit.model';
import { User } from '../User/user.model';
import mongoose from 'mongoose';

export async function getDashboard(req: Request, res: Response) {
  const userId = req.user!.id;

  const [totalReferred, converted, creditsSum, me] = await Promise.all([
    Referral.countDocuments({ referrerId: userId }),
    Referral.countDocuments({ referrerId: userId, status: 'CONVERTED' }),
     CreditLedger.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]),
    User.findById(userId)
  ]);

  const totalCreditsEarned = creditsSum.length ? creditsSum[0].total : 0;
  const base = process.env.APP_BASE_URL || 'http://localhost:4000';
  const referralLink = `${base}/signup?ref=${me?.referralCode}`;

  res.json({
    totalReferredUsers: totalReferred,
    referredUsersWhoPurchased: converted,
    totalCreditsEarned,
    referralLink
  });
}
