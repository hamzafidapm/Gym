# Supabase

Schema for the IRONHAUS project (`https://pidjxjmlwdzgjbdnyjma.supabase.co`).
**Applied and verified** — all 9 tables exist with the expected row counts
(6 trainers, 6 class_categories, 24 classes, 3 plans, 4 testimonials,
8 gallery_items, and empty `members`/`bookings`/`contact_messages` waiting on
real signups).

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

## What's NOT done yet

The Next.js app still reads from the static `lib/data.ts` — nothing in the UI
calls Supabase yet. This migration only sets up the database. Swapping the
frontend over (auth, real bookings via `book_class`/`cancel_booking`, content
from the tables instead of `lib/data.ts`) is a separate follow-up.

## Regenerating types

`lib/supabase/types.ts` is hand-written to match this schema. Once the
Supabase CLI can reach this project, regenerate it for a guaranteed match:

```
npx supabase gen types typescript --project-id pidjxjmlwdzgjbdnyjma > lib/supabase/types.ts
```
