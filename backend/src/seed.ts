import dotenv from "dotenv";
dotenv.config();
import  connectMongo  from "./app/DB";
// import { connectMongo } from "./app/DB";
import { User } from "./app/modules/User/user.model";
import { Referral } from "./app/modules/Referral/referral.model";
import { CreditLedger } from "./app/modules/Purchase/credit.model";
import { Purchase } from "./app/modules/Purchase/purchase.model";
import bcrypt from "bcryptjs";

async function seed() {
  await connectMongo();

  // Clean old data
  await Promise.all([
    User.deleteMany({}),
    Referral.deleteMany({}),
    CreditLedger.deleteMany({}),
    Purchase.deleteMany({})
  ]);

  // --- Create main referrer: Lina ---
  const lina = await User.create({
    name: "Lina Rivera",
    email: "lina@example.com",
    passwordHash: await bcrypt.hash("lina123", 10),
    referralCode: "LINA123"
  });

  // --- Create 10 referred users ---
  const referredUsers = [];
  for (let i = 1; i <= 10; i++) {
    const u = await User.create({
      name: `User${i}`,
      email: `user${i}@example.com`,
      passwordHash: await bcrypt.hash("password", 10),
      referralCode: `USER${i}CODE`,
      referredById: lina._id
    });
    referredUsers.push(u);

    await Referral.create({
      referrerId: lina._id,
      referredUserId: u._id,
      status: i <= 4 ? "CONVERTED" : "PENDING", // 4 converted users
      creditedAt: i <= 4 ? new Date() : null
    });

    // First 4 users purchased -> credit both sides
    if (i <= 4) {
      await Purchase.create({
        userId: u._id,
        amount: 4999,
        isFirst: true
      });
      await CreditLedger.create({
        userId: lina._id,
        amount: 2,
        reason: "REFERRAL_FIRST_PURCHASE",
        meta: `referredUserId:${u._id}`
      });
      await CreditLedger.create({
        userId: u._id,
        amount: 2,
        reason: "REFERRAL_FIRST_PURCHASE",
        meta: `referrerId:${lina._id}`
      });
    }
  }

  console.log("✅ Seed data inserted successfully!");
  console.log("Lina's referral link: http://localhost:4000/signup?ref=LINA123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
