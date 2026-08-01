# Eventos

Eventos is a modern community + events ecosystem built for structured developer communities, discussions, and collaborative engagement.

The platform combines:
- communities
- discussions & channels
- events
- members systems
- activity feeds
- optimistic interactions
- premium SaaS UI patterns

Built using:
- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL / Neon
- NextAuth
- Tailwind CSS
- Framer Motion

---

# Features

## Community Ecosystem

- Community discovery
- Join / leave system
- Community dashboards
- Community hero banners
- Members system
- Trending channels
- Activity indicators

---

## Discussions System

- Channel categories
- Structured discussions
- Replies system
- Optimistic thread creation
- Rich discussion cards
- Activity facepiles
- Trending discussions

---

## Events System

- Event creation
- Featured events
- Community event pages
- Event preview cards

---

## UI / UX

- Glassmorphism design system
- Framer Motion animations
- Layout-matching skeleton loaders
- Responsive layouts
- Shared media system
- Premium loading states
- Modern SaaS density

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js App Router |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL / Neon |
| Authentication | NextAuth |
| Styling | Tailwind CSS |
| Animations | Framer Motion |

---

# Project Structure

```txt
app/
components/
lib/
prisma/
public/
server/
```

Important community routes:

```txt
app/communities/[slug]/
```

Contains:
- dashboard
- discussions
- events
- members
- resources

---

# Local Setup

## 1. Install dependencies

```bash
npm install
```

---

## 2. Create environment file

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

Then fill all required values.

---

## 3. Generate Prisma client

```bash
npx prisma generate
```

---

## 4. Push database schema

```bash
npx prisma db push
```

---

## 5. Start development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# Scripts

## Development

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
```

---

## Type Checking

```bash
npx tsc --noEmit
```

---

## Linting

```bash
npm run lint
```

---

# Prisma Commands

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Push Database Schema

```bash
npx prisma db push
```

---

## Open Prisma Studio

```bash
npx prisma studio
```

---

# Important Team Rules

Do NOT:
- commit `.env.local`
- commit secrets
- push broken TypeScript
- modify Prisma generated files
- bypass build/type errors

Always run before pushing:

```bash
npx tsc --noEmit
npm run build
```

---

# Common Fixes

## Regenerate Prisma Client

```bash
npx prisma generate
```

---

## Clear Next.js Cache

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force .next
```

Then restart:

```bash
npm run dev
```

---

## TypeScript Validation

```bash
npx tsc --noEmit
```

---

# Environment Variables

See:

```txt
.env.example
```

---

# Notes

The project uses:
- App Router
- Server Components
- Optimistic UI
- Prisma relational queries
- Framer Motion

Be careful when modifying:
- overlays
- optimistic updates
- route refreshes
- modal systems
- server/client boundaries

---

# Status

Eventos is currently under active development.

Core systems implemented:
- communities
- discussions
- events
- dashboards
- replies
- optimistic interactions
- premium media system
- responsive layouts

---
