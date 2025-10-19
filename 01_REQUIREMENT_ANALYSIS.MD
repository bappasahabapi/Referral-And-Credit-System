#   SDLC & Architecture Guide

<b>FileSure Referral & Credit System</b>

###  Executive summary
A full-stack referral & credit platform:
- `Backend`: Node.js (TypeScript), Express, MongoDB (Mongoose), JWT auth, Swagger docs.

- `Frontend:` Next.js 14 (App Router, TypeScript), Tailwind CSS, Redux Toolkit, Framer Motion, server-side route protection, secure cookie auth.

- `main flows:` User signup with optional referral code; first purchase by referred user credits both sides; dashboard metrics.

### 1.Software Requirements Specification (SRS)

####    1.1 Functional Requirements

- **Authentication:**
    - A user can register and login with email/password.

    - Passwords are hashed (bcrypt).

    - Logged-in sessions use httpOnly cookies (frontend) and `Bearer token (backend calls)`

- **Referrals:**
    - Every user has a unique referral code and shareable referral link.
    - Signup with a valid referral code creates a Referral(PENDING).

- **Purchases & Credits**

    - A user can create a purchase.
    - On a referred user’s first purchase only, grant 2 credits to both the referrer and the buyer.
    - `Idempotency:` Never double-credit for the same referral.
- **Dashboard**

- Display:

    - totalReferredUsers
    - referredUsersWhoPurchased
    - totalCreditsEarned (sum of credit ledger)
    - referralLink

####    1.2 Non-Functional Requirements

- `Security`: Hashed passwords, JWT expiring tokens, httpOnly cookies, input validation (Zod), Helmet, CORS.

- `Reliability`: Idempotent crediting using atomic state transition + unique index (userId, reason, meta).

- `Performance`: O(1)/O(n) read aggregates via Mongo queries and aggregation.

- `Scalability`: Stateless API; Mongo Atlas / horizontal scaling; SSR on critical pages.

- `Observability`: Structured logging (console), health check endpoint, easy to plug metrics.

- `Documentation`: Swagger (OpenAPI 3), this README.

- `DevX`: Strict TypeScript, linting, clear scripts, seed data.

#### 2. Project Scope, Risks & Mitigation

- `Risk:` Double-credit due to race conditions
`Mitigation`: Mongoose unique compound index (userId, reason, meta) + atomic update to switch Referral from PENDING→CONVERTED before granting credits.

- `Risk`:  Token leakage
`Mitigation`: httpOnly cookies; never expose tokens to JS; secure cookies in production; Helmet.

- `Risk`: Invalid referral codes
`Mitigation`: Validate on signup; short, collision-safe codes; DB uniqueness.

### 3. Endpoints

- `POST` /api/auth/signup → { token, user }  

- `POST` /api/auth/login → { token, user }

- `GET` /api/referrals **(auth)** → { referrals: [...] }

- `GET` /api/referrals/link **(auth)** → { referralCode, - referralLink }

- `POST` /api/purchases **(auth)** 
    → body { amount: number } → { purchase }

- `GET` /api/dashboard **(auth)** 
    → { totalReferredUsers, referredUsersWhoPurchased, totalCreditsEarned, referralLink }

