# FileSure Referral Frontend (Next.js 14 + TS + Tailwind + Redux Toolkit + Framer Motion)

This is the frontend for the Referral & Credit System. It targets the Mongo/Express backend.

## Quick start
```bash
npm install
cp .env.example .env
# Edit BACKEND_URL if needed
npm run dev
```
Open http://localhost:3000

## Tech
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (no UI kits)
- Redux Toolkit for state management
- Zod validation
- Framer Motion animations
- Secure cookies session (httpOnly) via Next API routes proxying to backend

## Pages
- `/login`, `/register`
- `/dashboard` (metrics + referral link copy)
- `/referrals` (list)
- `/purchase` (simulate purchase)

## Env
- `BACKEND_URL` – your backend origin (e.g., http://localhost:4000)


## Extras added
- **Protected routes** via `middleware.ts` (redirects to `/login` if no cookie).
- **Toast notifications** via headless `ToastProvider`.
- **Session/Profile API** at `/api/me/profile` to hydrate Redux Toolkit after refresh.
- **Dockerfile** and **vercel.json** for deployment.



## SSR-protected routes
- `/dashboard` and `/referrals` are **server components** that read the cookie on the server and redirect to `/login` if unauthenticated.
- Navbar shows **Profile/Logout** when authenticated; logout posts to `/api/logout` and redirects.



State management is now powered by **Redux Toolkit**; 
