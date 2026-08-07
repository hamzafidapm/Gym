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
