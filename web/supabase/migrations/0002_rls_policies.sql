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
