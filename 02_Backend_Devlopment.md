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

- **Project setup:** 
- include installing all npm packages.
- Initialize a new Node.js project (npm init -y).

- Install dependencies: express, mongoose, typescript, ts-node, bcryptjs, jsonwebtoken, dotenv, cors. swagger docs

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
