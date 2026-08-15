# IRONHAUS

A gym booking site for a fictional East Austin strength studio — built from a
Claude Design prototype (see `../README.md` and `../chats/` at the repo root
for the original handoff).

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** [Neon](https://neon.tech) (serverless Postgres) via
  [Prisma](https://www.prisma.io) — schema in `prisma/schema.prisma`, driven
  through the `@prisma/adapter-pg` driver adapter
- **Auth:** [NextAuth (Auth.js) v5](https://authjs.dev), Credentials provider
  (email + password, bcrypt-hashed), JWT sessions
- **Data access:** Next.js Server Actions (`app/actions/*.ts`) — no separate
  API layer; authorization is explicit `userId` checks in each action
  (there's no database-level row security on a plain Postgres + Prisma setup)
- **Images:** `next/image` with `sharp`

Trainer bios, class-type descriptions, plan pricing, testimonials, and the
gallery are static content in `lib/data.ts` — no functional need to be
database-backed. Only what real members actually change is live: accounts,
bookable class instances (seat counts), bookings, and contact form
submissions.

## Database setup

See `PRISMA.md` for the full picture, including why schema sync runs as part
of the Vercel build rather than a local migration step, and what hasn't been
runtime-verified yet.

## Getting started

```
npm install
cp .env.example .env   # fill in DATABASE_URL and AUTH_SECRET
npm run db:push
npm run db:seed
npm run dev
```

## History

This project's database layer was originally built on Supabase (schema,
RLS policies, and Supabase Auth) — see `supabase/README.md` for that
history. It was later migrated to Neon + Prisma + NextAuth; the Supabase
project still exists but nothing in this app reads from it anymore.
