# Supabase

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

## Frontend wiring

Auth, members, bookings, live class instances (real seat counts), and the
contact form are wired to this schema (see `lib/AppStateContext.tsx` and
`lib/supabase/queries.ts`). Trainer bios, class-type copy, testimonials, the
gallery, and plan marketing copy stay static in `lib/data.ts` —
editorial content with no functional need to be live. `trainers`,
`class_categories`, `plans`, `testimonials`, `gallery_items` are seeded and
kept in sync by hand for now; they exist mainly so a future CMS-style edit
flow has somewhere to write to. Only `classes.spots_available` and
`bookings` actually change through user actions, which is why those two are
the ones wired live.

Auth is email + password (`supabase.auth.signUp` / `signInWithPassword`). If
this project has "Confirm email" enabled (Authentication → Providers → Email
in the dashboard — on by default for new projects), `signUp()` won't return
an active session until the user clicks the confirmation link, so the join
flow's success screen adapts its copy for that case instead of assuming
immediate dashboard access.

## Regenerating types

`lib/supabase/types.ts` is hand-written to match this schema, but
`lib/supabase/client.ts` does **not** pass it as `createClient<Database>`
— the hand-written shape didn't line up cleanly with this supabase-js
version's generic constraints across `.rpc()` / `.insert()` overloads, so
call sites (`queries.ts`, `AppStateContext.tsx`) cast row shapes explicitly
instead. Once the CLI can reach this project, regenerate real types and
re-wire the generic:

```
npx supabase gen types typescript --project-id pidjxjmlwdzgjbdnyjma > lib/supabase/types.ts
```

## Not yet runtime-verified

The frontend wiring above was written and typechecked/built (`tsc`, `eslint`,
`next build`) but never actually exercised against this Supabase project —
the sandbox that built it can't reach `supabase.co` at all (not a
credentials issue, an egress allowlist one). What *was* verified in a
browser from that sandbox: every page renders without crashing, and every
Supabase-dependent page (classes, join, dashboard, contact) degrades
gracefully into a visible error/retry state when the network call fails,
rather than hanging or throwing. What's untested: an actual successful
signup, booking, cancellation, or contact submission end to end. Test those
once this is deployed somewhere with real network access, and report back
anything that doesn't work as expected.
