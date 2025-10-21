# Devlopment Plan Exectuation

Follow these steps to build the backend systematically first.

required endpoints:

- `POST` /api/auth/signup → { token, user }  

- `POST` /api/auth/login → { token, user }

- `GET` /api/referrals **(auth)** → { referrals: [...] }

- `GET` /api/referrals/link **(auth)** → { referralCode, - referralLink }

- `POST` /api/purchases **(auth)** 
    → body { amount: number } → { purchase }

- `GET` /api/dashboard **(auth)** 
    → { totalReferredUsers, referredUsersWhoPurchased, totalCreditsEarned, referralLink }

#### 1.Project setup:** 
- Initialize a new Node.js project (npm init -y).
- Install dependencies: express, mongoose, typescript, ts-node, bcryptjs, jsonwebtoken, dotenv, cors. swagger docs, 

```
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.6.3",
    "swagger-ui-express": "^5.0.1",
    "zod": "^3.23.8"
  },

```
- Set up a tsconfig.json file for TypeScript compilation.


####  2. Database Schema & Connection**

- Create a configuration file and connect to my MongoDB database using environment variables.

  - `config/index.ts` 
  - `DB/index.ts`

####  3. User Authentication

- Registration | SignUp
  - `router.use("/auth", authRouter);`

- Create the controller and service for user registration.

- In the service, hash the user's password using bcryptjs before saving it.

- Generate a unique referral code (e.g., USERNAME + random numbers) and save it to the new user's document.

- If a referralCode is included in the request, create a Referral document to link the new user to their referrer with a pending status.


- `Login (/auth/login):`

  - Create the controller and service for login.

  - Find the user by email, compare the hashed password, and if valid, generate a JSON Web Token (JWT).

  ####  4. Purchase & Referral Logic

- When a referred user completes their first purchase, both the referrer and the referred user earn 2 credits each.
- All subsequent purchases must not issue additional referral credits.

- 1️⃣ Check if user has made previous purchases
  - Count existing Purchase records for the userId 
  - The system only issues referral credits on the first purchase. 
- 2️⃣ Record the purchase
  - insert a new record in Purchase with { userId, amount, isFirst }.
  - allows purchase history tracking and analytics.
- 3️⃣ If first purchase → handle referral credit logic
  - Update referral status
  - findOneAndUpdate({ referredUserId, status:'PENDING' }) → {status:'CONVERTED'}
  - Atomic update ensures the referral is converted once and only once.

-  Credit both users
    - Create two entries in CreditLedger — one for the referrer, one for the referred user.
    - Keeps a consistent ledger of credit transactions (acts like double-entry bookkeeping).  
- 4️⃣ If user was referred and referral was pending

Create a global error handling middleware to catch any errors thrown by your services and send back a consistent, formatted error response

🚀 **Example Scenario: Lina → Ryan**

| Action                              | System Behavior                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| Lina signs up → gets code `LINA123` | Stored in `User.referralCode`                                                    |
| Ryan signs up using `LINA123`       | Creates `Referral(PENDING)`                                                      |
| Ryan makes 1st purchase             | Purchase created → Referral converted → Credits issued: **Lina +2**, **Ryan +2** |
| Ryan makes 2nd purchase             | Purchase recorded, **no credits issued**                                         |

🧮 **Dashboard Impact**

After Ryan’s first purchase:


| Metric                      | Value | Source                                                                |
| --------------------------- | ----- | --------------------------------------------------------------------- |
| `totalReferredUsers`        | 1     | `Referral.countDocuments({referrerId})`                               |
| `referredUsersWhoPurchased` | 1     | `Referral.countDocuments({referrerId, status:'CONVERTED'})`           |
| `totalCreditsEarned`        | 2     | `CreditLedger.aggregate({$match:{userId:referrerId}, $sum:'amount'})` |
