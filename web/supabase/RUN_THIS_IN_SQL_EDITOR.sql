-- ============================================================
-- IRONHAUS — full schema + seed, in order.
-- Paste this whole file into Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run: starts with an idempotent reset, so a previous
-- partial/failed attempt won't cause 'already exists' errors.
-- (Individual, versioned files are in supabase/migrations/ + supabase/seed.sql
-- for future `supabase db push` once the CLI is linked to this project.)
-- ============================================================

-- ---- 0000_reset.sql ----
-- Idempotent cleanup so RUN_THIS_IN_SQL_EDITOR.sql can be re-run safely after
-- a partial/failed run. Safe to run even if nothing exists yet.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.book_class(uuid);
drop function if exists public.cancel_booking(uuid);

drop table if exists public.bookings cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.members cascade;
drop table if exists public.classes cascade;
drop table if exists public.class_categories cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.gallery_items cascade;
drop table if exists public.plans cascade;
drop table if exists public.trainers cascade;

drop type if exists class_type;
drop type if exists class_level;
drop type if exists weekday;
drop type if exists billing_cycle;
drop type if exists booking_status;

-- ---- migrations/0001_init_schema.sql ----
-- IRONHAUS core schema
-- Content tables (trainers, class_categories, classes, plans, testimonials,
-- gallery_items) mirror what currently ships hardcoded in lib/data.ts, so the
-- app can be switched from static data to Supabase without changing shape.

create extension if not exists "pgcrypto";

create type class_type as enum ('Strength', 'HIIT', 'Boxing', 'Yoga', 'Cycle', 'Mobility');
create type class_level as enum ('L1', 'L2', 'L3');
create type weekday as enum ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
create type billing_cycle as enum ('monthly', 'annual');
create type booking_status as enum ('booked', 'cancelled');

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

create table public.trainers (
  id text primary key,
  name text not null,
  first_name text not null,
  specialty text not null,
  certs text not null,
  short_bio text not null,
  bio text not null,
  image_path text not null,
  created_at timestamptz not null default now()
);

create table public.class_categories (
  id class_type primary key,
  name text not null,
  blurb text not null,
  image_path text not null,
  weekly_count int not null default 0,
  sort_order int not null default 0
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type class_type not null references public.class_categories (id),
  day weekday not null,
  start_time time not null,
  duration_min int not null check (duration_min > 0),
  trainer_id text not null references public.trainers (id),
  spots_available int not null default 0 check (spots_available >= 0),
  level class_level not null,
  room text not null,
  created_at timestamptz not null default now()
);

create index classes_day_idx on public.classes (day);
create index classes_type_idx on public.classes (type);
create index classes_trainer_idx on public.classes (trainer_id);

create table public.plans (
  id text primary key, -- 'BASIC' | 'PREMIUM' | 'ELITE'
  tag text not null,
  monthly_price numeric(10, 2) not null,
  summary text not null,
  features jsonb not null default '[]'::jsonb,
  sort_order int not null default 0
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  member_name text not null,
  meta text not null,
  sort_order int not null default 0
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  alt_text text not null,
  label text not null,
  image_path text not null,
  object_position text not null default 'center',
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Members & bookings
-- ---------------------------------------------------------------------------

create table public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  plan_id text references public.plans (id),
  cycle billing_cycle not null default 'monthly',
  member_since date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  status booking_status not null default 'booked',
  booked_at timestamptz not null default now(),
  cancelled_at timestamptz
);

-- one active (non-cancelled) booking per member per class
create unique index bookings_member_class_active_idx
  on public.bookings (member_id, class_id)
  where (status = 'booked');

create index bookings_member_idx on public.bookings (member_id);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---- migrations/0002_rls_policies.sql ----
-- Row Level Security
-- Content tables are public read-only (edited only via the dashboard /
-- service role). Member data is readable/writable only by its owner.
-- Booking writes are NOT opened directly — they only happen through the
-- SECURITY DEFINER functions in 0003_functions_triggers.sql, so seat counts
-- can never drift out of sync with the rows in `bookings`.

alter table public.trainers enable row level security;
alter table public.class_categories enable row level security;
alter table public.classes enable row level security;
alter table public.plans enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_items enable row level security;
alter table public.members enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;

create policy "Public read access" on public.trainers for select using (true);
create policy "Public read access" on public.class_categories for select using (true);
create policy "Public read access" on public.classes for select using (true);
create policy "Public read access" on public.plans for select using (true);
create policy "Public read access" on public.testimonials for select using (true);
create policy "Public read access" on public.gallery_items for select using (true);

create policy "Members can view their own profile"
  on public.members for select
  using (auth.uid() = id);

create policy "Members can update their own profile"
  on public.members for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Members can view their own bookings"
  on public.bookings for select
  using (auth.uid() = member_id);

create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

-- ---- migrations/0003_functions_triggers.sql ----
-- Auto-create a members row whenever someone signs up through Supabase Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.members (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Book a class for the signed-in member. Atomically checks + decrements the
-- seat count so two concurrent bookers can't both take the last spot.
create function public.book_class(p_class_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid := auth.uid();
  v_spots int;
  v_booking public.bookings;
begin
  if v_member_id is null then
    raise exception 'Must be signed in to book a class';
  end if;

  select spots_available into v_spots
  from public.classes
  where id = p_class_id
  for update;

  if not found then
    raise exception 'Class not found';
  end if;

  if v_spots <= 0 then
    raise exception 'Class is full';
  end if;

  insert into public.bookings (member_id, class_id, status)
  values (v_member_id, p_class_id, 'booked')
  on conflict (member_id, class_id) where (status = 'booked')
    do nothing
  returning * into v_booking;

  if v_booking.id is null then
    raise exception 'Already booked';
  end if;

  update public.classes
  set spots_available = spots_available - 1
  where id = p_class_id;

  return v_booking;
end;
$$;

-- Cancel a booking owned by the signed-in member and give the seat back.
create function public.cancel_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid := auth.uid();
  v_booking public.bookings;
begin
  update public.bookings
  set status = 'cancelled', cancelled_at = now()
  where id = p_booking_id
    and member_id = v_member_id
    and status = 'booked'
  returning * into v_booking;

  if v_booking.id is null then
    raise exception 'Booking not found';
  end if;

  update public.classes
  set spots_available = spots_available + 1
  where id = v_booking.class_id;

  return v_booking;
end;
$$;

grant execute on function public.book_class(uuid) to authenticated;
grant execute on function public.cancel_booking(uuid) to authenticated;

-- ---- seed.sql ----
-- Seed data mirroring the current static content in lib/data.ts, so the
-- database starts in sync with what's already live on the site.

insert into public.trainers (id, name, first_name, specialty, certs, short_bio, bio, image_path) values
('mara', 'Mara Vance', 'MARA', 'STRENGTH / POWERLIFTING', 'NSCA-CSCS, USAW L2, Precision Nutrition L1',
  'Ten years under a bar. Programs the Heavy Metal block.',
  'Mara ran collegiate strength and conditioning for six years before opening the IRONHAUS barbell program. She coaches the squat like a craft: slow accessories, honest loads, and a logbook you actually fill in.',
  '/img/strength.png'),
('dez', 'Dez Okafor', 'DEZ', 'BOXING / CONDITIONING', 'USA Boxing L2, NASM-CPT',
  'Amateur record 18-3. Teaches footwork before fists.',
  'Dez spent nine years in the amateur ranks and now runs our boxing floor. Expect long rounds on the bag, real defensive drills, and zero cardio-kickboxing choreography.',
  '/img/boxing.png'),
('iris', 'Iris Lund', 'IRIS', 'YOGA / MOBILITY', 'RYT-500, FRCms, Yin 100hr',
  'Recovery is training. She makes sure you believe it.',
  'Iris builds the mobility work that keeps heavy lifters lifting. Her sessions are quiet, precise, and unexpectedly hard — end range strength, not stretching for its own sake.',
  '/img/yoga.png'),
('cole', 'Cole Rivas', 'COLE', 'HIIT / METCON', 'CF-L3, NSCA-CSCS',
  'Built the 34-minute engine block. Sorry in advance.',
  'Cole designs our conditioning: intervals with a purpose, scaled three ways, tracked week over week so you can see the engine getting bigger.',
  '/img/hiit.png'),
('nia', 'Nia Brooks', 'NIA', 'CYCLE / ENDURANCE', 'Schwinn Certified, ACE-CPT, Power-based training',
  'Power-based rides. Watts, not vibes.',
  'Nia rides with numbers. Every bike is power-metered and every ride has a target — threshold work, sweet spot, or a genuinely fun sprint night on Fridays.',
  '/img/hiit.png'),
('tomas', 'Tomas Ehle', 'TOMAS', 'PERSONAL TRAINING / REHAB', 'DPT, NSCA-CSCS, FMS L2',
  'Physio background. The one you see after the tweak.',
  'Tomas is a licensed physical therapist who works one-on-one with members returning from injury, bridging the gap between the clinic and the platform.',
  '/img/coaching.png');

insert into public.class_categories (id, name, blurb, image_path, weekly_count, sort_order) values
('Strength', 'STRENGTH', 'Barbell blocks, real loads, a logbook that fills up.', '/img/strength.png', 6, 1),
('HIIT', 'HIIT', 'Measured intervals. Rower, bike, sled, carry, repeat.', '/img/hiit.png', 4, 2),
('Boxing', 'BOXING', 'Footwork before fists. Contact always optional.', '/img/boxing.png', 4, 3),
('Yoga', 'YOGA', 'Warm, slow, built for people who lift heavy.', '/img/yoga.png', 3, 4),
('Cycle', 'CYCLE', 'Power-metered rides with a written target.', '/img/hiit.png', 4, 5),
('Mobility', 'MOBILITY', 'End-range strength. Assessed and re-tested.', '/img/coaching.png', 3, 6);

insert into public.classes (name, type, day, start_time, duration_min, trainer_id, spots_available, level, room) values
('Heavy Metal', 'Strength', 'Mon', '06:00', 60, 'mara', 4, 'L2', 'A'),
('Engine Room', 'HIIT', 'Mon', '12:15', 45, 'cole', 9, 'L2', 'B'),
('Mobility Reset', 'Mobility', 'Mon', '18:30', 45, 'iris', 12, 'L1', 'C'),
('Bag Work 101', 'Boxing', 'Mon', '19:30', 60, 'dez', 6, 'L1', 'B'),
('Squat Club', 'Strength', 'Tue', '06:30', 75, 'mara', 2, 'L3', 'A'),
('Threshold Ride', 'Cycle', 'Tue', '07:00', 45, 'nia', 5, 'L2', 'D'),
('Slow Flow', 'Yoga', 'Tue', '17:30', 60, 'iris', 14, 'L1', 'C'),
('Metcon 34', 'HIIT', 'Tue', '18:45', 35, 'cole', 0, 'L3', 'B'),
('Press Day', 'Strength', 'Wed', '06:00', 60, 'mara', 7, 'L2', 'A'),
('Sparring Skills', 'Boxing', 'Wed', '12:00', 60, 'dez', 3, 'L2', 'B'),
('Power Hour', 'Cycle', 'Wed', '18:00', 60, 'nia', 8, 'L2', 'D'),
('Yin & Breath', 'Yoga', 'Wed', '20:00', 60, 'iris', 11, 'L1', 'C'),
('Pull Day', 'Strength', 'Thu', '06:30', 60, 'mara', 6, 'L2', 'A'),
('Engine Room', 'HIIT', 'Thu', '12:15', 45, 'cole', 4, 'L2', 'B'),
('Footwork Lab', 'Boxing', 'Thu', '18:30', 45, 'dez', 9, 'L1', 'B'),
('Deep Mobility', 'Mobility', 'Thu', '19:30', 45, 'iris', 13, 'L1', 'C'),
('Total Body', 'Strength', 'Fri', '06:00', 60, 'mara', 5, 'L1', 'A'),
('Sprint Night', 'Cycle', 'Fri', '17:30', 45, 'nia', 1, 'L3', 'D'),
('Fight Fit', 'Boxing', 'Fri', '18:30', 60, 'dez', 7, 'L2', 'B'),
('Saturday Grind', 'HIIT', 'Sat', '09:00', 60, 'cole', 10, 'L2', 'B'),
('Barbell Basics', 'Strength', 'Sat', '10:30', 75, 'mara', 8, 'L1', 'A'),
('Long Ride', 'Cycle', 'Sat', '08:00', 75, 'nia', 6, 'L2', 'D'),
('Recovery Flow', 'Yoga', 'Sun', '09:30', 60, 'iris', 15, 'L1', 'C'),
('Sunday Reset', 'Mobility', 'Sun', '11:00', 45, 'tomas', 12, 'L1', 'C');

insert into public.plans (id, tag, monthly_price, summary, features, sort_order) values
('BASIC', 'GET STARTED', 39, 'Open gym + 4 classes a month',
  '["24/7 open gym access", "4 group classes per month", "Full locker room + towel service", "Free InBody scan every quarter"]'::jsonb, 1),
('PREMIUM', 'MOST POPULAR', 79, 'Unlimited classes, everything open',
  '["Everything in Basic", "Unlimited group classes", "Priority booking 14 days out", "1 personal training session / month", "Recovery room + sauna access"]'::jsonb, 2),
('ELITE', 'FULL SUPPORT', 129, 'Coached, programmed, tracked',
  '["Everything in Premium", "4 personal training sessions / month", "Custom 8-week written program", "Nutrition check-in every 2 weeks", "Guest passes ×2 per month"]'::jsonb, 3);

insert into public.testimonials (quote, member_name, meta, sort_order) values
('I came in to lose weight and left with a 245 lb deadlift I didn’t know I wanted. Fourteen months, three blocks, zero missed check-ins.', 'Priya R.', 'Member since 2024 · Premium', 1),
('Every other gym sold me a year. IRONHAUS gave me a program and a coach who noticed when I stopped showing up.', 'Marcus T.', 'Member since 2022 · Elite', 2),
('Post-surgery I thought heavy training was over. Tomas rebuilt my shoulder in eight weeks of boring, careful work. I press again.', 'Elena D.', 'Member since 2023 · Elite', 3),
('The 06:00 crew is the only reason I get out of bed. Nobody performs. Everybody works.', 'Jae Kim', 'Member since 2021 · Premium', 4);

insert into public.gallery_items (alt_text, label, image_path, object_position, sort_order) values
('Member locking out a heavy deadlift on the platform', 'PLATFORM / 06:00', '/img/strength.png', 'center 35%', 1),
('Coach cueing a dumbbell row during a personal training session', 'SPOT / 1-ON-1', '/img/coaching.png', 'center 30%', 2),
('Fighter wrapping his hands before bag work', 'WRAPS / BAG ROW', '/img/boxing.png', 'center 45%', 3),
('Group class moving through a squat interval', 'ENGINE ROOM', '/img/hiit.png', 'center 40%', 4),
('Sunset yoga class in Studio C', 'STUDIO C / 20:00', '/img/yoga.png', 'center 45%', 5),
('Barbell set up for a strength block', 'STRENGTH BLOCK', '/img/strength.png', 'left 40%', 6),
('Coach leading the Saturday group session', 'SATURDAY CREW', '/img/hiit.png', 'right 45%', 7),
('Boxing gloves and wraps on the conditioning floor', 'GLOVES', '/img/boxing.png', 'left 55%', 8);

