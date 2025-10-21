import { Request, Response } from 'express';
import { z } from 'zod';
import { Purchase } from './purchase.model';
import { Referral } from '../Referral/referral.model';
import { CreditLedger } from './credit.model';

const bodySchema = z.object({
  amount: z.number().positive()
});

export async function createPurchase(req: Request, res: Response) {
  const parse = bodySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { amount } = parse.data;
  const userId = req.user!.id;

  const first = await Purchase.countDocuments({ userId });
  const isFirst = first === 0;

  const purchase = await Purchase.create({ userId, amount, isFirst });

  if (isFirst) {
    const ref = await Referral.findOneAndUpdate(
      { referredUserId: userId, status: 'PENDING' },
      { $set: { status: 'CONVERTED', creditedAt: new Date() } },
      { new: true }
    );

    if (ref) {
      //todo: award credits; unique index handles idempotency (no double credits)
      try {
        await CreditLedger.create([
          { userId: ref.referrerId, amount: 2, reason: 'REFERRAL_FIRST_PURCHASE', meta: `referredUserId:${userId}` },
          { userId, amount: 2, reason: 'REFERRAL_FIRST_PURCHASE', meta: `referrerId:${ref.referrerId}` }
        ], { ordered: false });
      } catch {
      }
    }
  }

  res.status(201).json({ purchase });
}
