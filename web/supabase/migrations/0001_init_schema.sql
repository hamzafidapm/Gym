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
