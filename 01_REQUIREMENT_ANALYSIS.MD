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

####    High-Level Design (HLD)

```mermid
💡 System Context:

flowchart LR
  User[End User (Web)] -->|HTTP(S)| Frontend[Next.js 14 App]
  Frontend -->|Proxy /api/*| Backend[Express (TS)]
  Backend -->|Mongoose| Mongo[(MongoDB)]
  Dev[Developer] -->|Swagger| Backend

🔥 Backend Component Diagram  
graph TD
  A[Express App] --> B[Routes]
  B --> C[Auth Routes]
  B --> D[Referral Routes]
  B --> E[Purchase Routes]
  B --> F[Dashboard Routes]

  A --> G[Middleware (helmet, cors, json, auth)]
  A --> H[Swagger UI]

  C --> I[Auth Controller]
  D --> J[Referral Controller]
  E --> K[Purchase Controller]
  F --> L[Dashboard Controller]

  I & J & K & L --> M[Mongoose Models: User, Referral, Purchase, CreditLedger]
  M --> N[MongoDB]

🔥 Frontend Component Diagram:
graph TD
  App[Next.js App Router] --> Layout[Root Layout]
  Layout --> Navbar
  Layout --> ToastProvider
  Layout --> ReduxProvider

  App --> Pages[Server/Client Pages]
  Pages --> APIProxy[Next API Routes]
  APIProxy --> Backend[Express API]

```

- Key Sequence Diagrams:

```mermid
📈 sequenceDiagram

  participant U as User
  participant FE as Frontend (Next)
  participant BE as Backend (Express)
  participant DB as MongoDB

  U->>FE: POST /api/register {email, pwd, name, referralCode?}
  FE->>BE: /api/auth/signup
  BE->>DB: create User, if referralCode -> create Referral(PENDING)
  DB-->>BE: ok
  BE-->>FE: {token, user}
  FE-->>U: httpOnly cookie set, redirect/dashboard

---

✅ First purchase triggers credits:

  participant U as Referred User
  participant FE as Frontend
  participant BE as Backend
  participant DB as MongoDB

  U->>FE: POST /api/me/purchases {amount}
  FE->>BE: /api/purchases (Bearer)
  BE->>DB: create Purchase (isFirst?)
  alt first purchase
    BE->>DB: findOneAndUpdate Referral PENDING->CONVERTED
    DB-->>BE: ref updated?
    alt ref updated
      BE->>DB: create CreditLedger (+2 referrer, +2 buyer) with unique index
    end
  end
  DB-->>BE: ok
  BE-->>FE: 201 {purchase}
  FE-->>U: success toast
---

✅ Dashboard metrics:
sequenceDiagram
  participant FE as Frontend (SSR)
  participant BE as Backend
  participant DB as MongoDB

  FE->>BE: GET /api/dashboard (Bearer)
  BE->>DB: counts & aggregate credits (cast userId to ObjectId)
  DB-->>BE: metrics
  BE-->>FE: JSON
  FE-->>FE: server-render dashboard

```

### Implementation Plan (Development)

- Scaffold projects (backend + frontend).

- Models & Migrations: Create Mongoose schemas, indexes.

- Controllers & Routes: Implement routes, validation, middleware.

- Idempotent logic: Add unique index (userId, reason, meta), atomic referral conversion.

- Swagger: Document endpoints.

- Frontend: Auth pages, protected dashboard/referrals, purchase form, Redux store, toasts.

Security: JWT, cookie storage, Helmet, CORS.

- Seed: Lina scenario with 10 referred / 4 converted (8 credits).

- Polish: Error messaging, loading states, animations.

- Docs: This README and Swagger.