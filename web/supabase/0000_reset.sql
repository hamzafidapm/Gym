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
