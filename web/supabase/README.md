# Supabase (superseded)

**This backend was replaced with Neon Postgres + Prisma.** See `../prisma/`
for the current schema and `../PRISMA.md` for setup. This folder is kept
only as historical reference — the Supabase project itself
(`https://pidjxjmlwdzgjbdnyjma.supabase.co`) still exists with its schema
applied and seeded, in case it's ever useful to look back at, but nothing in
the app reads from it anymore.

---

Schema for the IRONHAUS project (`https://pidjxjmlwdzgjbdnyjma.supabase.co`).

**Schema history:** the version verified against the live project (row counts
matching) predates the extended `handle_new_user` trigger, which now reads
`phone`/`plan_id`/`cycle` off signup metadata so a member's plan is set the
moment they sign up, session or not (see `migrations/0003`). Re-run
`RUN_THIS_IN_SQL_EDITOR.sql` to pick that up — it's a full reset + recreate,
safe since there's no real member data yet.

## Apply it

Paste `RUN_THIS_IN_SQL_EDITOR.sql` into the Supabase Dashboard → **SQL Editor** →
New query → Run. It creates the tables/RLS policies/functions and seeds the
content tables (trainers, classes, plans, testimonials, gallery) with the data
currently hardcoded in `lib/data.ts`, so the DB starts in sync with the live
site. It starts with an idempotent reset (`0000_reset.sql`), so it's safe to
re-run if you ever need to reapply it.

The same statements also live as separate, ordered files for future use with
the Supabase CLI (`supabase link` + `supabase db push`) once it has network
access to this project:

- `migrations/0001_init_schema.sql` — tables + indexes
- `migrations/0002_rls_policies.sql` — row level security
- `migrations/0003_functions_triggers.sql` — `book_class` / `cancel_booking`
  RPCs (atomic seat counting) + the `handle_new_user` trigger that creates a
  `members` row on signup
- `seed.sql` — content seed data

## What this used to wire up

Auth, members, bookings, live class instances (real seat counts), and the
contact form were wired to this schema. Trainer bios, class-type copy,
testimonials, the gallery, and plan marketing copy stayed static in
`lib/data.ts` — that scope boundary (editorial content static, only real
user-driven state live) carried over unchanged to the Prisma version.

Auth was email + password via Supabase Auth (`supabase.auth.signUp` /
`signInWithPassword`). The Prisma version replaced this with NextAuth
(Auth.js) Credentials provider + bcrypt, since Neon is just a database with
no built-in auth.

## Not runtime-verified

This was written and typechecked/built but never actually exercised against
this Supabase project before the switch to Neon — the sandbox that built it
couldn't reach `supabase.co` at all. What *was* verified in a browser: every
page rendered without crashing, and every Supabase-dependent page degraded
gracefully into a visible error/retry state when the network call failed.
