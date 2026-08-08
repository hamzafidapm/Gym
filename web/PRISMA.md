# Database (Neon + Prisma)

Replaced the earlier Supabase setup (see `supabase/README.md`) with Neon
Postgres + Prisma. Schema: `prisma/schema.prisma`. Only real user-driven
state lives here — accounts, bookable class instances (`spotsAvailable` is
live), bookings, and contact submissions. Trainer bios, class-type copy,
plan pricing, testimonials and gallery stay static in `lib/data.ts`, same
scope boundary as before.

## Why the schema push happens at deploy time, not from here

This sandbox cannot reach Neon at all — Postgres needs a raw TCP connection
(port 5432), which doesn't go through this sandbox's HTTP-only egress proxy
the way Supabase's REST API (plain HTTPS) at least partially did. So instead
of a manual SQL-editor paste, **Vercel's own build step applies the schema**,
since Vercel's build environment has real network access. This is also just
the better pattern generally — schema sync as part of CI, not a manual step.

## Required Vercel setup

**Settings → Environment Variables** (Production, Preview, and Development):

| Key            | Value                                                    |
| -------------- | --------------------------------------------------------- |
| `DATABASE_URL` | The Neon connection string (`postgresql://...`)           |
| `AUTH_SECRET`  | A random secret for NextAuth session signing — generate with `openssl rand -base64 32` |

Neither is `NEXT_PUBLIC_`-prefixed — both are server-only and never reach the
browser bundle.

**Settings → General → Build Command** — override the default with:

```
prisma db push --accept-data-loss && npx tsx prisma/seed.ts && next build
```

- `prisma db push` syncs `schema.prisma` to Neon. Safe to run on every
  deploy: a no-op if the schema hasn't changed, and there's no
  migration-history bookkeeping to worry about at this scale.
  `--accept-data-loss` exists so a future schema change (e.g. narrowing a
  column) never hangs the build on an interactive confirmation prompt —
  worth knowing before you make a schema change that would actually drop
  data.
- `npx tsx prisma/seed.ts` reseeds the `GymClass` table only —
  `prisma/seed.ts` does `deleteMany()` + `createMany()` on classes and
  nothing else. It never touches `User`, `Booking`, or `ContactMessage`, so
  redeploying never wipes real members or their bookings.

## What's NOT runtime-verified

Same caveat as the Supabase attempt: this was written, typechecked
(`tsc --noEmit`), linted, and built (`next build`) successfully, but this
sandbox cannot reach Neon to exercise it end to end. `next build` doesn't
need to — every Prisma-touching call happens in Server Actions
(`app/actions/*.ts`) invoked client-side after hydration or from route
handlers, never during static generation. Once deployed with the Build
Command above, test: sign up → book a class → check spots decremented →
cancel it → check spots restored → sign out → sign back in → the contact
form. Report back anything that doesn't work.

## Local development

Won't work from this sandbox (no network to Neon), but for the record:

```
cp .env.example .env   # fill in DATABASE_URL and AUTH_SECRET
npm install             # postinstall runs `prisma generate`
npm run db:push          # prisma db push
npm run db:seed          # seeds GymClass
npm run dev
```
