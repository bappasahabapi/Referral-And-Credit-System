import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "../User/user.model";
import { Referral } from "../Referral/referral.model";
import { signJwt } from "../../utils/jwt";
import { generateReferralCode } from "../../utils/referral";

const signupBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  referralCode: z.string().optional(),
});

export async function signup(req: Request, res: Response) {
  const parse = signupBody.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const { email, password, name, referralCode } = parse.data;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);

  //!fix need to fix generate a unique referral code 
  let code = generateReferralCode();
  while (await User.exists({ referralCode: code })) {
    code = generateReferralCode();
  }

  let referredById: any = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (!referrer)
      return res.status(400).json({ error: "Invalid referral code" });
    referredById = referrer._id;
  }

  const user = await User.create({
    email,
    passwordHash,
    name,
    referralCode: code,
    referredById,
  });

  if (referredById) {
    await Referral.create({
      referrerId: referredById,
      referredUserId: user._id,
      status: "PENDING",
    });
  }

  const token = signJwt({ id: String(user._id), email: user.email });
  return res
    .status(201)
    .json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
      },
    });
}

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(req: Request, res: Response) {
  const parse = loginBody.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signJwt({ id: String(user._id), email: user.email });
  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      referralCode: user.referralCode,
    },
  });
}
