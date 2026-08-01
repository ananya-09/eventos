# Eventos Setup Guide

This guide helps contributors run Eventos locally with full backend functionality.

---

# 1. Install Dependencies

Using npm:

```bash
npm install
```

OR using pnpm:

```bash
pnpm install
```

---

# 2. Create Environment File

Create:

```txt
.env.local
```

Copy contents from:

```txt
.env.example
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Mac/Linux:

```bash
cp .env.example .env.local
```

Then fill all required environment variables.

---

# 3. Setup Database

Eventos uses:
- PostgreSQL
- Prisma ORM
- Neon Database

Create database at:

```txt
https://neon.tech
```

Paste your database URL inside:

```env
DATABASE_URL=
```

---

# 4. Setup OAuth Providers

## GitHub OAuth

Create OAuth app at:

```txt
https://github.com/settings/developers
```

### Required Callback URL

```txt
http://localhost:3000/api/auth/callback/github
```

Fill:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## Google OAuth (Optional)

Create credentials at:

```txt
https://console.cloud.google.com/apis/credentials
```

### Required Redirect URI

```txt
http://localhost:3000/api/auth/callback/google
```

Fill:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

# 5. Generate Prisma Client

Run:

```bash
npx prisma generate
```

---

# 6. Push Database Schema

Run:

```bash
npx prisma db push
```

This will:
- sync Prisma schema
- create database tables
- apply latest models

---

# 7. Start Development Server

Using npm:

```bash
npm run dev
```

OR using pnpm:

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000
```

---

# 8. Recommended Validation Commands

Before pushing changes run:

## Type Check

```bash
npx tsc --noEmit
```

---

## Production Build

```bash
npm run build
```

---

# 9. Useful Prisma Commands

## Open Prisma Studio

```bash
npx prisma studio
```

---

## Regenerate Prisma Client

```bash
npx prisma generate
```

---

## Reset Database (DANGEROUS)

```bash
npx prisma migrate reset
```

WARNING:
This deletes all local database data.

---

# 10. Common Fixes

## Prisma Errors

Run:

```bash
npx prisma generate
```

Then:

```bash
npx prisma db push
```

---

## TypeScript Errors

Run:

```bash
npx tsc --noEmit
```

---

## Clear Next.js Cache

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force .next
```

Mac/Linux:

```bash
rm -rf .next
```

Then restart:

```bash
npm run dev
```

---

## Images Not Loading

Ensure:

```txt
next.config.mjs
```

contains:

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

Then restart the dev server.

---

# 11. Team Workflow

## Pull Latest Changes

```bash
git pull origin main
```

---

## Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

---

## Push Changes

```bash
git add .
git commit -m "your message"
git push origin feature/your-feature-name
```

---

# 12. Important Rules

Do NOT:
- commit `.env.local`
- commit secrets
- push broken TypeScript
- edit Prisma generated files
- bypass build/type errors

Always verify before pushing:

```bash
npx tsc --noEmit
npm run build
```

---

# 13. Notes

Eventos uses:
- App Router
- Server Components
- Prisma relational queries
- Optimistic UI
- Framer Motion animations

Be careful when modifying:
- overlays
- route refreshes
- optimistic interactions
- server/client boundaries
- modal systems
- loading orchestration

---